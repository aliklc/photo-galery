'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadMemory(formData: FormData) {
  const supabase = await createClient()

  // Oturum kontrolü
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const file = formData.get('image') as File
  const description = formData.get('description') as string
  const date = formData.get('date') as string

  if (!file) throw new Error('No file uploaded')

  // 1. Resmi Storage'a yükle
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(filePath, file)

  if (uploadError) {
    console.error(uploadError)
    throw new Error('Upload failed')
  }

  // 2. Public URL al
  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(filePath)

  // 3. Veritabanına kaydet
  const { data: insertedData, error: dbError } = await supabase
    .from('memories')
    .insert({
      image_url: publicUrl,
      image_path: filePath,
      description,
      memory_date: date || new Date().toISOString(),
    })
    .select()
    .single()

  if (dbError) throw new Error('Database insert failed')

  revalidatePath('/')
  return { success: true, memory: insertedData }
}

export async function deleteMemory(id: string, imagePath: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Storage'dan sil
  const { error: storageError } = await supabase.storage
    .from('photos')
    .remove([imagePath])

  if (storageError) throw new Error('Storage delete failed')

  // 2. DB'den sil
  const { error: dbError } = await supabase
    .from('memories')
    .delete()
    .match({ id })

  if (dbError) throw new Error('DB delete failed')

  revalidatePath('/')
}

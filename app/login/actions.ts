'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(prevState: { error?: string } | null, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Hata durumunda (Hata yönetimi basitleştirilmiştir)
    return { error: 'Giriş yapılamadı. Bilgileri kontrol et.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
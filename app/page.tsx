import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GalleryContainer from '@/app/components/gallery-container'
import RelationshipCounter from '@/app/components/relationship-counter'

export default async function Home() {
  const supabase = await createClient()

  // Kullanıcı kontrolü
  const { data: { user } } = await supabase.auth.getUser()

  // Eğer kullanıcı yoksa Login sayfasına yönlendir (Login sayfasını oluşturman gerekecek)
  if (!user) {
    redirect('/login')
  }

  // Verileri çek
  const { data: memories } = await supabase
    .from('memories')
    .select('*')
    .order('memory_date', { ascending: false })

  // Başlangıç tarihi (Burayı kendi tarihinizle değiştirin)
  // Format: YYYY-MM-DDTHH:mm:ss (Örnek: 2024-08-11T14:30:00)
  const startDate = new Date('2024-08-11T16:04:00')

  return (
    <main className="min-h-screen bg-linear-to-br from-stone-50 to-stone-100 p-4 md:p-8">
      <header className="mb-6 md:mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-light text-stone-900 mb-2 tracking-tight">Bizim Hikayemiz</h1>
        <p className="text-sm md:text-base text-stone-600 font-light mb-8">Birlikte biriktirdiğimiz anılar</p>
        <RelationshipCounter startDate={startDate} />
      </header>

      <GalleryContainer initialMemories={memories || []} />
    </main>
  )
}
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PhotoCard from '@/components/photo-card'
import UploadForm from '@/components/upload-form'
import Login from '@/components/login' // Eğer login ayrı bir sayfada değilse buraya eklenmeli, ama ayrı sayfa daha iyidir.

export default async function Home() {
  const supabase = createClient()

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

  return (
    <main className="min-h-screen bg-stone-50 p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-2">Bizim Hikayemiz</h1>
        <p className="text-stone-500">Birlikte biriktirdiğimiz anılar.</p>
      </header>

      {/* Masonry Layout benzeri için CSS Column kullanıyoruz */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 max-w-7xl mx-auto">
        {memories?.map((memory) => (
          <PhotoCard key={memory.id} memory={memory} />
        ))}
      </div>

      {/* Veri yoksa */}
      {(!memories || memories.length === 0) && (
        <div className="text-center py-20 text-stone-400">
          Henüz hiç anı eklenmemiş. Sağ alttaki butona tıkla!
        </div>
      )}

      <UploadForm />
    </main>
  )
}
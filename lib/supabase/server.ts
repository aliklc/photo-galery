import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
            return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
            try {
                cookiesToSet.forEach(({ name, value, options }) => {
                    // maxAge'i kaldırarak session cookie yapıyoruz (tarayıcı kapanınca silinir)
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { maxAge, ...sessionOptions } = options
                    cookieStore.set(name, value, sessionOptions)
                })
            } catch {
                // Server Action içinde değilsek hata verebilir, yoksayıyoruz.
            }
        },
      },
    }
  )
}
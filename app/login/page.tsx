'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Heart } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl">
        <CardHeader className="text-center space-y-6 pt-8">
          <div className="mx-auto bg-gradient-to-br from-rose-100 to-pink-100 p-4 rounded-full w-fit">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
          </div>
          <div>
            <CardTitle className="text-3xl font-light text-stone-900 mb-2">Hoş Geldiniz</CardTitle>
            <CardDescription className="font-light">
              Anılarınıza erişmek için giriş yapın
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Input 
                name="email" 
                type="email" 
                placeholder="Email" 
                required 
                className="h-12 font-light border-stone-200 focus:border-rose-400 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Input 
                name="password" 
                type="password" 
                placeholder="Şifre" 
                required 
                className="h-12 font-light border-stone-200 focus:border-rose-400 rounded-xl"
              />
            </div>
            {state?.error && (
              <div className="text-sm text-red-500 text-center font-light">
                {state.error}
              </div>
            )}
            <Button type="submit" disabled={isPending} className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-light border-0 shadow-lg rounded-xl">
              {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
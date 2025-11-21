'use client'

import { useRef, useState } from 'react'
import { uploadMemory } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusCircle, Loader2, CalendarIcon } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import heic2any from 'heic2any'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

// Tip tanımı (GalleryContainer ile aynı olmalı)
type Memory = {
  id: string
  image_url: string
  image_path: string
  description: string | null
  memory_date: string
}

export default function UploadForm({ onUploadSuccess }: { onUploadSuccess?: (memory: Memory) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setStatusMessage('Hazırlanıyor...')
    try {
      const description = formData.get('description') as string
      const dateStr = date ? date.toISOString() : new Date().toISOString()
      
      const files = formData.getAll('image') as File[]
      const validFiles = files.filter(f => f.size > 0)

      if (validFiles.length === 0) {
        toast.error("Lütfen en az bir fotoğraf seçin.")
        setLoading(false)
        return
      }

      let successCount = 0

      for (let i = 0; i < validFiles.length; i++) {
        let imageFile = validFiles[i]
        setStatusMessage(`${i + 1} / ${validFiles.length} yükleniyor...`)

        // HEIC kontrolü ve dönüşümü
        if (imageFile.name.toLowerCase().endsWith('.heic') || imageFile.type === 'image/heic') {
          try {
            const convertedBlob = await heic2any({
              blob: imageFile,
              toType: 'image/jpeg',
              quality: 0.8
            })
            
            const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
            imageFile = new File([blob], imageFile.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' })
          } catch (error) {
            console.error('HEIC conversion failed:', error)
            toast.error(`${imageFile.name} için HEIC dönüşümü başarısız oldu.`)
            continue // Sonraki dosyaya geç
          }
        }

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: 'image/jpeg',
          initialQuality: 0.8
        }
        
        let compressedFile: File
        try {
           compressedFile = await imageCompression(imageFile, options)
        } catch (compressionError) {
           console.error('Compression failed:', compressionError)
           compressedFile = imageFile
        }
        
        const newFormData = new FormData()
        newFormData.append('image', compressedFile, compressedFile.name)
        newFormData.append('date', dateStr)
        newFormData.append('description', description)
        
        const result = await uploadMemory(newFormData)
        if (result.success && result.memory && onUploadSuccess) {
          onUploadSuccess(result.memory as Memory)
          successCount++
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} anı başarıyla eklendi!`)
        setIsOpen(false)
        formRef.current?.reset()
        setDate(new Date())
      }

    } catch (e) {
      console.error(e)
      toast.error('Yükleme sırasında hata oluştu: ' + (e instanceof Error ? e.message : 'Bilinmeyen hata'))
    } finally {
      setLoading(false)
      setStatusMessage('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-8 right-8 rounded-full h-16 w-16 shadow-2xl from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition-all hover:scale-110 border-0 z-50">
          <PlusCircle className="h-7 w-7 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-light text-2xl">Yeni Anı Ekle</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image" className="font-light text-sm text-stone-600">Fotoğraflar</Label>
            <Input 
              id="image" 
              name="image" 
              type="file" 
              accept="image/*,.heic" 
              multiple 
              required 
              className="cursor-pointer font-light border-stone-200 focus:border-rose-400 file:text-stone-600 file:font-light" 
            />
            <p className="text-xs text-stone-400 font-light">Birden fazla fotoğraf seçebilirsiniz.</p>
          </div>
          <div className="grid gap-2">
            <Label className="font-light text-sm text-stone-600">Tarih</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-light border-stone-200 hover:bg-stone-50",
                    !date && "text-stone-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "d MMMM yyyy", { locale: tr }) : <span>Tarih seçin</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-0 shadow-xl">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={tr}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="font-light text-sm text-stone-600">Açıklama (opsiyonel)</Label>
            <Textarea id="description" name="description" placeholder="Bu anın hikayesi..." className="font-light border-stone-200 focus:border-rose-400 min-h-[100px] resize-none" />
          </div>
          <Button type="submit" disabled={loading} className="from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 font-light h-11 border-0 shadow-lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {statusMessage}
              </>
            ) : (
              'Kaydet'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
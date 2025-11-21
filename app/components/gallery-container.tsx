'use client'

import { useState } from 'react'
import PhotoCard from './photo-card'
import UploadForm from './upload-form'
import { deleteMemory } from '@/app/actions'
import { toast } from "sonner"
import { CalendarIcon, X, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format, isSameDay } from 'date-fns'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Memory = {
  id: string
  image_url: string
  image_path: string
  description: string | null
  memory_date: string
}

export default function GalleryContainer({ initialMemories }: { initialMemories: Memory[] }) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories)
  const [dateFilter, setDateFilter] = useState<Date | undefined>()
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const filteredMemories = memories
    .filter(memory => {
      if (!dateFilter) return true
      return isSameDay(new Date(memory.memory_date), dateFilter)
    })
    .sort((a, b) => {
      const dateA = new Date(a.memory_date).getTime()
      const dateB = new Date(b.memory_date).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })

  const handleDelete = async (id: string, imagePath: string) => {
    // Optimistic update: Arayüzden hemen kaldır
    const previousMemories = [...memories]
    setMemories(memories.filter(m => m.id !== id))
    toast.info("Anı siliniyor...", { duration: 1000 })

    try {
      await deleteMemory(id, imagePath)
      toast.success("Anı silindi.")
    } catch (error) {
      // Hata olursa geri al
      console.error("Silme hatası:", error)
      setMemories(previousMemories)
      toast.error("Silme işlemi başarısız oldu.")
    }
  }

  const handleUploadSuccess = (newMemory: Memory) => {
    // Yeni yüklenen anıyı listeye ekle
    setMemories(prev => [newMemory, ...prev])
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 p-3 sm:p-4 rounded-2xl shadow-lg border-0 sticky top-2 z-10 backdrop-blur-xl bg-white/70 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className={cn(
                  "w-full sm:w-60 justify-start text-left font-light hover:bg-stone-100",
                  !dateFilter && "text-stone-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, "d MMMM yyyy", { locale: tr }) : <span>Tarih seçin</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-0 shadow-xl" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
                locale={tr}
              />
            </PopoverContent>
          </Popover>
          
          {dateFilter && (
            <Button variant="ghost" size="icon" onClick={() => setDateFilter(undefined)} title="Filtreyi temizle" className="hover:bg-stone-100">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-light text-stone-500 hidden sm:inline">
            {filteredMemories.length} anı
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 w-full sm:w-auto font-light hover:bg-stone-100">
                <ArrowUpDown className="h-4 w-4" />
                {sortOrder === 'desc' ? 'Yeniden eskiye' : 'Eskiden yeniye'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-0 shadow-xl">
              <DropdownMenuItem onClick={() => setSortOrder('desc')} className="font-light">
                Yeniden eskiye
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('asc')} className="font-light">
                Eskiden yeniye
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 max-w-7xl mx-auto">
        {filteredMemories.map((memory, index) => (
          <PhotoCard 
            key={memory.id} 
            memory={memory} 
            onDelete={() => handleDelete(memory.id, memory.image_path)}
            onClick={() => {
              setLightboxIndex(index)
              setLightboxOpen(true)
            }}
          />
        ))}
      </div>

      {(!filteredMemories || filteredMemories.length === 0) && (
        <div className="text-center py-32 text-stone-400 font-light">
          <p className="text-lg mb-2">{dateFilter ? '🔍 Bu tarihte anı bulunamadı' : '📸 Henüz anı eklenmemiş'}</p>
          <p className="text-sm text-stone-400">{dateFilter ? 'Başka bir tarih deneyin' : 'Sağ alttaki + ile başlayın'}</p>
        </div>
      )}

      <UploadForm onUploadSuccess={handleUploadSuccess} />

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={filteredMemories.map(m => ({ src: m.image_url, alt: m.description || undefined }))}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
      />
    </>
  )
}

'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Trash2, Download, CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

// Tip tanımı
type Memory = {
  id: string
  image_url: string
  image_path: string
  description: string | null
  memory_date: string
}

export default function PhotoCard({ memory, onDelete, onClick }: { memory: Memory, onDelete: () => void, onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const response = await fetch(memory.image_url)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `memory-${memory.memory_date}.jpg`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div 
      className="relative group break-inside-avoid mb-4 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 bg-white cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative w-full">
        <Image
          src={memory.image_url}
          alt={memory.description || 'Memory'}
          width={500}
          height={500}
          className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110"
          unoptimized
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 from-black/90 via-black/30 to-transparent transition-all duration-500 flex flex-col justify-end p-5 text-white ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mb-3 space-y-2">
            <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-md font-light text-xs">
              <CalendarIcon className="w-3 h-3 mr-1" />
              {new Date(memory.memory_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Badge>
            {memory.description && (
              <p className="text-sm font-light line-clamp-3 text-white/90 leading-relaxed">{memory.description}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="secondary" onClick={handleDownload} className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border-none text-white backdrop-blur-md transition-all">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="border-0 shadow-xl">
                  <p className="font-light">İndir</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="destructive" className="h-9 w-9 rounded-full bg-red-500/80 hover:bg-red-600 border-none backdrop-blur-md transition-all">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-0 shadow-2xl rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-light text-xl">Anıyı sil?</AlertDialogTitle>
                  <AlertDialogDescription className="font-light">
                    Bu anı kalıcı olarak silinecek. Bu işlem geri alınamaz.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="font-light">İptal</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-red-500 hover:bg-red-600 font-light">Sil</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
}
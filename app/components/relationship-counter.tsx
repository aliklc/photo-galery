'use client'

import { useState, useEffect } from 'react'
import { intervalToDuration } from 'date-fns'

export default function RelationshipCounter({ startDate }: { startDate: Date }) {
  const [duration, setDuration] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateDuration = () => {
      const now = new Date()
      const result = intervalToDuration({
        start: startDate,
        end: now
      })
      
      setDuration({
        years: result.years || 0,
        months: result.months || 0,
        days: result.days || 0,
        hours: result.hours || 0,
        minutes: result.minutes || 0,
        seconds: result.seconds || 0
      })
    }

    calculateDuration()
    const timer = setInterval(calculateDuration, 1000) // Her saniye güncelle

    return () => clearInterval(timer)
  }, [startDate])

  return (
    <div className="flex flex-nowrap justify-center items-baseline gap-2 md:gap-6 text-stone-800 mb-8 overflow-hidden px-2">
      <div className="text-center min-w-10 md:min-w-[60px]">
        <div className="text-2xl md:text-4xl font-light tabular-nums">{duration.years}</div>
        <div className="text-[10px] md:text-sm text-stone-500 font-light uppercase tracking-widest mt-1">Yıl</div>
      </div>
      <div className="text-2xl md:text-4xl font-light text-stone-300">:</div>
      <div className="text-center min-w-10 md:min-w-[60px]">
        <div className="text-2xl md:text-4xl font-light tabular-nums">{duration.months}</div>
        <div className="text-[10px] md:text-sm text-stone-500 font-light uppercase tracking-widest mt-1">Ay</div>
      </div>
      <div className="text-2xl md:text-4xl font-light text-stone-300">:</div>
      <div className="text-center min-w-10 md:min-w-[60px]">
        <div className="text-2xl md:text-4xl font-light tabular-nums">{duration.days}</div>
        <div className="text-[10px] md:text-sm text-stone-500 font-light uppercase tracking-widest mt-1">Gün</div>
      </div>
      <div className="text-2xl md:text-4xl font-light text-stone-300">:</div>
      <div className="text-center min-w-10 md:min-w-[60px]">
        <div className="text-2xl md:text-4xl font-light tabular-nums">{duration.hours}</div>
        <div className="text-[10px] md:text-sm text-stone-500 font-light uppercase tracking-widest mt-1">Saat</div>
      </div>
      <div className="text-2xl md:text-4xl font-light text-stone-300">:</div>
      <div className="text-center min-w-10 md:min-w-[60px]">
        <div className="text-2xl md:text-4xl font-light tabular-nums">{duration.minutes}</div>
        <div className="text-[10px] md:text-sm text-stone-500 font-light uppercase tracking-widest mt-1">Dk</div>
      </div>
      <div className="text-2xl md:text-4xl font-light text-stone-300">:</div>
      <div className="text-center min-w-10 md:min-w-[60px]">
        <div className="text-2xl md:text-4xl font-light tabular-nums">{duration.seconds}</div>
        <div className="text-[10px] md:text-sm text-stone-500 font-light uppercase tracking-widest mt-1">Sn</div>
      </div>
    </div>
  )
}

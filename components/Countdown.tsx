'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/contexts/Language'

// Matches content/wedding-content.json's weddingStart ("2027-01-20") and
// timezone ("Asia/Kolkata") — kept as a literal here rather than importing
// the JSON, consistent with how Language.tsx already hardcodes the same
// date as display strings (eventDates, deadline) per locale.
const WEDDING_START = new Date('2027-01-20T00:00:00+05:30').getTime()

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, WEDDING_START - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

// Renders nothing until mount (server has no notion of "now"), then ticks
// every second. `light` swaps the palette for use over a dark photo overlay.
export default function Countdown({ light = false }: { light?: boolean }) {
  const [time, setTime] = useState<TimeLeft | null>(null)
  const { t } = useLang()

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) return null

  const units: [number, string][] = [
    [time.days, t.countdownDays],
    [time.hours, t.countdownHours],
    [time.minutes, t.countdownMinutes],
    [time.seconds, t.countdownSeconds],
  ]

  const numberCls = light ? 'text-paper-light' : 'text-ink'
  const labelCls = light ? 'text-paper-light/65' : 'text-stone'
  const dividerCls = light ? 'bg-paper-light/25' : 'bg-thread-border'

  return (
    <div className="flex items-start gap-4 md:gap-6">
      {units.map(([value, label], i) => (
        <div key={label} className="flex items-start gap-4 md:gap-6">
          {i > 0 && <div className={`w-px h-9 mt-1 ${dividerCls}`} />}
          <div className="text-center">
            <div className={`font-serif tabular-nums ${numberCls}`} style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', lineHeight: 1 }}>
              {String(value).padStart(2, '0')}
            </div>
            <div className={`font-sans uppercase mt-1.5 ${labelCls}`} style={{ fontSize: '0.62rem', letterSpacing: '0.18em' }}>
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

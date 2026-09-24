'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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

const DIGIT_EASE = [0.34, 1.56, 0.64, 1] as const // slight overshoot — a little mechanical "click"

// Each digit change slides the old value out and the new one in, rather
// than swapping the text in place — this is the whole "does it feel
// alive" difference for a ticking clock.
function FlipDigits({ value, cls }: { value: string; cls: string }) {
  return (
    <span className="relative inline-flex overflow-hidden" style={{ height: '1em', width: '1ch' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '70%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-70%', opacity: 0 }}
          transition={{ duration: 0.38, ease: DIGIT_EASE }}
          className={`absolute inset-0 inline-flex items-center justify-center tabular-nums ${cls}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
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

  // Days is deliberately unpadded — it can run to 3 digits this far out,
  // and forcing it to 2 (as the earlier version silently did) truncated
  // the leading digit instead of just skipping a leading zero.
  const units: [string, string, boolean][] = [
    [String(time.days), t.countdownDays, false],
    [String(time.hours).padStart(2, '0'), t.countdownHours, false],
    [String(time.minutes).padStart(2, '0'), t.countdownMinutes, false],
    [String(time.seconds).padStart(2, '0'), t.countdownSeconds, true],
  ]

  const cardCls = light
    ? 'border-gold/40 bg-black/25 backdrop-blur-sm'
    : 'border-gold/30 bg-white/60 backdrop-blur-sm'
  const numberCls = light ? 'text-paper-light' : 'text-ink'
  const labelCls = light ? 'text-paper-light/60' : 'text-stone'
  const glowCls = light ? 'shadow-[0_0_30px_rgba(161,123,61,0.25)]' : 'shadow-[0_0_24px_rgba(161,123,61,0.15)]'

  return (
    <div className={`inline-flex items-stretch gap-2.5 md:gap-3 rounded-xl border px-1 py-1 ${cardCls} ${glowCls}`}>
      {units.map(([str, label, isSeconds]) => (
        <div key={label} className="flex flex-col items-center rounded-lg px-2.5 py-2 md:px-3.5 md:py-2.5">
            <div className={`font-serif leading-none ${numberCls}`} style={{ fontSize: 'clamp(1.6rem, 4.2vw, 2.3rem)' }}>
              <span className="inline-flex">
                {[...str].map((digit, i) => (
                  <FlipDigits key={i} value={digit} cls={numberCls} />
                ))}
              </span>
            </div>
            <motion.div
              className={`font-sans uppercase mt-1.5 ${labelCls} ${isSeconds ? 'text-gold' : ''}`}
              style={{ fontSize: '0.6rem', letterSpacing: '0.16em' }}
              animate={isSeconds ? { opacity: [1, 0.55, 1] } : undefined}
              transition={isSeconds ? { duration: 1, repeat: Infinity, ease: 'easeInOut' } : undefined}
            >
              {label}
            </motion.div>
        </div>
      ))}
    </div>
  )
}

'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLang } from '@/contexts/Language'

const EASE = [0.25, 0.1, 0.25, 1] as const

const rise = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, delay, ease: EASE } },
})

const events = [
  {
    date: '20 Jan',
    day: 'Wed',
    line1: 'Check-in',
    line2: 'Mehendi & Engagement',
  },
  {
    date: '21 Jan',
    day: 'Thu',
    line1: 'Haldi',
    line2: '& Wedding Night',
  },
  {
    date: '22 Jan',
    day: 'Fri',
    line1: 'Checkout',
    line2: '',
  },
]

export default function StatementSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { t } = useLang()

  return (
    <section ref={ref} className="bg-charcoal relative overflow-hidden">
      {/* Ghosted initials */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="font-serif italic leading-none text-white/[0.025]"
          style={{ fontSize: 'clamp(200px, 35vw, 480px)' }}
        >
          S&amp;S
        </span>
      </div>

      <motion.div
        className="relative px-7 md:px-14 py-20 md:py-32 max-w-4xl mx-auto text-center"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
      >
        {/* Label */}
        <motion.p
          variants={rise(0)}
          className="font-sans uppercase text-white/40 mb-8"
          style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)', letterSpacing: '0.55em' }}
        >
          {t.celebrationOf}
        </motion.p>

        <motion.div variants={rise(0.05)} className="w-14 h-px bg-white/15 mx-auto mb-10" />

        {/* Names */}
        <motion.h2
          variants={rise(0.1)}
          className="font-serif tracking-tight text-white leading-none mb-4"
          style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)' }}
        >
          Sakshi
        </motion.h2>
        <motion.p
          variants={rise(0.18)}
          className="font-serif italic text-white/40 mb-4 tracking-widest"
          style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}
        >
          &amp;
        </motion.p>
        <motion.h2
          variants={rise(0.26)}
          className="font-serif tracking-tight text-white leading-none mb-14"
          style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)' }}
        >
          Dr. Sahil
        </motion.h2>

        <motion.div variants={rise(0.34)} className="w-14 h-px bg-white/15 mx-auto mb-12" />

        {/* Date range — now 20-22 */}
        <motion.div variants={rise(0.40)} className="space-y-3 mb-4">
          <p className="font-serif text-white leading-tight"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
            20 &ndash; 22 January 2027
          </p>
          <p className="font-sans uppercase text-white/50 pt-1"
            style={{ fontSize: 'clamp(0.7rem, 1.6vw, 0.85rem)', letterSpacing: '0.45em' }}>
            Pitampura, Delhi, India
          </p>
        </motion.div>

        <motion.div variants={rise(0.46)} className="w-14 h-px bg-white/10 mx-auto mt-10 mb-10" />

        {/* 3-day event schedule */}
        <motion.div
          variants={rise(0.52)}
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto"
        >
          {events.map((ev) => (
            <div key={ev.date} className="text-center">
              <p className="font-sans uppercase text-white/25 mb-1"
                style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.7rem)', letterSpacing: '0.35em' }}>
                {ev.day}
              </p>
              <p className="font-serif text-white/80 mb-1.5"
                style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
                {ev.date}
              </p>
              <p className="font-sans text-white/40 leading-snug"
                style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', letterSpacing: '0.1em' }}>
                {ev.line1}
                {ev.line2 && <><br />{ev.line2}</>}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={rise(0.6)} className="w-14 h-px bg-white/15 mx-auto mt-12" />
      </motion.div>
    </section>
  )
}

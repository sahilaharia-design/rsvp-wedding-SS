'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLang } from '@/contexts/Language'

interface TravelReminderProps {
  onCTAClick: () => void
}

const EASE = [0.25, 0.1, 0.25, 1] as const

export default function TravelReminder({ onCTAClick }: TravelReminderProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { t } = useLang()

  return (
    <section ref={ref} className="bg-ivory border-y border-thread-border/60">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
        className="max-w-3xl mx-auto px-7 md:px-14 py-10 md:py-12 text-center"
      >
        <h2 className="font-serif text-ink mb-3" style={{ fontSize: 'clamp(1.4rem, 3.2vw, 1.9rem)' }}>
          {t.reminderHeading}
        </h2>
        <p className="font-sans leading-[1.8] text-stone mb-7" style={{ fontSize: '1.05rem' }}>
          {t.reminderBody} <span className="text-burgundy font-semibold">{t.deadline}</span>.
        </p>
        <button
          onClick={onCTAClick}
          className="px-8 py-3.5 border border-burgundy text-burgundy font-sans uppercase hover:bg-burgundy hover:text-paper-light transition-colors duration-300 rounded-sm"
          style={{ fontSize: '0.8rem', letterSpacing: '0.24em' }}
        >
          {t.confirmTravelBtn}
        </button>
      </motion.div>
    </section>
  )
}

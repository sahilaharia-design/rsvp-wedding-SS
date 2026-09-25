'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/Language'

const EASE = [0.25, 0.1, 0.25, 1] as const

// Groom-side only. A slim, early signpost so guests know — before they even
// reach the travel form — that there's a lovely-ladies section further down
// the page, rather than discovering it only by scrolling all the way past
// travel confirmation. Never on /bride.
export default function LovelyLadiesTeaser() {
  const { t } = useLang()

  const scrollToLadies = useCallback(() => {
    document.getElementById('lovely-ladies')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: EASE }}
      className="bg-paper px-6"
    >
      <button
        onClick={scrollToLadies}
        className="hover-lift group mx-auto flex max-w-xl items-center justify-center gap-3 rounded-full border border-gold/40 bg-blush/15 px-5 py-2.5 text-center transition-colors duration-300 hover:border-gold"
      >
        <span className="font-sans text-gold" style={{ fontSize: '0.9rem' }}>✦</span>
        <span className="font-sans text-ink/80" style={{ fontSize: '0.85rem', letterSpacing: '0.02em' }}>
          {t.lovelyLadiesTeaserText}
        </span>
        <span className="font-sans uppercase text-burgundy group-hover:text-[#5c0a1c] transition-colors whitespace-nowrap"
          style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>
          {t.lovelyLadiesTeaserCTA} &darr;
        </span>
      </button>
    </motion.div>
  )
}

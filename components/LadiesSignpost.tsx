'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/Language'

const EASE = [0.25, 0.1, 0.25, 1] as const

// Groom-side only. Sits right where the travel form ends and the
// lovely-ladies content begins, so the transition is signposted rather than
// a surprise — a gently bouncing "scroll on" cue instead of a static divider.
export default function LadiesSignpost() {
  const { t } = useLang()

  const scrollToLadies = useCallback(() => {
    document.getElementById('lovely-ladies')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="bg-paper py-10 text-center">
      <button onClick={scrollToLadies} className="hover-lift group inline-flex flex-col items-center gap-2">
        <span className="font-sans uppercase text-gold" style={{ fontSize: '0.75rem', letterSpacing: '0.22em' }}>
          {t.ladiesSignpostEyebrow}
        </span>
        <span className="font-sans text-stone group-hover:text-ink transition-colors" style={{ fontSize: '0.9rem' }}>
          {t.ladiesSignpostLine}
        </span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: EASE }}
          className="text-burgundy"
          style={{ fontSize: '1.4rem', lineHeight: 1 }}
        >
          &darr;
        </motion.span>
      </button>
    </div>
  )
}

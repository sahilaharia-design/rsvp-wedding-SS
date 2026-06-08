'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EASE = [0.4, 0, 0.2, 1] as const

function AutoDismiss({ onDismiss, delay }: { onDismiss: () => void; delay: number }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, delay)
    return () => clearTimeout(t)
  }, [onDismiss, delay])
  return null
}

export default function GrandReveal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('std-revealed')) {
      setVisible(true)
      sessionStorage.setItem('std-revealed', '1')
    }
  }, [])

  const dismiss = () => setVisible(false)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-charcoal cursor-pointer select-none overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.4, ease: EASE } }}
          onClick={dismiss}
        >
          <AutoDismiss onDismiss={dismiss} delay={3600} />

          {/* Subtle grain texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }} />

          <div className="text-center px-8 max-w-3xl mx-auto">
            {/* Label */}
            <motion.p
              className="font-sans text-[9px] md:text-[10px] tracking-[0.55em] uppercase text-white/35 mb-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            >
              Save the Date
            </motion.p>

            {/* Top rule */}
            <motion.div
              className="w-12 h-px bg-white/15 mx-auto mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              style={{ transformOrigin: 'center' }}
            />

            {/* Main hashtag — the reveal moment */}
            <motion.h1
              className="font-serif italic text-[2.6rem] sm:text-[3.8rem] md:text-[5.5rem] lg:text-[6.5rem] leading-none text-white mb-7 md:mb-9"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
            >
              #SakshiKoMilaKinara
            </motion.h1>

            {/* Names */}
            <motion.p
              className="font-serif text-[1.2rem] md:text-[1.7rem] text-white/70 mb-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            >
              Sakshi &amp; Dr. Sahil
            </motion.p>

            {/* Bottom rule */}
            <motion.div
              className="w-12 h-px bg-white/15 mx-auto mb-7"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 1.05, ease: EASE }}
              style={{ transformOrigin: 'center' }}
            />

            {/* Date + Location */}
            <motion.p
              className="font-sans text-[9px] md:text-[11px] tracking-[0.4em] uppercase text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.15, ease: EASE }}
            >
              20 &ndash; 21 January 2027 &middot; Delhi, India
            </motion.p>

            {/* Tap prompt — appears late */}
            <motion.p
              className="font-sans text-[8px] tracking-[0.3em] uppercase text-white/20 mt-14 md:mt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.2, ease: EASE }}
            >
              Tap anywhere to continue
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

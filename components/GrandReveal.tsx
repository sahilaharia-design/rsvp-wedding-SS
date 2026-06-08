'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AUTO_DISMISS_MS = 8000

// Floating bokeh particles — warm blush on dark bg
const PARTICLES = [
  { id: 0,  left: '8%',  size: 4,  delay: 0.2, dur: 9  },
  { id: 1,  left: '18%', size: 3,  delay: 1.5, dur: 11 },
  { id: 2,  left: '28%', size: 6,  delay: 0.8, dur: 8  },
  { id: 3,  left: '40%', size: 3,  delay: 2.1, dur: 12 },
  { id: 4,  left: '52%', size: 5,  delay: 0.5, dur: 10 },
  { id: 5,  left: '64%', size: 4,  delay: 1.8, dur: 7  },
  { id: 6,  left: '75%', size: 7,  delay: 0.3, dur: 13 },
  { id: 7,  left: '85%', size: 3,  delay: 2.6, dur: 9  },
  { id: 8,  left: '92%', size: 5,  delay: 1.1, dur: 11 },
  { id: 9,  left: '33%', size: 4,  delay: 3.2, dur: 8  },
  { id: 10, left: '58%', size: 6,  delay: 2.8, dur: 10 },
  { id: 11, left: '12%', size: 3,  delay: 4.0, dur: 14 },
  { id: 12, left: '72%', size: 5,  delay: 3.6, dur: 9  },
  { id: 13, left: '46%', size: 4,  delay: 4.5, dur: 12 },
]

const REVEAL_H = typeof window !== 'undefined' ? window.innerHeight : 900

export default function GrandReveal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('std-revealed')) {
      setVisible(true)
      sessionStorage.setItem('std-revealed', '1')
    }
  }, [])

  const dismiss = useCallback(() => {
    setVisible(false)
  }, [])

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(dismiss, AUTO_DISMISS_MS)
    return () => clearTimeout(t)
  }, [visible, dismiss])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden cursor-pointer select-none"
          style={{ backgroundColor: '#0D0805' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.0, ease: [0.4, 0, 0.2, 1] } }}
          onClick={dismiss}
          aria-label="Opening reveal — tap to continue"
        >
          {/* Radial warm glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(110,26,40,0.20) 0%, transparent 70%)',
            }}
          />

          {/* Floating bokeh */}
          {PARTICLES.map((p) => (
            <motion.span
              key={p.id}
              className="absolute bottom-[-20px] rounded-full pointer-events-none"
              style={{
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: '#D4A99A',
              }}
              animate={{
                y: [0, -(REVEAL_H + 40)],
                opacity: [0, 0.18, 0.12, 0],
              }}
              transition={{
                duration: p.dur,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}

          {/* ── Centre content ── */}
          <div className="relative flex flex-col items-center justify-center h-full text-center px-6">

            {/* Wax seal */}
            <motion.div
              className="relative mb-5"
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
                <circle cx="34" cy="34" r="32" stroke="#B8960C" strokeWidth="0.75" opacity="0.5" />
                <circle cx="34" cy="34" r="26" stroke="#B8960C" strokeWidth="0.4" opacity="0.3" />
                <text
                  x="34" y="44"
                  textAnchor="middle"
                  fontFamily="var(--font-cormorant), Georgia, serif"
                  fontSize="26"
                  fontStyle="italic"
                  fill="#D4A99A"
                >
                  S
                </text>
              </svg>
              <div
                className="absolute inset-[-16px] rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(180,120,80,0.14) 0%, transparent 70%)',
                }}
              />
            </motion.div>

            {/* Ornamental lines + SAVE THE DATE */}
            <motion.div
              className="flex items-center gap-4 mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.1 }}
            >
              <motion.div
                className="h-px"
                style={{ background: 'rgba(212,169,154,0.3)', originX: 1, width: '52px' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 1.1, ease: [0.4, 0, 0.2, 1] }}
              />
              <p
                className="font-sans text-[7px] tracking-[0.55em] uppercase"
                style={{ color: 'rgba(212,169,154,0.5)' }}
              >
                Save the Date
              </p>
              <motion.div
                className="h-px"
                style={{ background: 'rgba(212,169,154,0.3)', originX: 0, width: '52px' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 1.1, ease: [0.4, 0, 0.2, 1] }}
              />
            </motion.div>

            {/* Hashtag — Allura display script */}
            <motion.h1
              className="font-display leading-none mb-4"
              style={{
                fontSize: 'clamp(2.2rem, 8.5vw, 6rem)',
                color: '#F5EDE2',
                filter: 'drop-shadow(0 0 24px rgba(110,26,40,0.4))',
              }}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              #SakshiKoMilaKinara
            </motion.h1>

            {/* Names */}
            <motion.p
              className="font-serif text-[1.25rem] md:text-[1.65rem] mb-3"
              style={{ color: 'rgba(245,237,226,0.85)' }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 2.0, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Sakshi &amp; Dr. Sahil
            </motion.p>

            {/* Gold divider */}
            <motion.div
              className="h-px w-10 my-3"
              style={{ background: 'rgba(184,150,12,0.4)', originX: 0.5 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 2.4, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Date */}
            <motion.p
              className="font-serif italic text-[0.95rem] md:text-[1.1rem] mb-1"
              style={{ color: 'rgba(212,169,154,0.85)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              20 &ndash; 21 January 2027
            </motion.p>

            {/* Location */}
            <motion.p
              className="font-sans text-[7px] tracking-[0.5em] uppercase mb-7"
              style={{ color: 'rgba(212,169,154,0.45)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.9 }}
            >
              Pitampura &middot; Delhi &middot; India
            </motion.p>

            {/* Hindi subtitle */}
            <motion.p
              className="font-serif mb-10"
              style={{ fontSize: '0.85rem', color: 'rgba(212,169,154,0.3)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 3.3 }}
            >
              साक्षी का किनारा
            </motion.p>

            {/* Pulse tap prompt */}
            <motion.p
              className="font-sans text-[7px] tracking-[0.4em] uppercase"
              style={{ color: 'rgba(212,169,154,0.3)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0.12, 0.3] }}
              transition={{ duration: 2.6, delay: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              Tap anywhere to continue
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

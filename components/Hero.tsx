'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface HeroProps {
  onRSVPClick: () => void
}

const EASE = [0.25, 0.1, 0.25, 1] as const

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, delay, ease: EASE } },
})

export default function Hero({ onRSVPClick }: HeroProps) {
  const [imgError, setImgError] = useState(false)

  const placeholderBg =
    'linear-gradient(160deg, #A08070 0%, #B89888 25%, #C8A898 55%, #D8C0B0 80%, #E0D0C4 100%)'

  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* Photo fills screen */}
      <div
        className="absolute inset-0"
        style={imgError ? { background: placeholderBg } : undefined}
      >
        {!imgError && (
          <Image
            src="/hero.jpg"
            alt="Sakshi & Dr. Sahil — Roka Ceremony"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Top vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 28%, transparent 55%)' }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.88) 20%, rgba(0,0,0,0.5) 42%, transparent 70%)' }}
      />

      {/* ── SAVE THE DATE — top centre, bold ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex flex-col items-center pt-8 md:pt-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
      >
        <p
          className="font-sans font-light text-white tracking-[0.6em] uppercase text-center"
          style={{ fontSize: 'clamp(0.85rem, 2.8vw, 1.4rem)', letterSpacing: '0.55em' }}
        >
          Save&nbsp;&nbsp;the&nbsp;&nbsp;Date
        </p>
        <motion.div
          className="mt-3 h-px bg-white/35"
          style={{ originX: 0.5 }}
          initial={{ scaleX: 0, width: '120px' }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.div>

      {/* ── Bottom text block ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-7 md:px-14 pb-10 md:pb-14"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {/* Hashtag — display script */}
        <motion.h1
          variants={fade(0)}
          className="font-display text-white leading-none mb-5"
          style={{ fontSize: 'clamp(1.8rem, 7.5vw, 7rem)' }}
        >
          #SakshiKoMilaKinara
        </motion.h1>

        {/* Names + date row */}
        <motion.div
          variants={fade(0.1)}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10"
        >
          <div>
            <p className="font-serif text-[1.35rem] md:text-[1.75rem] text-white/90 mb-2">
              Sakshi &amp; Dr. Sahil
            </p>
            <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/50">
              20 &ndash; 21 January 2027 &nbsp;&middot;&nbsp; Pitampura, Delhi, India
            </p>
          </div>

          <motion.div variants={fade(0.2)} className="flex-shrink-0">
            <button
              onClick={onRSVPClick}
              className="px-9 md:px-10 py-3.5 md:py-4 border border-white/60 text-white font-sans text-[9px] tracking-[0.3em] uppercase hover:bg-white hover:text-charcoal transition-all duration-300 w-full md:w-auto text-center"
            >
              Confirm Attendance
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

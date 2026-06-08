'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface HeroProps {
  onRSVPClick: () => void
}

const EASE = [0.25, 0.1, 0.25, 1] as const

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, delay, ease: EASE } },
})

export default function Hero({ onRSVPClick }: HeroProps) {
  const [imgError, setImgError] = useState(false)

  const placeholderBg =
    'linear-gradient(160deg, #A08070 0%, #B89888 25%, #C8A898 55%, #D8C0B0 80%, #E0D0C4 100%)'

  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* Photo fills entire screen */}
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
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 30%)' }} />

      {/* Bottom gradient — strong dark band for text legibility */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.88) 22%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.15) 70%, transparent 100%)' }} />

      {/* Save The Date badge — top left */}
      <motion.div
        className="absolute top-8 left-7 md:left-14 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: EASE }}
      >
        <div className="h-px w-6 bg-white/50" />
        <p className="font-sans text-[8px] md:text-[9px] tracking-[0.5em] uppercase text-white/60">
          Save the Date
        </p>
      </motion.div>

      {/* All text — overlaid at bottom, unified for mobile + desktop */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-7 md:px-14 pb-10 md:pb-14"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
      >
        {/* Hashtag — the centrepiece */}
        <motion.h1
          variants={fade(0)}
          className="font-serif italic leading-none text-white mb-5 md:mb-6"
          style={{ fontSize: 'clamp(1.5rem, 7.2vw, 7.5rem)' }}
        >
          #SakshiKoMilaKinara
        </motion.h1>

        {/* Names + date + CTA row */}
        <motion.div
          variants={fade(0.1)}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10"
        >
          <div>
            <p className="font-serif text-[1.35rem] md:text-[1.75rem] text-white/90 mb-2">
              Sakshi &amp; Dr. Sahil
            </p>
            <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/55">
              Wednesday &amp; Thursday &middot; 20 &ndash; 21 January 2027 &middot; Delhi, India
            </p>
          </div>

          <motion.div variants={fade(0.2)} className="flex-shrink-0">
            <button
              onClick={onRSVPClick}
              className="px-9 md:px-10 py-3.5 md:py-4 border border-white/65 text-white font-sans text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-charcoal transition-all duration-300 w-full md:w-auto text-center"
            >
              Confirm Attendance
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/Language'

interface HeroProps {
  onRSVPClick: () => void
}

const EASE = [0.25, 0.1, 0.25, 1] as const

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, delay, ease: EASE } },
})

export default function Hero({ onRSVPClick }: HeroProps) {
  const [imgError, setImgError] = useState(false)
  const { t } = useLang()

  const placeholderBg =
    'linear-gradient(160deg, #A08070 0%, #B89888 25%, #C8A898 55%, #D8C0B0 80%, #E0D0C4 100%)'

  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* Photo */}
      <div
        className="absolute inset-0"
        style={imgError ? { background: placeholderBg } : undefined}
      >
        {!imgError && (
          <Image
            src="/hero.jpg"
            alt="Sakshi & Dr. Sahil — Roka Ceremony"
            fill priority
            sizes="100vw"
            className="object-cover object-top"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Top vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 30%, transparent 55%)' }} />
      {/* Bottom gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.88) 20%, rgba(0,0,0,0.5) 42%, transparent 68%)' }} />

      {/* ── SAVE THE DATE — left on mobile, pushed below the top-right icon cluster; centred on md+ ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex flex-col items-start md:items-center px-7 md:px-0 pt-20 md:pt-11"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
      >
        <p
          className="font-sans text-white uppercase tracking-[0.65em]"
          style={{ fontSize: 'clamp(0.9rem, 3vw, 1.55rem)' }}
        >
          {t.saveTheDate}
        </p>
        <motion.div
          className="mt-3 h-px bg-white/30"
          style={{ originX: 0.5, width: 'clamp(80px, 35vw, 130px)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.div>

      {/* ── Bottom text ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-7 md:px-14 pb-10 md:pb-14"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {/* Hashtag */}
        <motion.h1
          variants={fade(0)}
          className="font-display text-white leading-none mb-5"
          style={{ fontSize: 'clamp(2rem, 8vw, 7.5rem)' }}
        >
          #SakshiKoMilaKinara
        </motion.h1>

        {/* Names + date + CTA row */}
        <motion.div
          variants={fade(0.1)}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10"
        >
          <div>
            <p className="font-serif text-white/90 mb-2"
              style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.85rem)' }}>
              {t.weddingOf}
            </p>
            {/* All 3 dates */}
            <p className="font-sans text-white/55 mb-1"
              style={{ fontSize: 'clamp(0.7rem, 1.6vw, 0.9rem)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              20 &ndash; 22 January 2027 &nbsp;&middot;&nbsp; Pitampura, Delhi, India
            </p>
            <p className="font-sans text-white/35"
              style={{ fontSize: 'clamp(0.65rem, 1.4vw, 0.8rem)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              20 Mehendi &amp; Engagement &nbsp;·&nbsp; 21 Haldi &amp; Wedding &nbsp;·&nbsp; 22 Checkout
            </p>
          </div>

          <motion.div variants={fade(0.2)} className="flex-shrink-0">
            <button
              onClick={onRSVPClick}
              className="px-9 md:px-10 py-4 border border-white/60 text-white font-sans uppercase hover:bg-marigold hover:border-marigold hover:text-charcoal transition-all duration-300 w-full md:w-auto text-center"
              style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)', letterSpacing: '0.3em' }}
            >
              {t.confirmAttend.replace(' →', '')}
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

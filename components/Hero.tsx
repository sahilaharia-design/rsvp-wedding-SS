'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/Language'
import type { GuestSide } from '@/contexts/GuestSide'

interface HeroProps {
  onCTAClick: () => void
  side?: GuestSide
}

const EASE = [0.25, 0.1, 0.25, 1] as const

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, delay, ease: EASE } },
})

export default function Hero({ onCTAClick, side = null }: HeroProps) {
  const [imgError, setImgError] = useState(false)
  const { t } = useLang()
  const isBride = side === 'bride'

  const placeholderBg =
    'linear-gradient(160deg, #C4956A 0%, #D4A99A 35%, #E8C5BE 70%, #F2EDE4 100%)'

  return (
    <section id="hero" className="relative bg-paper overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-14 pt-28 pb-14 md:pt-24 md:pb-20">
        <div className="grid md:grid-cols-[58%_1fr] gap-10 md:gap-14 items-center">

          {/* ── Photo — a slow Ken Burns drift, never touching the crop/face
                framing itself (scale only, object-position untouched) ── */}
          <motion.div
            initial="hidden" animate="visible" variants={fade(0)}
            className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden"
            style={{ border: '3px solid var(--thread-border, #D8C6AD)', boxShadow: '0 18px 44px rgba(48,54,50,0.14)' }}
          >
            {!imgError ? (
              <div className="absolute inset-0 ken-burns">
                <Image
                  src="/photos/couple-closeup.jpg"
                  alt="Sakshi and Dr. Sahil, foreheads together, smiling"
                  fill priority
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="object-cover"
                  style={{ objectPosition: '50% 40%' }}
                  onError={() => setImgError(true)}
                />
              </div>
            ) : (
              <div className="absolute inset-0" style={{ background: placeholderBg }} />
            )}
          </motion.div>

          {/* ── Text ── */}
          <motion.div
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fade(0.05)}
              className="font-sans uppercase text-burgundy/80 mb-4"
              style={{ fontSize: '0.85rem', letterSpacing: '0.3em' }}>
              {t.saveTheDate}
            </motion.p>

            <motion.h1 variants={fade(0.1)}
              className="font-serif leading-[1.1] text-ink mb-3"
              style={{ fontSize: 'clamp(2.1rem, 5vw, 3.4rem)' }}>
              {t.namesLine}
            </motion.h1>

            <motion.p variants={fade(0.15)}
              className="font-sans text-stone mb-8"
              style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', letterSpacing: '0.02em' }}>
              {t.eventDates} &nbsp;·&nbsp; Pitampura, Delhi
            </motion.p>

            <motion.div variants={fade(0.2)} className="flex flex-col items-start gap-4">
              {isBride ? (
                <>
                  <Link
                    href="/themes"
                    className="shimmer-btn px-9 py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm inline-block text-center"
                    style={{ fontSize: '0.82rem', letterSpacing: '0.28em' }}
                  >
                    {t.exploreCelebrationsBtn}
                  </Link>
                  <button
                    onClick={onCTAClick}
                    className="font-sans text-burgundy underline decoration-gold/60 underline-offset-4 hover:text-ink transition-colors"
                    style={{ fontSize: '0.95rem' }}
                  >
                    {t.confirmTravelBtn} &rarr;
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onCTAClick}
                    className="shimmer-btn px-9 py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm"
                    style={{ fontSize: '0.82rem', letterSpacing: '0.28em' }}
                  >
                    {t.confirmTravelBtn}
                  </button>
                  <Link
                    href="/themes"
                    className="font-sans text-burgundy underline decoration-gold/60 underline-offset-4 hover:text-ink transition-colors"
                    style={{ fontSize: '0.95rem' }}
                  >
                    {t.themesLinkLabel} &rarr;
                  </Link>
                </>
              )}
            </motion.div>

            <motion.h2 variants={fade(0.3)}
              className="font-display gold-glint text-burgundy leading-none mt-10 break-words"
              style={{ fontSize: 'clamp(1.5rem, 4.2vw, 2.6rem)', wordBreak: 'break-word' }}>
              #SakshiKoMilaKinara
            </motion.h2>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

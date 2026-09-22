'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/Language'
import type { Audience } from '@/lib/audience'
import { AUDIENCE_CONFIG } from '@/lib/audience'
import { willShowEnvelopeIntro, ENVELOPE_SEQUENCE_MS } from '@/lib/envelopeIntro'

interface HeroProps {
  onCTAClick: () => void
  audience: Audience
}

const EASE = [0.25, 0.1, 0.25, 1] as const

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, delay, ease: EASE } },
})

export default function Hero({ onCTAClick, audience }: HeroProps) {
  const [imgError, setImgError] = useState(false)
  const { t } = useLang()
  const isBride = audience === 'bride'

  // If the envelope flourish is about to play, hold this entrance until
  // it closes so the photo wipe and text stagger become its visible
  // payoff, rather than finishing unseen underneath it. Read once on
  // mount — a stale or wrong read here only ever mistimes the animation,
  // it can never leave anything stuck unrendered.
  const [introDelay] = useState(() => (willShowEnvelopeIntro() ? ENVELOPE_SEQUENCE_MS / 1000 : 0))

  const placeholderBg =
    'linear-gradient(160deg, #C4956A 0%, #D4A99A 35%, #E8C5BE 70%, #F2EDE4 100%)'

  return (
    <section id="hero" className="relative bg-paper overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-14 pt-32 pb-14 md:pt-32 md:pb-20">
        <div className="grid md:grid-cols-[58%_1fr] gap-10 md:gap-14 items-center">

          {/* ── Photo — a cinematic clip-path wipe reveal on first paint, then
                a slow Ken Burns drift. Never touches the crop/face framing
                itself (scale/clip only, object-position untouched). ── */}
          <motion.div
            className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden"
            style={{ border: '3px solid var(--thread-border, #D8C6AD)', boxShadow: '0 18px 44px rgba(48,54,50,0.14)' }}
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 1.1, delay: introDelay, ease: [0.65, 0, 0.35, 1] }}
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
            {/* One-shot light sweep across the photo as it reveals */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.5) 48%, transparent 65%)' }}
              initial={{ x: '-120%' }}
              animate={{ x: '120%' }}
              transition={{ duration: 1.1, delay: introDelay + 0.15, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>

          {/* ── Text — each child's fade() sets its own transition.delay,
                which in Framer Motion takes precedence over a parent
                variant's staggerChildren/delayChildren, so introDelay has
                to be added directly into every child's own delay here for
                it to actually hold the stagger back. ── */}
          <motion.div initial="hidden" animate="visible">
            <motion.p variants={fade(introDelay + 0.25)}
              className="font-sans uppercase text-burgundy/80 mb-4"
              style={{ fontSize: '0.85rem', letterSpacing: '0.3em' }}>
              {isBride ? t.brideEyebrow : t.groomEyebrow}
            </motion.p>

            <motion.h1 variants={fade(introDelay + 0.3)}
              className="font-serif leading-[1.1] text-ink mb-3"
              style={{ fontSize: 'clamp(2.1rem, 5vw, 3.4rem)' }}>
              {t.namesLine}
            </motion.h1>

            <motion.p variants={fade(introDelay + 0.35)}
              className="font-sans text-stone mb-8"
              style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', letterSpacing: '0.02em' }}>
              {t.eventDates} &nbsp;·&nbsp; Pitampura, Delhi
            </motion.p>

            <motion.div variants={fade(introDelay + 0.4)} className="flex flex-col items-start gap-4">
              {isBride ? (
                <>
                  <Link
                    href={AUDIENCE_CONFIG.bride.themesRoute}
                    className="shimmer-btn px-9 py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm inline-block text-center"
                    style={{ fontSize: '0.82rem', letterSpacing: '0.28em' }}
                  >
                    {t.bridePrimaryCTA}
                  </Link>
                  <a
                    href="#wardrobe"
                    className="font-sans text-burgundy underline decoration-gold/60 underline-offset-4 hover:text-ink transition-colors"
                    style={{ fontSize: '0.95rem' }}
                  >
                    {t.whatToWearShort} &rarr;
                  </a>
                </>
              ) : (
                <>
                  <button
                    onClick={onCTAClick}
                    className="shimmer-btn px-9 py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm"
                    style={{ fontSize: '0.82rem', letterSpacing: '0.28em' }}
                  >
                    {t.groomPrimaryCTA}
                  </button>
                  <Link
                    href={AUDIENCE_CONFIG.groom.themesRoute}
                    className="font-sans text-burgundy underline decoration-gold/60 underline-offset-4 hover:text-ink transition-colors"
                    style={{ fontSize: '0.95rem' }}
                  >
                    {t.groomSecondaryCTA} &rarr;
                  </Link>
                </>
              )}
            </motion.div>

            <motion.h2 variants={fade(introDelay + 0.5)}
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

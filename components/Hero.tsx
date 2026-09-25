'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/Language'
import type { Audience } from '@/lib/audience'
import { AUDIENCE_CONFIG } from '@/lib/audience'
import Countdown from '@/components/Countdown'

interface HeroProps {
  onCTAClick: () => void
  audience: Audience
}

const EASE = [0.25, 0.1, 0.25, 1] as const

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, delay, ease: EASE } },
})

// Safety-net shadow so every hero text element stays readable regardless of
// what part of the photo lands behind it — the gradient below is tuned for
// this specific photo, but a photo swap should never make text unreadable.
const textShadow = { textShadow: '0 2px 10px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.85)' }

export default function Hero({ onCTAClick, audience }: HeroProps) {
  const [imgError, setImgError] = useState(false)
  const { t } = useLang()
  const isBride = audience === 'bride'

  const placeholderBg =
    'linear-gradient(160deg, #C4956A 0%, #D4A99A 35%, #E8C5BE 70%, #F2EDE4 100%)'

  // Both audiences now share the same hero photo (from an earlier
  // celebration, not the wedding itself) — the object-position is tuned
  // specifically to it: both faces sit in the upper-left-of-centre third of
  // this particular frame, so a plain 50/50 centre crop would cut a face
  // out entirely on a narrow mobile viewport. Never reuse this position for
  // another image.
  const heroImage = {
    src: '/photos/couple-celebration.webp',
    alt: 'Sakshi and Dr. Sahil smiling together, foreheads touching, amid floral and candlelit decor',
    position: '38% 28%',
  }

  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-ink">
      {/* ── Full-bleed photo — a cinematic clip-path wipe reveal on first
            paint, then a slow Ken Burns drift. Never touches the crop/face
            framing itself (scale/clip only, object-position untouched). ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      >
        {!imgError ? (
          <div className="absolute inset-0 ken-burns">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: heroImage.position }}
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="absolute inset-0" style={{ background: placeholderBg }} />
        )}

        {/* Legibility gradient — dark through the whole zone the text sits
            in (not just a thin band at the very bottom), so busy areas of
            the photo — candlelight, gold drapery, floral highlights —
            never wash the text out. Only clears in the upper third, above
            where any hero copy ever renders. */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(10,8,7,0.96) 0%, rgba(10,8,7,0.9) 22%, rgba(10,8,7,0.68) 42%, rgba(10,8,7,0.28) 60%, rgba(10,8,7,0.5) 100%)' }} />

        {/* One-shot light sweep across the photo as it reveals */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.35) 48%, transparent 65%)' }}
          initial={{ x: '-120%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.div>

      {/* ── Content — anchored to the bottom of the full-height frame ── */}
      <div className="relative z-10 min-h-[100svh] flex flex-col justify-end max-w-6xl mx-auto px-6 md:px-14 pt-28 pb-14 md:pb-20">
        <motion.div initial="hidden" animate="visible">
          <motion.p variants={fade(0.15)}
            className="font-sans uppercase text-gold mb-4"
            style={{ fontSize: '0.85rem', letterSpacing: '0.3em', ...textShadow }}>
            {isBride ? t.brideEyebrow : t.groomEyebrow}
          </motion.p>

          <motion.h1 variants={fade(0.2)}
            className="font-serif leading-[1.05] text-paper-light mb-4"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', ...textShadow }}>
            {t.namesLine}
          </motion.h1>

          <motion.p variants={fade(0.25)}
            className={`font-sans text-paper-light/90 ${isBride ? 'mb-9' : 'mb-3'}`}
            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', letterSpacing: '0.02em', ...textShadow }}>
            {isBride ? <>{t.eventDates} &nbsp;·&nbsp; Pitampura, Delhi</> : t.groomHeroTagline}
          </motion.p>

          {!isBride && (
            <motion.p variants={fade(0.3)}
              className="inline-block font-sans text-paper-light font-medium mb-9 px-4 py-2.5 rounded-md"
              style={{ fontSize: 'clamp(0.9rem, 1.9vw, 1.02rem)', letterSpacing: '0.01em', background: 'rgba(10,8,7,0.55)', backdropFilter: 'blur(2px)' }}>
              {t.groomDeadlineLine}
            </motion.p>
          )}

          <motion.div variants={fade(0.35)} className="mb-9">
            <Countdown light />
          </motion.div>

          <motion.div variants={fade(0.4)} className="flex flex-col items-start gap-4">
            {isBride ? (
              <>
                <Link
                  href={AUDIENCE_CONFIG.bride.themesRoute}
                  className="shimmer-btn shadow-xl px-9 py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm inline-block text-center"
                  style={{ fontSize: '0.82rem', letterSpacing: '0.28em' }}
                >
                  {t.bridePrimaryCTA}
                </Link>
                <a
                  href="#wardrobe"
                  className="font-sans text-paper-light/90 underline decoration-gold/60 underline-offset-4 hover:text-paper-light transition-colors"
                  style={{ fontSize: '0.95rem', ...textShadow }}
                >
                  {t.whatToWearShort} &rarr;
                </a>
              </>
            ) : (
              <>
                <button
                  onClick={onCTAClick}
                  className="shimmer-btn shadow-xl px-9 py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm"
                  style={{ fontSize: '0.82rem', letterSpacing: '0.28em' }}
                >
                  {t.groomPrimaryCTA}
                </button>
                <Link
                  href={AUDIENCE_CONFIG.groom.themesRoute}
                  className="font-sans text-paper-light/90 underline decoration-gold/60 underline-offset-4 hover:text-paper-light transition-colors"
                  style={{ fontSize: '0.95rem', ...textShadow }}
                >
                  {t.groomSecondaryCTA} &rarr;
                </Link>
              </>
            )}
          </motion.div>

          {/* Visible in the first viewport, no scrolling needed — otherwise
              a guest who never scrolls past the hero has no way to know the
              Mehndi RSVP and makeup guide exist. Shown on both audiences —
              each page has its own Lovely Ladies section further down. */}
          <motion.button
            variants={fade(0.45)}
            onClick={() => document.getElementById('lovely-ladies')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="hover-lift inline-flex items-center gap-2 rounded-full border border-gold/60 bg-blush/20 backdrop-blur-sm px-4 py-2 mt-5 font-sans text-paper-light hover:border-gold hover:bg-blush/30 transition-colors duration-300"
            style={{ fontSize: '0.85rem', letterSpacing: '0.02em', ...textShadow }}
          >
            <span className="text-gold">&#10022;</span> {t.heroLovelyLadiesLink} <span>&rarr;</span>
          </motion.button>

          <motion.h2 variants={fade(0.5)}
            className="font-display gold-glint text-paper-light leading-none mt-10 break-words"
            style={{ fontSize: 'clamp(1.5rem, 4.2vw, 2.6rem)', wordBreak: 'break-word', ...textShadow }}>
            #SakshiKoMilaKinara
          </motion.h2>
        </motion.div>
      </div>

      {/* ── Scroll cue ── */}
      <motion.button
        onClick={() => window.scrollTo({ top: window.innerHeight * 0.92, behavior: 'smooth' })}
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="gentle-float absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-paper-light/70 hover:text-paper-light transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.button>
    </section>
  )
}

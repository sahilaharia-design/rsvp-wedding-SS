'use client'

// A brief, optional first-visit flourish — never a gate. The real page
// content underneath is already fully rendered before this even mounts,
// so if this component ever failed outright, the guest would simply see
// the page with no overlay at all, never a blocked/blank screen (the
// failure mode that made the old Reveal.tsx state machine unreliable).
//
// Rules, deliberately simple to keep it that way:
//  - Never shows for a deep link (any URL hash) — e.g. /groom#travel-details.
//  - Shows at most once per browser tab session, shared across /bride and
//    /groom, so switching guest sides doesn't repeat it.
//  - Skippable the moment it appears, no minimum wait.
//  - Every stage's animate target has full property parity with its
//    initial (no branch ever passes {}), and MotionConfig's
//    reducedMotion="user" (set globally in Providers.tsx) already makes
//    this respect the OS reduced-motion setting automatically.
//  - Advancement between stages is driven only by plain setTimeout calls,
//    never chained to an animation-completion callback, so a dropped
//    frame can never leave this stuck on screen.
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ENVELOPE_STORAGE_KEY as STORAGE_KEY, ENVELOPE_STAGE_MS } from '@/lib/envelopeIntro'
import SparkleBurst from '@/components/SparkleBurst'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLang } from '@/contexts/Language'

const EASE = [0.25, 0.1, 0.25, 1] as const

type Stage = 'hidden' | 'sealed' | 'opening' | 'welcome' | 'leaving'

// How long each stage stays on screen before advancing to the next.
const STAGE_MS: Partial<Record<Stage, number>> = ENVELOPE_STAGE_MS

export default function EnvelopeIntro() {
  const [stage, setStage] = useState<Stage>('hidden')
  const [imgError, setImgError] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hasDeepLink = window.location.hash.length > 0
    let alreadyShown = false
    try {
      alreadyShown = sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      // sessionStorage unavailable (private mode etc.) — treat as not-shown,
      // the flourish just plays every visit rather than erroring out.
    }
    if (hasDeepLink || alreadyShown) return
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore — in-memory stage still works for this visit
    }
    setStage('sealed')
  }, [])

  const open = useCallback(() => {
    setStage((s) => (s === 'sealed' ? 'opening' : s))
  }, [])

  const skip = useCallback(() => setStage('hidden'), [])

  // Single chained-timeout advancer — each stage's own duration is looked
  // up from STAGE_MS, so adding/reordering stages never risks an infinite
  // wait: a stage with no configured duration (sealed, hidden) simply
  // never auto-advances, only `open()`/`skip()` move it forward.
  useEffect(() => {
    const ms = STAGE_MS[stage]
    if (!ms) return
    const next: Partial<Record<Stage, Stage>> = { opening: 'welcome', welcome: 'leaving', leaving: 'hidden' }
    const t = setTimeout(() => setStage((s) => next[s] ?? s), ms)
    return () => clearTimeout(t)
  }, [stage])

  if (stage === 'hidden') return null

  const opening = stage === 'opening'
  const welcome = stage === 'welcome' || stage === 'leaving'
  const leaving = stage === 'leaving'

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      animate={{
        backgroundColor: welcome ? '#760D25' : '#1A0E08',
        opacity: leaving ? 0 : 1,
      }}
      transition={{ backgroundColor: { duration: 0.5, ease: EASE }, opacity: { duration: 0.5, ease: EASE } }}
    >
      {!welcome && (
        <div className="flex flex-col items-center gap-8 w-full px-6">
          <motion.div
            className="relative cursor-pointer rounded-lg overflow-hidden"
            style={{ width: 'min(440px, 90vw)', aspectRatio: '3 / 2', boxShadow: '0 32px 72px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)' }}
            onClick={open}
            initial={{ opacity: 0, scale: 0.94, y: 0 }}
            animate={
              opening
                ? { opacity: 0, scale: 1.12, y: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } }
                : { opacity: 1, scale: 1, y: [0, -6, 0], transition: { opacity: { duration: 0.6 }, scale: { duration: 0.6 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } } }
            }
            whileHover={opening ? {} : { scale: 1.015 }}
          >
            {!imgError ? (
              <Image
                src="/artwork/invitation-envelope.jpg"
                alt="Illustrated wedding invitation envelope"
                fill sizes="440px" priority
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #760D25, #A17B3D)' }} />
            )}
            {opening && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: '#FFF9EC' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.85, 0] }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            )}
            {opening && <SparkleBurst />}
          </motion.div>

          {!opening && (
            <motion.p
              className="font-sans uppercase tracking-[0.45em] text-center"
              style={{ fontSize: '11px', color: 'rgba(221,200,165,0.75)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0.4, 0.85] }}
              transition={{ duration: 2.5, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {t.envelopeTapToOpen}
            </motion.p>
          )}
        </div>
      )}

      {welcome && (
        <motion.div
          className="text-center px-6"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: leaving ? 0 : 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="font-display gold-glint text-champagne leading-none mb-5 break-words"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)' }}>
            #SakshiKoMilaKinara
          </p>
          <p className="font-serif italic text-paper-light" style={{ fontSize: 'clamp(1.1rem, 2.6vw, 1.4rem)' }}>
            Sakshi &amp; Dr. Sahil
          </p>
        </motion.div>
      )}

      {stage === 'sealed' && (
        <>
          {/* Language must be choosable here — this overlay sits above the
              site header (z-100 vs z-80), so the switcher there is
              unreachable until the envelope is skipped or opened, and
              language never persists across a fresh page load either. */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8">
            <LanguageSwitcher />
          </div>
          <button
            onClick={skip}
            className="absolute top-6 right-6 md:top-8 md:right-8 font-sans uppercase text-champagne/70 hover:text-champagne transition-colors"
            style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}
          >
            {t.envelopeSkip}
          </button>
        </>
      )}
    </motion.div>
  )
}

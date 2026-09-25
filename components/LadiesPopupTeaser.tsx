'use client'

// A one-time, non-blocking flourish announcing the Lovely Ladies content
// (Mehndi RSVP + makeup guide) — shown on both /bride and /groom. Modelled
// on EnvelopeIntro's proven "pop" language (SparkleBurst, a flash, a spring
// reveal) but never a gate: the page underneath is already fully rendered
// and interactive the entire time, dismissible at every stage, and shown
// at most once per browser tab session (shared across audiences, same
// rule as the envelope). Never appears on a deep link, same reasoning as
// the envelope — a guest arriving at a specific anchor already knows where
// they're going.
import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SparkleBurst from '@/components/SparkleBurst'
import { useLang } from '@/contexts/Language'

const STORAGE_KEY = 'std-ladies-popup-shown'
const INITIAL_DELAY_MS = 2200 // let Hero's own entrance settle first
const PEEK_MS = 1600 // how long the peek badge waits before auto-opening
const OPENING_MS = 550 // sparkle-burst flash duration

const EASE = [0.25, 0.1, 0.25, 1] as const
const SPRING = { type: 'spring', stiffness: 260, damping: 20 } as const

type Stage = 'idle' | 'peek' | 'opening' | 'reveal' | 'hidden'

export default function LadiesPopupTeaser() {
  const [stage, setStage] = useState<Stage>('idle')
  const { t } = useLang()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash.length > 0) return
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // sessionStorage unavailable — the flourish just plays every visit
      // rather than erroring out, same fallback as EnvelopeIntro.
    }
    const t1 = setTimeout(() => setStage('peek'), INITIAL_DELAY_MS)
    return () => clearTimeout(t1)
  }, [])

  // Auto-advance peek → opening → reveal, driven by plain timeouts (never
  // chained to an animation-completion callback) so a dropped frame can
  // never leave this stuck mid-sequence.
  useEffect(() => {
    if (stage === 'peek') {
      const t = setTimeout(() => setStage('opening'), PEEK_MS)
      return () => clearTimeout(t)
    }
    if (stage === 'opening') {
      const t = setTimeout(() => setStage('reveal'), OPENING_MS)
      return () => clearTimeout(t)
    }
  }, [stage])

  const openNow = useCallback(() => {
    setStage((s) => (s === 'peek' ? 'opening' : s))
  }, [])

  const dismiss = useCallback(() => setStage('hidden'), [])

  const goToLadies = useCallback(() => {
    setStage('hidden')
    document.getElementById('lovely-ladies')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  if (stage === 'idle' || stage === 'hidden') return null

  return (
    <>
      {/* ── Peek badge — a small tag pinned near the top of the viewport ── */}
      {/* Centering lives on this static wrapper, not on the motion element
          below — Framer Motion owns the `transform` CSS property on
          anything it animates (y/scale here), so a static translateX
          placed on the motion node itself would be clobbered every frame. */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90]">
        <AnimatePresence>
          {(stage === 'peek' || stage === 'opening') && (
            <motion.button
              onClick={openNow}
              className="hover-lift flex flex-col items-center gap-0.5 rounded-2xl px-5 py-2.5 mx-6"
              style={{
                background: 'linear-gradient(135deg, #FCEEE3, #F6DCC8)',
                border: '1.5px solid rgba(161,123,61,0.55)',
                boxShadow: '0 10px 30px rgba(48,54,50,0.22)',
                maxWidth: 'min(88vw, 280px)',
              }}
              initial={{ opacity: 0, y: -30, scale: 0.85 }}
              animate={
                stage === 'opening'
                  ? { opacity: 0, scale: 1.15, transition: { duration: 0.35, ease: EASE } }
                  : { opacity: 1, y: [0, -5, 0], scale: 1, transition: { opacity: { duration: 0.5 }, scale: { ...SPRING }, y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } } }
              }
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            >
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-gold" style={{ fontSize: '0.95rem' }}>&#10022;</span>
                <span className="font-sans text-burgundy" style={{ fontSize: '0.8rem', letterSpacing: '0.04em' }}>
                  {t.ladiesPopupEyebrow}
                </span>
              </span>
              <span className="font-sans uppercase text-burgundy/60 whitespace-nowrap" style={{ fontSize: '0.62rem', letterSpacing: '0.1em' }}>
                {t.ladiesPopupTapHint}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Flash + sparkle burst at the badge's position ── */}
      {stage === 'opening' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[91] pointer-events-none" style={{ width: 1, height: 1 }}>
          <motion.div
            className="absolute rounded-full"
            style={{ width: 60, height: 60, left: -30, top: -30, background: '#FFF9EC' }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.6, 2.2, 2.6] }}
            transition={{ duration: 0.5, ease: EASE }}
          />
          <SparkleBurst count={12} distance={70} />
        </div>
      )}

      {/* ── Full reveal — dismissible modal, page stays interactive behind it ── */}
      <AnimatePresence>
        {stage === 'reveal' && (
          <motion.div
            className="fixed inset-0 z-[92] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(26,14,8,0.55)', backdropFilter: 'blur(3px)' }}
              onClick={dismiss}
            />

            <motion.div
              className="relative w-full rounded-3xl overflow-hidden text-center px-8 py-10 md:px-10 md:py-12"
              style={{
                maxWidth: 440,
                background: 'linear-gradient(165deg, #FFF9F1, #FBECDD)',
                border: '1.5px solid rgba(161,123,61,0.5)',
                boxShadow: '0 32px 72px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.2)',
              }}
              initial={{ opacity: 0, scale: 0.82, rotate: -1.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={SPRING}
            >
              <button
                onClick={dismiss}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-burgundy/50 hover:text-burgundy hover:bg-burgundy/10 transition-colors"
                style={{ fontSize: '1.1rem' }}
              >
                &times;
              </button>

              <p className="text-gold" style={{ fontSize: '1.6rem', lineHeight: 1 }}>&#10022;</p>
              <p className="font-sans uppercase text-burgundy mt-3 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.22em' }}>
                {t.ladiesPopupEyebrow}
              </p>
              <h2 className="font-serif text-ink mb-4" style={{ fontSize: 'clamp(1.5rem, 4vw, 1.9rem)' }}>
                {t.ladiesPopupHeading}
              </h2>
              <p className="font-sans leading-[1.75] text-stone mb-7" style={{ fontSize: '0.98rem' }}>
                {t.ladiesPopupBody}
              </p>

              <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 border border-thread-border/60 px-3.5 py-1.5 font-sans text-ink/80" style={{ fontSize: '0.8rem' }}>
                  &#128144; {t.ladiesPopupMehndiLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 border border-thread-border/60 px-3.5 py-1.5 font-sans text-ink/80" style={{ fontSize: '0.8rem' }}>
                  &#10024; {t.ladiesPopupMakeupLabel}
                </span>
              </div>

              <button
                onClick={goToLadies}
                className="shimmer-btn w-full py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm mb-4"
                style={{ fontSize: '0.85rem', letterSpacing: '0.24em' }}
              >
                {t.ladiesPopupCTA} &rarr;
              </button>

              <button
                onClick={dismiss}
                className="font-sans text-stone/70 hover:text-burgundy transition-colors"
                style={{ fontSize: '0.85rem' }}
              >
                {t.ladiesPopupDismiss}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

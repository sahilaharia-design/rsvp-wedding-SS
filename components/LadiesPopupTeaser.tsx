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
//
// Deliberately NOT time-triggered on page load: the primary objective on
// /groom is travel confirmation, and this must never compete with it. It
// only arms once the guest has scrolled past that objective (Travel
// Details on groom; a generic "they're engaged" depth on bride, which has
// no travel form of its own) — and even then it waits for an exit-intent
// signal (desktop: cursor leaving toward the browser chrome; mobile: a
// fast upward flick, the closest touch equivalent) before it actually
// fires, with a generous fallback timer as a last resort so an engaged
// guest who never triggers either heuristic still eventually sees it.
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SparkleBurst from '@/components/SparkleBurst'
import { useLang } from '@/contexts/Language'
import type { Audience } from '@/lib/audience'

const STORAGE_KEY = 'std-ladies-popup-shown'
const OPENING_MS = 550 // sparkle-burst flash duration before the card appears
const ARM_FALLBACK_MS = 13000 // last-resort timer once armed
const FAST_SCROLL_UP_PX = 60
const FAST_SCROLL_WINDOW_MS = 220

const EASE = [0.25, 0.1, 0.25, 1] as const
const SPRING = { type: 'spring', stiffness: 260, damping: 20 } as const

type Stage = 'idle' | 'opening' | 'reveal' | 'hidden'

export default function LadiesPopupTeaser({ audience }: { audience: Audience }) {
  const [stage, setStage] = useState<Stage>('idle')
  const stageRef = useRef<Stage>('idle')
  const { t } = useLang()

  useEffect(() => {
    stageRef.current = stage
  }, [stage])

  const fire = useCallback(() => {
    if (stageRef.current !== 'idle') return
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore — in-memory stage still fires for this visit
    }
    setStage('opening')
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash.length > 0) return
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return
    } catch {
      // sessionStorage unavailable — the flourish just plays every visit
      // rather than erroring out, same fallback as EnvelopeIntro.
    }

    let cleanupTrigger: (() => void) | undefined

    const armAndListen = () => {
      const onMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !e.relatedTarget) fire()
      }
      let lastY = window.scrollY
      let lastT = Date.now()
      const onFastScroll = () => {
        const y = window.scrollY
        const now = Date.now()
        const dy = y - lastY
        const dt = now - lastT
        if (dy < -FAST_SCROLL_UP_PX && dt < FAST_SCROLL_WINDOW_MS) fire()
        lastY = y
        lastT = now
      }
      document.addEventListener('mouseleave', onMouseLeave)
      window.addEventListener('scroll', onFastScroll, { passive: true })
      const fallback = setTimeout(fire, ARM_FALLBACK_MS)
      cleanupTrigger = () => {
        document.removeEventListener('mouseleave', onMouseLeave)
        window.removeEventListener('scroll', onFastScroll)
        clearTimeout(fallback)
      }
    }

    let armed = false
    const onScrollArm = () => {
      if (armed) return
      const pastObjective =
        audience === 'groom'
          ? (() => {
              const el = document.getElementById('travel-details')
              return !!el && el.getBoundingClientRect().bottom <= 0
            })()
          : window.scrollY > window.innerHeight * 0.85
      if (!pastObjective) return
      armed = true
      window.removeEventListener('scroll', onScrollArm)
      armAndListen()
    }
    window.addEventListener('scroll', onScrollArm, { passive: true })
    onScrollArm() // covers a reload that restores an already-scrolled position

    return () => {
      window.removeEventListener('scroll', onScrollArm)
      cleanupTrigger?.()
    }
  }, [audience, fire])

  // opening → reveal, driven by a plain timeout (never chained to an
  // animation-completion callback) so a dropped frame can never leave
  // this stuck mid-sequence.
  useEffect(() => {
    if (stage === 'opening') {
      const t = setTimeout(() => setStage('reveal'), OPENING_MS)
      return () => clearTimeout(t)
    }
  }, [stage])

  const dismiss = useCallback(() => setStage('hidden'), [])

  const goToLadies = useCallback(() => {
    setStage('hidden')
    document.getElementById('lovely-ladies')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  if (stage === 'idle' || stage === 'hidden') return null

  return (
    <>
      {/* ── Flash + sparkle burst, centred, right as the card appears ── */}
      {stage === 'opening' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[91] pointer-events-none" style={{ width: 1, height: 1 }}>
          <motion.div
            className="absolute rounded-full"
            style={{ width: 70, height: 70, left: -35, top: -35, background: '#FFF9EC' }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.6, 2.4, 2.8] }}
            transition={{ duration: 0.5, ease: EASE }}
          />
          <SparkleBurst count={12} distance={90} />
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

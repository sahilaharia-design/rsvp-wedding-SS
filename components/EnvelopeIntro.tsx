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
//  - Always skippable, immediately, no minimum wait.
//  - A single opacity animation with full initial/animate parity in every
//    branch (no state branch ever passes {}), and MotionConfig's
//    reducedMotion="user" (set globally in Providers.tsx) already makes
//    this respect the OS reduced-motion setting automatically.
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const EASE = [0.25, 0.1, 0.25, 1] as const
const STORAGE_KEY = 'std-envelope-shown'

function SparkleBurst() {
  const sparkles = Array.from({ length: 8 })
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {sparkles.map((_, i) => {
        const angle = (i / sparkles.length) * Math.PI * 2
        const dist = 90
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ width: 5, height: 5, background: '#F3D9A4', boxShadow: '0 0 8px 2px rgba(243,217,164,0.6)' }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: [0, 1, 0],
              scale: [0.4, 1, 0.6],
            }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        )
      })}
    </div>
  )
}

type Stage = 'hidden' | 'sealed' | 'opening'

export default function EnvelopeIntro() {
  const [stage, setStage] = useState<Stage>('hidden')
  const [imgError, setImgError] = useState(false)

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

  // The definitive unmount trigger — a plain timeout, not chained to any
  // animation-completion callback, so a dropped animation frame can never
  // leave this stuck on screen.
  useEffect(() => {
    if (stage !== 'opening') return
    const t = setTimeout(() => setStage('hidden'), 900)
    return () => clearTimeout(t)
  }, [stage])

  if (stage === 'hidden') return null

  const opening = stage === 'opening'

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#1A0E08' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{ duration: opening ? 0.8 : 0, delay: opening ? 0.25 : 0 }}
    >
      <div className="flex flex-col items-center gap-8 w-full px-6">
        <motion.div
          className="relative cursor-pointer rounded-lg overflow-hidden"
          style={{ width: 'min(440px, 90vw)', aspectRatio: '3 / 2', boxShadow: '0 32px 72px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)' }}
          onClick={open}
          initial={{ opacity: 0, scale: 0.94, y: 0 }}
          animate={
            opening
              ? { opacity: 0, scale: 1.06, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }
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
            Tap to Open
          </motion.p>
        )}
      </div>

      {!opening && (
        <button
          onClick={skip}
          className="absolute top-6 right-6 md:top-8 md:right-8 font-sans uppercase text-champagne/70 hover:text-champagne transition-colors"
          style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}
        >
          Skip
        </button>
      )}
    </motion.div>
  )
}

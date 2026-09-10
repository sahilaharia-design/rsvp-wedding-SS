'use client'

import Image from 'next/image'
import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/Language'
import { useMusic } from '@/contexts/Music'
import { useGuestSide, GuestSide } from '@/contexts/GuestSide'
import { useRevealed } from '@/contexts/Revealed'

type Stage = 'sealed' | 'opening' | 'question' | 'welcome' | 'done'

const EASE = [0.25, 0.1, 0.25, 1] as const

// ── Sparkle burst — a small gold radiate-and-fade at the moment of opening.
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

const PlaneIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#760D25" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 3 3 10l6.5 2.5L12 19l2-5.5L21 3z" />
  </svg>
)
const PinIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#760D25" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
    <circle cx="12" cy="9" r="2.3" />
  </svg>
)

export default function Reveal() {
  const [stage, setStage] = useState<Stage>('sealed')
  const [envImgError, setEnvImgError] = useState(false)
  const { t } = useLang()
  const { start } = useMusic()
  const { side, ready, setSide } = useGuestSide()
  const { setRevealed } = useRevealed()
  const welcomeSide = useRef<GuestSide>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const hasDeepLink = window.location.hash === '#travel-details'
    const alreadyRevealed = sessionStorage.getItem('std-revealed')

    if (hasDeepLink || alreadyRevealed) {
      // Never gate a deep link, and never repeat the ceremony twice in one
      // session/tab — go straight to the finished state.
      setStage('done')
      setRevealed(true)
    }
    sessionStorage.setItem('std-revealed', '1')

    if (hasDeepLink) {
      setTimeout(() => {
        document.getElementById('travel-details')?.scrollIntoView({ block: 'start' })
      }, 60)
    }
  }, [])

  // The "switch view" control resets `side` to null (and clears the
  // "already revealed" session flag) without unmounting this component —
  // bring the whole ceremony back, envelope included, rather than jumping
  // straight to the question underneath an envelope that would otherwise
  // never reappear this session.
  useEffect(() => {
    if (side === null && stage === 'done') {
      setStage('sealed')
      setRevealed(false)
    }
  }, [side, stage, setRevealed])

  // Once the envelope finishes opening, decide what's next: a returning
  // guest who already has a side saved skips straight to the homepage;
  // everyone else sees the side question — and nothing else.
  const advanceAfterEnvelope = useCallback(() => {
    if (!ready) {
      // localStorage hasn't been read yet (extremely fast, but be safe) —
      // check again shortly rather than assuming "no side chosen".
      setTimeout(advanceAfterEnvelope, 50)
      return
    }
    if (side === null) {
      setStage('question')
    } else {
      setStage('done')
      setRevealed(true)
    }
  }, [ready, side, setRevealed])

  const openEnvelope = useCallback(() => {
    if (stage !== 'sealed') return
    start() // user gesture — safe to start audio with sound here
    setStage('opening')
    setTimeout(advanceAfterEnvelope, 1000)
  }, [stage, start, advanceAfterEnvelope])

  const skipEnvelope = useCallback(() => {
    start()
    advanceAfterEnvelope()
  }, [start, advanceAfterEnvelope])

  const chooseSide = useCallback((next: 'groom' | 'bride') => {
    welcomeSide.current = next
    setSide(next)
    setStage('welcome')
    setTimeout(() => { setStage('done'); setRevealed(true) }, 1300)
  }, [setSide, setRevealed])

  if (stage === 'done') return null

  return (
    <AnimatePresence>
      <motion.div
        key="reveal-root"
        className="fixed inset-0 z-[100] overflow-hidden"
        exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
      >
        {/* ── Sealed / opening — the envelope, nothing else ── */}
        {(stage === 'sealed' || stage === 'opening') && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: '#1A0E08' }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <div className="flex flex-col items-center gap-8 w-full px-6">
              <motion.div
                className="relative cursor-pointer rounded-lg overflow-hidden"
                style={{ width: 'min(440px, 90vw)', aspectRatio: '3 / 2', boxShadow: '0 32px 72px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)' }}
                onClick={stage === 'opening' ? undefined : openEnvelope}
                animate={stage === 'opening'
                  ? { scale: 1.06, opacity: 0, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } }
                  : { y: [0, -6, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }
                }
                initial={{ opacity: 0, scale: 0.94 }}
                whileHover={stage === 'opening' ? {} : { scale: 1.015 }}
              >
                {!envImgError ? (
                  <Image
                    src="/artwork/invitation-envelope.jpg"
                    alt="Illustrated wedding invitation envelope"
                    fill sizes="440px" priority
                    className="object-cover"
                    onError={() => setEnvImgError(true)}
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #760D25, #A17B3D)' }} />
                )}
                {stage === 'opening' && <SparkleBurst />}
              </motion.div>

              <AnimatePresence>
                {stage === 'sealed' && (
                  <motion.p
                    key="tap"
                    className="font-sans uppercase tracking-[0.45em] text-center"
                    style={{ fontSize: '11px', color: 'rgba(221,200,165,0.75)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.85, 0.4, 0.85] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.5, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {t.tapToOpen}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {stage === 'sealed' && (
              <button
                onClick={skipEnvelope}
                className="absolute top-6 right-6 md:top-8 md:right-8 font-sans uppercase text-champagne/70 hover:text-champagne transition-colors"
                style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}
              >
                Skip
              </button>
            )}
          </motion.div>
        )}

        {/* ── Question — the ONLY thing on screen: which side ── */}
        {stage === 'question' && (
          <motion.div
            key="question"
            className="absolute inset-0 flex items-center justify-center px-6 grain-overlay"
            style={{ background: 'linear-gradient(160deg, #FAF6F0 0%, #F2EDE4 55%, #EDE0D2 100%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: EASE } }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <motion.div
              className="w-full max-w-2xl text-center"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            >
              <div className="w-10 h-[2px] bg-gold mx-auto mb-6" />
              <h2 className="font-serif text-ink mb-3" style={{ fontSize: 'clamp(1.6rem, 4.2vw, 2.3rem)' }}>
                {t.sideSelectHeading}
              </h2>
              <p className="font-sans text-stone mb-10" style={{ fontSize: '1.05rem' }}>
                {t.sideSelectBody}
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                <motion.button
                  onClick={() => chooseSide('groom')}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  className="shimmer-btn group text-left bg-paper-light border-2 border-thread-border/60 hover:border-burgundy rounded-2xl p-7 transition-colors duration-300"
                >
                  <PlaneIcon />
                  <span className="font-sans uppercase text-gold mt-4 block" style={{ fontSize: '0.72rem', letterSpacing: '0.2em' }}>
                    {t.sideGroomTag}
                  </span>
                  <h3 className="font-serif text-ink mt-2 mb-2" style={{ fontSize: '1.4rem' }}>
                    {t.sideGroomLabel}
                  </h3>
                  <p className="font-sans text-stone" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {t.sideGroomBody}
                  </p>
                </motion.button>

                <motion.button
                  onClick={() => chooseSide('bride')}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  className="shimmer-btn group text-left bg-paper-light border-2 border-thread-border/60 hover:border-burgundy rounded-2xl p-7 transition-colors duration-300"
                >
                  <PinIcon />
                  <span className="font-sans uppercase text-gold mt-4 block" style={{ fontSize: '0.72rem', letterSpacing: '0.2em' }}>
                    {t.sideBrideTag}
                  </span>
                  <h3 className="font-serif text-ink mt-2 mb-2" style={{ fontSize: '1.4rem' }}>
                    {t.sideBrideLabel}
                  </h3>
                  <p className="font-sans text-stone" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {t.sideBrideBody}
                  </p>
                </motion.button>
              </div>

              <button
                onClick={() => chooseSide('groom')}
                className="mt-8 font-sans text-stone/70 hover:text-ink underline decoration-stone/30 underline-offset-4 transition-colors"
                style={{ fontSize: '0.85rem' }}
              >
                {t.sideSkip}
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Welcome — a brief, personal beat before the homepage appears ── */}
        {stage === 'welcome' && (
          <motion.div
            key="welcome"
            className="absolute inset-0 flex items-center justify-center px-6"
            style={{ background: 'linear-gradient(160deg, #760D25 0%, #5c0a1c 100%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE } }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <motion.div
              className="text-center cursor-pointer"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              onClick={() => { setStage('done'); setRevealed(true) }}
            >
              <p className="font-display gold-glint text-champagne leading-none mb-5"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)' }}>
                #SakshiKoMilaKinara
              </p>
              <p className="font-serif italic text-paper-light" style={{ fontSize: 'clamp(1.1rem, 2.6vw, 1.4rem)' }}>
                {welcomeSide.current === 'bride' ? t.welcomeBride : t.welcomeGroom}
              </p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

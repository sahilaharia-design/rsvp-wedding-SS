'use client'

import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/Language'
import { useMusic } from '@/contexts/Music'

type Stage = 'sealed' | 'opening'

// ── Envelope — illustrated artwork, tap to open ────────────────────────────
function EnvelopeVisual({
  isOpening,
  onClick,
  tapLabel,
}: {
  isOpening: boolean
  onClick: () => void
  tapLabel: string
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex flex-col items-center gap-8 w-full px-6">
      <motion.div
        className="relative cursor-pointer rounded-lg overflow-hidden"
        style={{ width: 'min(440px, 90vw)', aspectRatio: '3 / 2', boxShadow: '0 32px 72px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)' }}
        onClick={isOpening ? undefined : onClick}
        animate={isOpening
          ? { scale: 1.06, opacity: 0, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } }
          : { y: [0, -6, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }
        }
        whileHover={isOpening ? {} : { scale: 1.015 }}
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
      </motion.div>

      {/* Tap to open */}
      <AnimatePresence>
        {!isOpening && (
          <motion.p
            key="tap"
            className="font-sans uppercase tracking-[0.45em] text-center"
            style={{ fontSize: '11px', color: 'rgba(221,200,165,0.75)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0.4, 0.85] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {tapLabel}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function GrandReveal() {
  const [visible, setVisible] = useState(false)
  const [stage, setStage] = useState<Stage>('sealed')
  const { t } = useLang()
  const { start } = useMusic()

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Deep links must never be gated behind the envelope: a direct
    // #travel-details anchor (or arriving already having seen it) skips it.
    const hasDeepLink = window.location.hash === '#travel-details'
    const alreadyRevealed = sessionStorage.getItem('std-revealed')

    if (!alreadyRevealed && !hasDeepLink) {
      setVisible(true)
    }
    sessionStorage.setItem('std-revealed', '1')

    if (hasDeepLink) {
      // Let layout settle before jumping, since content mounts client-side.
      // A short timeout (rather than requestAnimationFrame) so this still
      // fires promptly even if the tab isn't the active/visible one yet.
      setTimeout(() => {
        document.getElementById('travel-details')?.scrollIntoView({ block: 'start' })
      }, 60)
    }
  }, [])

  const dismiss = useCallback(() => setVisible(false), [])

  const openEnvelope = useCallback(() => {
    if (stage !== 'sealed') return
    start() // user gesture — safe to start audio with sound here
    setStage('opening')
    setTimeout(dismiss, 1000)
  }, [stage, dismiss, start])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ backgroundColor: '#1A0E08' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <EnvelopeVisual
              isOpening={stage === 'opening'}
              onClick={openEnvelope}
              tapLabel={t.tapToOpen}
            />
          </motion.div>

          {/* Skip — envelope must never gate the invitation or the form */}
          {stage === 'sealed' && (
            <button
              onClick={dismiss}
              className="absolute top-6 right-6 md:top-8 md:right-8 font-sans uppercase text-champagne/70 hover:text-champagne transition-colors"
              style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}
            >
              Skip
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/Language'

type Stage = 'sealed' | 'opening'

// ── Wax seal — S & S monogram ─────────────────────────────────────────────────
function WaxSeal({ size = 54 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 54 54" fill="none">
      <circle cx="27" cy="27" r="25" fill="#6E1A28" />
      <circle cx="27" cy="27" r="22.5" fill="none" stroke="rgba(245,237,226,0.22)" strokeWidth="0.7" />
      <text
        x="27" y="32"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="13"
        fontStyle="italic"
        fill="#F5EDE2"
        letterSpacing="2"
      >
        S &amp; S
      </text>
    </svg>
  )
}

// ── Envelope ──────────────────────────────────────────────────────────────────
function EnvelopeVisual({
  isOpening,
  onClick,
  tapLabel,
}: {
  isOpening: boolean
  onClick: () => void
  tapLabel: string
}) {
  const W = 400
  const H = 280
  const FLAP_H = 126

  return (
    <div className="flex flex-col items-center gap-10 w-full px-6">
      <motion.div
        className="relative cursor-pointer"
        style={{ width: `min(${W}px, 92vw)`, aspectRatio: `${W} / ${H}` }}
        onClick={isOpening ? undefined : onClick}
        animate={isOpening ? {} : {
          y: [0, -6, 0],
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileHover={isOpening ? {} : { scale: 1.015 }}
        transition={{ duration: 0.2 }}
      >
        {/* Shadow */}
        <div
          className="absolute inset-0 rounded-sm pointer-events-none"
          style={{ boxShadow: '0 32px 72px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.4)' }}
        />

        {/* Envelope body */}
        <div
          className="absolute inset-0"
          style={{ background: '#F5EDE2', border: '1px solid rgba(44,24,16,0.12)' }}
        >
          {/* Diagonal crease lines */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, transparent 49.7%, rgba(44,24,16,0.06) 50%, transparent 50.3%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom left, transparent 49.7%, rgba(44,24,16,0.06) 50%, transparent 50.3%)' }} />

          {/* Inside text — fades in as flap opens */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8"
            initial={{ opacity: 0 }}
            animate={isOpening ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            <p className="font-display text-center" style={{ fontSize: 'clamp(1.2rem, 5vw, 2.2rem)', color: '#6E1A28', opacity: 0.7 }}>
              #SakshiKoMilaKinara
            </p>
            <p className="font-serif italic text-center" style={{ fontSize: 'clamp(0.78rem, 2.2vw, 1rem)', color: '#2C1810', opacity: 0.45 }}>
              Sakshi &amp; Dr. Sahil &nbsp;·&nbsp; 20 &ndash; 22 January 2027
            </p>
          </motion.div>

          {/* Bottom fold triangle */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', clipPath: 'polygon(0 100%, 100% 100%, 50% 0)', background: 'rgba(44,24,16,0.05)', pointerEvents: 'none' }} />
        </div>

        {/* Animated flap */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `${(FLAP_H / H) * 100}%`, perspective: '1200px', zIndex: 10 }}>
          <motion.div
            style={{ width: '100%', height: '100%', transformOrigin: '50% 0%', transformStyle: 'preserve-3d' }}
            animate={isOpening
              ? { rotateX: -165, transition: { duration: 1.1, delay: 0.1, ease: [0.4, 0, 0.2, 1] } }
              : { rotateX: 0 }
            }
          >
            {/* Flap face */}
            <div style={{ position: 'absolute', inset: 0, background: '#EDE8DF', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', borderLeft: '1px solid rgba(44,24,16,0.08)', borderRight: '1px solid rgba(44,24,16,0.08)' }} />
            {/* Wax seal at flap tip */}
            <div style={{ position: 'absolute', bottom: '-27px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
              <WaxSeal size={54} />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tap to open */}
      <AnimatePresence>
        {!isOpening && (
          <motion.p
            key="tap"
            className="font-sans uppercase tracking-[0.45em] text-center"
            style={{ fontSize: '11px', color: 'rgba(212,169,154,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.2, 0.5] }}
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

  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('std-revealed')) {
      setVisible(true)
      sessionStorage.setItem('std-revealed', '1')
    }
  }, [])

  const dismiss = useCallback(() => setVisible(false), [])

  const openEnvelope = useCallback(() => {
    if (stage !== 'sealed') return
    setStage('opening')
    // Flap opens in 1.1s → pause 0.7s for inside content to show → fade out
    setTimeout(dismiss, 1900)
  }, [stage, dismiss])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ backgroundColor: '#0D0805' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } }}
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}

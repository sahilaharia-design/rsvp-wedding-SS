'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/Language'

type Stage = 'sealed' | 'opening' | 'content'

const PARTICLES = [
  { id: 0,  left: '8%',  size: 4,  delay: 0.2, dur: 9  },
  { id: 1,  left: '18%', size: 3,  delay: 1.5, dur: 11 },
  { id: 2,  left: '28%', size: 6,  delay: 0.8, dur: 8  },
  { id: 3,  left: '40%', size: 3,  delay: 2.1, dur: 12 },
  { id: 4,  left: '52%', size: 5,  delay: 0.5, dur: 10 },
  { id: 5,  left: '64%', size: 4,  delay: 1.8, dur: 7  },
  { id: 6,  left: '75%', size: 7,  delay: 0.3, dur: 13 },
  { id: 7,  left: '85%', size: 3,  delay: 2.6, dur: 9  },
  { id: 8,  left: '92%', size: 5,  delay: 1.1, dur: 11 },
  { id: 9,  left: '33%', size: 4,  delay: 3.2, dur: 8  },
  { id: 10, left: '58%', size: 6,  delay: 2.8, dur: 10 },
  { id: 11, left: '12%', size: 3,  delay: 4.0, dur: 14 },
  { id: 12, left: '72%', size: 5,  delay: 3.6, dur: 9  },
]

// ── Wax seal ─────────────────────────────────────────────────────────────────
function WaxSeal({ size = 54 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 54 54" fill="none">
      <circle cx="27" cy="27" r="25" fill="#6E1A28" />
      <circle cx="27" cy="27" r="23" fill="none" stroke="rgba(245,237,226,0.25)" strokeWidth="0.8" />
      <text
        x="27" y="35"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="22" fontStyle="italic"
        fill="#F5EDE2"
      >
        S
      </text>
    </svg>
  )
}

// ── Envelope visual ───────────────────────────────────────────────────────────
function EnvelopeVisual({
  isOpening,
  onClick,
  tapLabel,
}: {
  isOpening: boolean
  onClick: () => void
  tapLabel: string
}) {
  // Responsive: clamp envelope width
  const W = 400
  const H = 280
  const FLAP_H = 126 // 45% of H

  return (
    <div className="flex flex-col items-center gap-10 w-full px-6">
      {/* Envelope wrapper */}
      <motion.div
        className="relative cursor-pointer"
        style={{
          width: `min(${W}px, 92vw)`,
          aspectRatio: `${W} / ${H}`,
        }}
        onClick={isOpening ? undefined : onClick}
        animate={isOpening ? {} : {
          y: [0, -6, 0],
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileHover={isOpening ? {} : { scale: 1.015 }}
        transition={{ duration: 0.2 }}
      >
        {/* Soft drop shadow */}
        <div
          className="absolute inset-0 rounded-sm pointer-events-none"
          style={{ boxShadow: '0 32px 72px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.4)' }}
        />

        {/* Envelope body */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ background: '#F5EDE2', border: '1px solid rgba(44,24,16,0.12)' }}
        >
          {/* Side fold lines (decorative diagonal creases) */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom right, transparent 49.7%, rgba(44,24,16,0.06) 50%, transparent 50.3%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom left, transparent 49.7%, rgba(44,24,16,0.06) 50%, transparent 50.3%)',
          }} />

          {/* Inside text — revealed when opening */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={isOpening ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <p
              className="font-display text-center"
              style={{
                fontSize: 'clamp(1.4rem, 5vw, 2.4rem)',
                color: '#6E1A28',
                opacity: 0.7,
              }}
            >
              #SakshiKoMilaKinara
            </p>
            <p
              className="font-serif italic text-center"
              style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)', color: '#2C1810', opacity: 0.5 }}
            >
              Sakshi &amp; Dr. Sahil &nbsp;·&nbsp; 20 – 22 January 2027
            </p>
          </motion.div>

          {/* Bottom fold triangle (always visible) */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
            clipPath: 'polygon(0 100%, 100% 100%, 50% 0)',
            background: 'rgba(44,24,16,0.05)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* ── Animated flap ── */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: `${FLAP_H / H * 100}%`,
            perspective: '1200px',
            zIndex: 10,
          }}
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              transformOrigin: '50% 0%',
              transformStyle: 'preserve-3d',
            }}
            animate={isOpening
              ? { rotateX: -165, transition: { duration: 1.1, delay: 0.1, ease: [0.4, 0, 0.2, 1] } }
              : { rotateX: 0 }
            }
          >
            {/* Flap front face */}
            <div
              style={{
                position: 'absolute', inset: 0,
                background: '#EDE8DF',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                borderLeft: '1px solid rgba(44,24,16,0.08)',
                borderRight: '1px solid rgba(44,24,16,0.08)',
              }}
            />
            {/* Wax seal — sits at tip of flap */}
            <div
              style={{
                position: 'absolute',
                bottom: '-27px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
              }}
            >
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

// ── Reveal content ────────────────────────────────────────────────────────────
function RevealContent({
  onDismiss,
  tapLabel,
}: {
  onDismiss: () => void
  tapLabel: string
}) {
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 900
  return (
    <div
      className="relative flex flex-col items-center justify-center h-full text-center px-6 cursor-pointer"
      onClick={onDismiss}
    >
      {/* Bokeh */}
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute bottom-0 rounded-full pointer-events-none"
          style={{ left: p.left, width: p.size, height: p.size, background: '#D4A99A' }}
          animate={{ y: [0, -(screenH + 40)], opacity: [0, 0.18, 0.1, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(110,26,40,0.22) 0%, transparent 70%)',
      }} />

      <div className="relative flex flex-col items-center gap-0">
        {/* Wax seal */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <WaxSeal size={64} />
        </motion.div>

        {/* Lines + SAVE THE DATE */}
        <motion.div
          className="flex items-center gap-4 mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <motion.div
            style={{ height: 1, background: 'rgba(212,169,154,0.3)', originX: 1, width: 56 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <p className="font-sans uppercase" style={{ fontSize: 11, letterSpacing: '0.55em', color: 'rgba(212,169,154,0.5)' }}>
            Save the Date
          </p>
          <motion.div
            style={{ height: 1, background: 'rgba(212,169,154,0.3)', originX: 0, width: 56 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </motion.div>

        {/* Hashtag */}
        <motion.h1
          className="font-display leading-none mb-4"
          style={{
            fontSize: 'clamp(2.4rem, 9vw, 6rem)',
            color: '#F5EDE2',
            filter: 'drop-shadow(0 0 28px rgba(110,26,40,0.45))',
          }}
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.0, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          #SakshiKoMilaKinara
        </motion.h1>

        {/* Names */}
        <motion.p
          className="font-serif"
          style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.65rem)', color: 'rgba(245,237,226,0.87)' }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.4 }}
        >
          Sakshi &amp; Dr. Sahil
        </motion.p>

        {/* Gold divider */}
        <motion.div
          style={{ height: 1, width: 40, background: 'rgba(184,150,12,0.45)', margin: '14px 0', originX: 0.5 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 1.8 }}
        />

        {/* Date range */}
        <motion.p
          className="font-serif italic mb-1"
          style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', color: 'rgba(212,169,154,0.88)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
        >
          20 &ndash; 22 January 2027
        </motion.p>

        {/* Event breakdown */}
        <motion.div
          className="flex gap-4 md:gap-7 mt-2 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          {[
            { d: '20', e: 'Mehendi & Engagement' },
            { d: '21', e: 'Haldi & Wedding' },
            { d: '22', e: 'Checkout' },
          ].map(({ d, e }) => (
            <div key={d} className="text-center">
              <p className="font-serif italic mb-0.5" style={{ fontSize: 13, color: 'rgba(212,169,154,0.65)' }}>{d}</p>
              <p className="font-sans" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(212,169,154,0.4)', textTransform: 'uppercase' }}>{e}</p>
            </div>
          ))}
        </motion.div>

        {/* Location */}
        <motion.p
          className="font-sans uppercase mb-7"
          style={{ fontSize: 10, letterSpacing: '0.45em', color: 'rgba(212,169,154,0.42)', marginTop: 8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.4 }}
        >
          Pitampura &middot; Delhi &middot; India
        </motion.p>

        {/* Hindi subtitle */}
        <motion.p
          className="font-serif mb-9"
          style={{ fontSize: '0.9rem', color: 'rgba(212,169,154,0.28)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 2.7 }}
        >
          साक्षी का किनारा
        </motion.p>

        {/* Tap to continue */}
        <motion.p
          className="font-sans uppercase"
          style={{ fontSize: 10, letterSpacing: '0.4em', color: 'rgba(212,169,154,0.3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0.12, 0.3] }}
          transition={{ duration: 2.6, delay: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {tapLabel}
        </motion.p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
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

  const openEnvelope = useCallback(() => {
    if (stage !== 'sealed') return
    setStage('opening')
    setTimeout(() => setStage('content'), 1700)
  }, [stage])

  const dismiss = useCallback(() => {
    setVisible(false)
  }, [])

  useEffect(() => {
    if (stage !== 'content') return
    const t = setTimeout(dismiss, 9000)
    return () => clearTimeout(t)
  }, [stage, dismiss])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ backgroundColor: '#0D0805' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.0, ease: [0.4, 0, 0.2, 1] } }}
        >
          <AnimatePresence mode="wait">
            {stage !== 'content' ? (
              <motion.div
                key="envelope"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.55 } }}
                transition={{ duration: 0.7 }}
              >
                <EnvelopeVisual
                  isOpening={stage === 'opening'}
                  onClick={openEnvelope}
                  tapLabel={t.tapToOpen}
                />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                <RevealContent onDismiss={dismiss} tapLabel={t.tapToContinue} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

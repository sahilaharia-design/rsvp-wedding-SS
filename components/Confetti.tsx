'use client'

// One-shot celebration burst: petals, ribbons and sparkles shoot up from the
// top-centre of the screen and tumble down. Used when a guest finishes a form.
// Lives in a fixed, overflow-hidden layer so it can never cause horizontal
// scroll, ignores taps, removes itself after a few seconds, and — via the
// site-wide MotionConfig — is skipped for people who prefer reduced motion.
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const COLORS = ['#F3D9A4', '#A17B3D', '#760D25', '#E8C5BE', '#ED237A', '#205852', '#E2971F', '#8A1530']
const COUNT = 46

interface Bit { id: number; x: number; peak: number; fall: number; rot: number; dur: number; delay: number; w: number; h: number; round: boolean; color: string }

export default function Confetti() {
  const reduce = useReducedMotion()
  const [bits, setBits] = useState<Bit[]>([])
  const [alive, setAlive] = useState(true)

  useEffect(() => {
    if (reduce) { setAlive(false); return }
    const r = Math.random
    setBits(Array.from({ length: COUNT }, (_, id) => {
      const angle = (-90 + (r() - 0.5) * 150) * (Math.PI / 180)
      const speed = 140 + r() * 190
      return {
        id,
        x: Math.cos(angle) * speed,
        peak: Math.sin(angle) * speed,
        fall: 300 + r() * 360,
        rot: (r() - 0.5) * 900,
        dur: 2.2 + r() * 1.5,
        delay: r() * 0.18,
        w: 6 + r() * 7,
        h: 9 + r() * 10,
        round: r() > 0.7,
        color: COLORS[id % COLORS.length],
      }
    }))
    const t = setTimeout(() => setAlive(false), 4600)
    return () => clearTimeout(t)
  }, [reduce])

  if (!alive || !bits.length) return null
  return (
    <div aria-hidden="true" className="fixed inset-0 z-[80] overflow-hidden pointer-events-none">
      <div className="absolute left-1/2" style={{ top: '30%' }}>
        {bits.map((b) => (
          <motion.span
            key={b.id}
            className="absolute block"
            style={{ width: b.w, height: b.round ? b.w : b.h, background: b.color, borderRadius: b.round ? '50%' : '2px 60% 2px 60%' }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.6 }}
            animate={{
              x: [0, b.x * 0.85, b.x * 1.05],
              y: [0, b.peak, b.peak + b.fall],
              rotate: [0, b.rot * 0.5, b.rot],
              opacity: [1, 1, 0],
              scale: [0.6, 1, 0.9],
            }}
            transition={{ duration: b.dur, delay: b.delay, ease: 'easeOut', times: [0, 0.38, 1] }}
          />
        ))}
      </div>
    </div>
  )
}

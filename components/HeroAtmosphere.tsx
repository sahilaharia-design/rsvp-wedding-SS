'use client'

// Ambient layer over the hero photo: marigold / rose petals drifting down,
// and (on devices with a real pointer) a soft gold spotlight that follows the
// cursor. Decorative only — aria-hidden, pointer-events none, never blocks a
// tap. All motion is CSS transform/opacity; it's hidden entirely under
// prefers-reduced-motion, trimmed on small screens, and paused whenever the
// hero is scrolled out of view so it costs no battery.
import { useEffect, useRef, useState } from 'react'

const COLORS = ['#E2971F', '#F3D9A4', '#E8C5BE', '#ED237A', '#D4A99A', '#F3D9A4', '#E2971F', '#E8C5BE']
const COUNT = 16

// Deterministic pseudo-random so a petal's look is stable per index.
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

interface Petal { left: number; size: number; dur: number; delay: number; sway: number; rot: number; op: number; color: string }

export default function HeroAtmosphere() {
  const layerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [petals, setPetals] = useState<Petal[]>([])

  // Built after mount so server and client markup can never disagree.
  useEffect(() => {
    setPetals(Array.from({ length: COUNT }, (_, i) => ({
      left: rand(i, 1) * 100,
      size: 11 + rand(i, 2) * 15,
      dur: 12 + rand(i, 3) * 11,
      delay: -rand(i, 4) * 22, // negative: already mid-fall at first paint
      sway: 30 + rand(i, 5) * 80,
      rot: 220 + rand(i, 6) * 420,
      op: 0.5 + rand(i, 7) * 0.4,
      color: COLORS[i % COLORS.length],
    })))
  }, [])

  // Pause the drift when the hero isn't on screen.
  useEffect(() => {
    const el = layerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => {
      el.classList.toggle('petals-paused', !entry.isIntersecting)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Cursor spotlight — only where there is a precise pointer.
  useEffect(() => {
    const glow = glowRef.current
    const host = glow?.parentElement
    if (!glow || !host || !window.matchMedia('(pointer: fine)').matches) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = host.getBoundingClientRect()
        glow.style.setProperty('--mx', `${e.clientX - r.left}px`)
        glow.style.setProperty('--my', `${e.clientY - r.top}px`)
        glow.style.opacity = '1'
      })
    }
    const onLeave = () => { glow.style.opacity = '0' }
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <>
      <div ref={glowRef} aria-hidden="true" className="hero-spotlight absolute inset-0 z-[4] pointer-events-none" />
      <div ref={layerRef} aria-hidden="true" className="petals-layer absolute inset-0 z-[5] overflow-hidden pointer-events-none">
        {petals.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.35,
              ['--dur' as string]: `${p.dur}s`,
              ['--delay' as string]: `${p.delay}s`,
              ['--sway' as string]: `${p.sway}px`,
              ['--rot' as string]: `${p.rot}deg`,
              ['--op' as string]: p.op,
            }}
          >
            <svg viewBox="0 0 24 32" width="100%" height="100%">
              <path d="M12 0C20 9 24 17 12 32C0 17 4 9 12 0Z" fill={p.color} />
              <path d="M12 4C13 14 13 22 12 29" stroke="rgba(255,255,255,0.35)" strokeWidth="0.9" fill="none" />
            </svg>
          </span>
        ))}
      </div>
    </>
  )
}

'use client'

// Desktop-only: a faint trail of gold sparkles that follows the cursor. It is
// skipped entirely on touch devices and for anyone who prefers reduced motion,
// never intercepts pointer events, and is capped so it can't pile up.
import { useEffect } from 'react'

export default function CursorSparkles() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const layer = document.createElement('div')
    layer.setAttribute('aria-hidden', 'true')
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9990;overflow:hidden'
    document.body.appendChild(layer)

    let last = 0
    let live = 0
    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      if (now - last < 50 || live > 22) return
      last = now
      live++
      const el = document.createElement('span')
      const size = 4 + Math.random() * 5
      el.style.cssText = `position:absolute;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;border-radius:50%;background:#F3D9A4;box-shadow:0 0 8px 2px rgba(243,217,164,0.65)`
      const dx = (Math.random() - 0.5) * 30
      const dy = 12 + Math.random() * 26
      const anim = el.animate(
        [
          { transform: 'translate(-50%,-50%) scale(1)', opacity: 0.95 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 },
        ],
        { duration: 650 + Math.random() * 350, easing: 'ease-out' },
      )
      anim.onfinish = () => { el.remove(); live-- }
      layer.appendChild(el)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      layer.remove()
    }
  }, [])
  return null
}

'use client'

// Thin gold "thread" along the very top of the viewport that fills as the
// guest scrolls — a reading-progress cue in the site's thread/embroidery
// language. Pure transform (scaleX) on a spring, so it costs nothing.
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollThread() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[70] origin-left pointer-events-none"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #A17B3D 0%, #F3D9A4 55%, #ED237A 100%)',
        boxShadow: '0 0 10px rgba(243,217,164,0.75)',
      }}
    />
  )
}

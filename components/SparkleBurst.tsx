'use client'

// Shared radiating-sparkle flourish — originally built for EnvelopeIntro's
// "opening" moment, reused wherever else needs that same premium "pop".
import { motion } from 'framer-motion'

const EASE = [0.25, 0.1, 0.25, 1] as const

export default function SparkleBurst({ count = 10, distance = 110 }: { count?: number; distance?: number }) {
  const sparkles = Array.from({ length: count })
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {sparkles.map((_, i) => {
        const angle = (i / sparkles.length) * Math.PI * 2
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ width: 5, height: 5, background: '#F3D9A4', boxShadow: '0 0 8px 2px rgba(243,217,164,0.6)' }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: [0, 1, 0],
              scale: [0.4, 1, 0.6],
            }}
            transition={{ duration: 1, ease: EASE }}
          />
        )
      })}
    </div>
  )
}

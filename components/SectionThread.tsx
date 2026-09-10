'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * The "fine burgundy thread" that connects sections — drawn in with a real
 * stroke animation as it scrolls into view, rather than sitting static.
 * Pure SVG stroke-dashoffset (GPU-friendly, no layout impact either side).
 */
export default function SectionThread() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref} className="relative h-10 md:h-14 overflow-hidden" aria-hidden="true">
      <svg viewBox="0 0 1200 80" className="w-full h-full" preserveAspectRatio="none" fill="none">
        <motion.path
          d="M0 40C150 40 160 10 320 10S540 70 700 40 940 10 1050 40 1160 40 1200 40"
          stroke="#760D25"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.55 } : {}}
          transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.circle
          cx="320" cy="10" r="4" fill="#A17B3D"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 0.85 } : {}}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
        <motion.circle
          cx="940" cy="10" r="4" fill="#A17B3D"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 0.85 } : {}}
          transition={{ duration: 0.5, delay: 1.3 }}
        />
      </svg>
    </div>
  )
}

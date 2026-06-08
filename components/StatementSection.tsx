'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const EASE = [0.25, 0.1, 0.25, 1] as const

const rise = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, delay, ease: EASE } },
})

export default function StatementSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="bg-charcoal relative overflow-hidden">
      {/* Ghosted couple initials — editorial background element */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="font-serif italic leading-none text-white/[0.025]"
          style={{ fontSize: 'clamp(200px, 35vw, 480px)' }}
        >
          S&amp;S
        </span>
      </div>

      <motion.div
        className="relative px-7 md:px-14 py-20 md:py-32 max-w-4xl mx-auto text-center"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {/* Top label */}
        <motion.p
          variants={rise(0)}
          className="font-sans text-[9px] md:text-[10px] tracking-[0.55em] uppercase text-white/35 mb-8"
        >
          The Wedding Celebration of
        </motion.p>

        {/* Top rule */}
        <motion.div
          variants={rise(0.05)}
          className="w-14 h-px bg-white/15 mx-auto mb-10"
        />

        {/* Names — the declaration */}
        <motion.h2
          variants={rise(0.1)}
          className="font-serif text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[7rem] leading-none text-white mb-4 tracking-tight"
        >
          Sakshi
        </motion.h2>
        <motion.p
          variants={rise(0.18)}
          className="font-serif italic text-[1.2rem] md:text-[1.6rem] text-white/40 mb-4 tracking-widest"
        >
          &amp;
        </motion.p>
        <motion.h2
          variants={rise(0.26)}
          className="font-serif text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[7rem] leading-none text-white mb-14"
        >
          Dr. Sahil
        </motion.h2>

        {/* Divider rule */}
        <motion.div
          variants={rise(0.34)}
          className="w-14 h-px bg-white/15 mx-auto mb-12"
        />

        {/* Date + Location — the announcement */}
        <motion.div variants={rise(0.4)} className="space-y-3">
          <p className="font-sans text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-white/45">
            Wednesday &amp; Thursday
          </p>
          <p className="font-serif text-[2rem] md:text-[2.8rem] text-white leading-tight">
            20 &ndash; 21 January 2027
          </p>
          <p className="font-sans text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-white/50 pt-1">
            Delhi, India
          </p>
        </motion.div>

        {/* Bottom rule */}
        <motion.div
          variants={rise(0.48)}
          className="w-14 h-px bg-white/15 mx-auto mt-12"
        />
      </motion.div>
    </section>
  )
}

'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const EASE = [0.25, 0.1, 0.25, 1] as const

const rise = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, delay, ease: EASE } },
})

const events = [
  {
    date: '20 Jan',
    day: 'Wednesday',
    occasions: 'Check-in · Mehendi & Engagement Party',
  },
  {
    date: '21 Jan',
    day: 'Thursday',
    occasions: 'Haldi & Wedding Night',
  },
  {
    date: '22 Jan',
    day: 'Friday',
    occasions: 'Checkout',
  },
]

export default function StatementSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="bg-charcoal relative overflow-hidden">
      {/* Ghosted initials */}
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
        variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
      >
        {/* Label */}
        <motion.p
          variants={rise(0)}
          className="font-sans text-[9px] md:text-[10px] tracking-[0.55em] uppercase text-white/35 mb-8"
        >
          The Wedding Celebration of
        </motion.p>

        {/* Top rule */}
        <motion.div variants={rise(0.05)} className="w-14 h-px bg-white/15 mx-auto mb-10" />

        {/* Names */}
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

        {/* Rule */}
        <motion.div variants={rise(0.34)} className="w-14 h-px bg-white/15 mx-auto mb-12" />

        {/* Date + Venue */}
        <motion.div variants={rise(0.4)} className="space-y-3 mb-12">
          <p className="font-serif text-[2rem] md:text-[2.8rem] text-white leading-tight">
            20 &ndash; 21 January 2027
          </p>
          <p className="font-sans text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-white/50 pt-1">
            Pitampura, Delhi, India
          </p>
        </motion.div>

        {/* Rule before events */}
        <motion.div variants={rise(0.46)} className="w-14 h-px bg-white/10 mx-auto mb-10" />

        {/* Event schedule — subtle 3-day breakdown */}
        <motion.div
          variants={rise(0.52)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto"
        >
          {events.map((ev) => (
            <div key={ev.date} className="text-center">
              <p className="font-sans text-[8px] tracking-[0.45em] uppercase text-white/25 mb-1">
                {ev.day}
              </p>
              <p className="font-serif text-[1.1rem] text-white/80 mb-1.5">
                {ev.date}
              </p>
              <p className="font-sans text-[8px] tracking-[0.15em] text-white/40 leading-relaxed">
                {ev.occasions}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Bottom rule */}
        <motion.div variants={rise(0.6)} className="w-14 h-px bg-white/15 mx-auto mt-12" />
      </motion.div>
    </section>
  )
}

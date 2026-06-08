'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function TravelSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="bg-ivory">
      <div className="px-7 md:px-16 py-20 md:py-28 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          <div className="w-12 h-px bg-blush mb-10" />

          <h2 className="font-serif text-[1.85rem] md:text-[2.4rem] leading-[1.2] text-charcoal mb-8">
            Travel &amp; Hospitality
          </h2>

          <p className="font-sans font-light text-[0.95rem] leading-[1.85] text-stone mb-6">
            We will be arranging accommodation for our guests in Delhi during the wedding celebrations.
          </p>

          <p className="font-sans font-light text-[0.95rem] leading-[1.85] text-stone mb-6">
            As January is a busy travel season, we encourage you to begin planning your travel to
            and from Delhi at your convenience — whether by flight or train.
          </p>

          <p className="font-sans font-light text-[0.95rem] leading-[1.85] text-stone">
            Once you&apos;re here, we&apos;ll take care of the rest.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/contexts/Language'
import { AUDIENCE_CONFIG, type Audience } from '@/lib/audience'

const EASE = [0.25, 0.1, 0.25, 1] as const

// Shown on both /bride and /groom. On groom's page it's surfaced after the
// main travel confirmation, never trying to outrank "Confirm Travel
// Details" above it; on bride's page it follows the wardrobe CTA instead.
export default function LovelyLadiesSection({ audience }: { audience: Audience }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { t } = useLang()
  const makeupRoute = AUDIENCE_CONFIG[audience].makeupRoute

  return (
    <section id="lovely-ladies" ref={ref} className="bg-paper relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-7 md:px-14 py-14 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-center"
        >
          <div className="w-12 h-[2px] bg-gold mx-auto mb-6" />
          <h2 className="font-serif text-ink mb-2" style={{ fontSize: 'clamp(1.5rem, 3.6vw, 2rem)' }}>
            {t.lovelyLadiesHeading}
          </h2>
          <p className="font-sans text-stone mb-10" style={{ fontSize: '1rem' }}>
            {t.lovelyLadiesIntro}
          </p>

          <div className="grid sm:grid-cols-2 gap-5 text-left">
            <a href="#mehndi-rsvp"
              className="hover-lift group block rounded-2xl border-2 border-thread-border/60 hover:border-burgundy bg-blush/15 p-7 transition-colors duration-300">
              <p className="font-sans uppercase text-gold mb-3" style={{ fontSize: '0.72rem', letterSpacing: '0.18em' }}>
                {t.lovelyLadiesMehndiEyebrow}
              </p>
              <h3 className="font-serif text-ink mb-2" style={{ fontSize: '1.25rem' }}>
                {t.lovelyLadiesMehndiCardTitle}
              </h3>
              <p className="font-sans text-stone mb-4" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                {t.lovelyLadiesMehndiCardBody}
              </p>
              <span className="font-sans uppercase text-burgundy group-hover:text-[#5c0a1c] transition-colors" style={{ fontSize: '0.78rem', letterSpacing: '0.14em' }}>
                {t.lovelyLadiesMehndiCardCTA} &rarr;
              </span>
            </a>

            <Link href={makeupRoute}
              className="hover-lift group block rounded-2xl border-2 border-thread-border/60 hover:border-burgundy bg-champagne/20 p-7 transition-colors duration-300">
              <p className="font-sans uppercase text-gold mb-3" style={{ fontSize: '0.72rem', letterSpacing: '0.18em' }}>
                {t.lovelyLadiesMakeupEyebrow}
              </p>
              <h3 className="font-serif text-ink mb-2" style={{ fontSize: '1.25rem' }}>
                {t.lovelyLadiesMakeupCardTitle}
              </h3>
              <p className="font-sans text-stone mb-4" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                {t.lovelyLadiesMakeupCardBody}
              </p>
              <span className="font-sans uppercase text-burgundy group-hover:text-[#5c0a1c] transition-colors" style={{ fontSize: '0.78rem', letterSpacing: '0.14em' }}>
                {t.lovelyLadiesMakeupCardCTA} &rarr;
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

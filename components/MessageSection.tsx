'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLang } from '@/contexts/Language'

interface MessageSectionProps {
  onRSVPClick: () => void
}

const EASE = [0.25, 0.1, 0.25, 1] as const

export default function MessageSection({ onRSVPClick }: MessageSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { t } = useLang()

  return (
    <section ref={ref} className="bg-cream relative overflow-hidden">
      <div className="relative px-7 md:px-14 pt-12 pb-12 md:pt-16 md:pb-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="md:grid md:grid-cols-[1fr_1px_1fr] md:gap-12 lg:gap-16">

            {/* ── Left: Invitation ── */}
            <div>
              <div className="w-12 h-[2px] bg-marigold mb-7" />
              <h2 className="font-serif leading-[1.15] text-charcoal mb-4"
                style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.8rem)' }}>
                {t.inviteHeading}
              </h2>
              {/* Event dates — prominent */}
              <p className="font-serif italic mb-6"
                style={{ fontSize: 'clamp(1.1rem, 2.8vw, 1.45rem)', color: '#6E1A28' }}>
                {t.eventDates} &nbsp;·&nbsp; Pitampura, Delhi
              </p>
              <p className="font-sans leading-[1.9] text-stone mb-6"
                style={{ fontSize: '1.1rem' }}>
                {t.inviteBody1}
              </p>
              <p className="font-sans leading-[1.85] text-stone mb-7"
                style={{ fontSize: '1.1rem' }}>
                {t.inviteBody2}{' '}
                <span className="text-charcoal font-semibold">{t.deadline}</span>.
              </p>
              <button
                onClick={onRSVPClick}
                className="inline-block font-sans uppercase bg-marigold text-charcoal px-8 py-3.5 hover:bg-marigold-dark transition-colors duration-300"
                style={{ fontSize: '0.88rem', letterSpacing: '0.28em' }}
              >
                {t.confirmAttend}
              </button>
            </div>

            {/* Vertical divider */}
            <div className="hidden md:block bg-parchment" />

            {/* ── Right: Travel ── */}
            <div className="mt-10 md:mt-0">
              <div className="w-12 h-[2px] bg-marigold mb-7" />
              <h3 className="font-serif leading-[1.2] text-charcoal mb-5"
                style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)' }}>
                {t.travelHeading}
              </h3>

              {/* Step 1 */}
              <div className="mb-6">
                <p className="font-sans uppercase text-charcoal/60 mb-2"
                  style={{ fontSize: '0.95rem', letterSpacing: '0.15em' }}>
                  Step 1 — Getting to Delhi
                </p>
                <p className="font-sans leading-[1.9] text-stone"
                  style={{ fontSize: '1.1rem' }}>
                  {t.travelBody1}
                </p>
              </div>

              {/* Travel mode icons */}
              <div className="flex gap-3 mb-7">
                {[
                  { icon: '✈', label: t.byFlight },
                  { icon: '🚄', label: t.byTrain },
                  { icon: '🚗', label: t.byRoad },
                ].map(({ icon, label }) => (
                  <div key={label}
                    className="flex flex-col items-center gap-2 bg-marigold/10 border-b-2 border-marigold/50 rounded px-4 py-4 flex-1">
                    <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                    <span className="font-sans text-charcoal/70 text-center"
                      style={{ fontSize: '0.95rem' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 2 */}
              <div>
                <p className="font-sans uppercase text-charcoal/60 mb-2"
                  style={{ fontSize: '0.95rem', letterSpacing: '0.15em' }}>
                  Step 2 — Once you're in Delhi
                </p>
                <p className="font-sans leading-[1.9] text-stone"
                  style={{ fontSize: '1.1rem' }}>
                  {t.travelBody2}
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}

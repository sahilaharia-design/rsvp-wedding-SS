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
      <div className="relative px-7 md:px-14 pt-16 pb-16 md:pt-24 md:pb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="md:grid md:grid-cols-[1fr_1px_1fr] md:gap-14 lg:gap-20">

            {/* ── Left: Invitation ── */}
            <div>
              <div className="w-10 h-px bg-blush mb-9" />
              <h2 className="font-serif leading-[1.15] text-charcoal mb-7"
                style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.8rem)' }}>
                {t.inviteHeading}
              </h2>
              <p className="font-sans font-light leading-[1.95] text-stone mb-8"
                style={{ fontSize: '1.05rem' }}>
                This celebration is for the people who matter most to us.
                We would love to have you there — please let us know you are coming.
              </p>
              <p className="font-sans font-light leading-[1.9] text-stone mb-9"
                style={{ fontSize: '1.05rem' }}>
                {t.inviteBody2}{' '}
                <span className="text-charcoal font-medium">{t.deadline}</span>.
              </p>
              <button
                onClick={onRSVPClick}
                className="font-sans uppercase text-charcoal border-b border-charcoal pb-0.5 hover:text-warm-gray hover:border-warm-gray transition-colors duration-300"
                style={{ fontSize: '0.82rem', letterSpacing: '0.32em' }}
              >
                {t.confirmAttend}
              </button>
            </div>

            {/* Vertical divider */}
            <div className="hidden md:block bg-parchment" />

            {/* ── Right: Travel ── */}
            <div className="mt-14 md:mt-0">
              <div className="w-10 h-px bg-blush mb-9" />
              <h3 className="font-serif leading-[1.2] text-charcoal mb-7"
                style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)' }}>
                {t.travelHeading}
              </h3>

              {/* Step 1 */}
              <div className="mb-7">
                <p className="font-sans uppercase text-warm-gray mb-2"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.38em' }}>
                  Step 1 — Getting to Delhi
                </p>
                <p className="font-sans font-light leading-[1.95] text-stone"
                  style={{ fontSize: '1.05rem' }}>
                  {t.travelBody1}
                </p>
              </div>

              {/* Travel mode icons */}
              <div className="flex gap-4 mb-8">
                {[
                  { icon: '✈', label: t.byFlight },
                  { icon: '🚄', label: t.byTrain },
                  { icon: '🚗', label: t.byRoad },
                ].map(({ icon, label }) => (
                  <div key={label}
                    className="flex flex-col items-center gap-1.5 bg-parchment/60 rounded px-4 py-3 flex-1">
                    <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                    <span className="font-sans text-stone text-center"
                      style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 2 */}
              <div>
                <p className="font-sans uppercase text-warm-gray mb-2"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.38em' }}>
                  Step 2 — Once you're in Delhi
                </p>
                <p className="font-sans font-light leading-[1.95] text-stone"
                  style={{ fontSize: '1.05rem' }}>
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

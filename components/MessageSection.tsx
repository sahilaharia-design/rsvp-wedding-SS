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
      {/* Background year */}
      <div className="absolute right-[-2%] top-1/2 -translate-y-1/2 pointer-events-none select-none" aria-hidden>
        <span className="font-serif italic leading-none text-charcoal/[0.04]"
          style={{ fontSize: 'clamp(160px, 20vw, 320px)' }}>
          2027
        </span>
      </div>

      <div className="relative px-7 md:px-14 pt-14 pb-16 md:pt-20 md:pb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* Info bar */}
          <div className="border-t border-b border-parchment py-5 mb-14 grid grid-cols-2 md:grid-cols-4 gap-y-5">
            <div className="md:border-r border-parchment md:pr-8">
              <p className="font-sans uppercase text-warm-gray mb-1.5"
                style={{ fontSize: '0.7rem', letterSpacing: '0.45em' }}>
                Occasion
              </p>
              <p className="font-serif text-charcoal" style={{ fontSize: '1.1rem' }}>
                Wedding Celebration
              </p>
            </div>
            <div className="md:border-r border-parchment md:px-8">
              <p className="font-sans uppercase text-warm-gray mb-1.5"
                style={{ fontSize: '0.7rem', letterSpacing: '0.45em' }}>
                Dates
              </p>
              <p className="font-serif text-charcoal" style={{ fontSize: '1.1rem' }}>
                20 &ndash; 22 Jan 2027
              </p>
              <p className="font-sans text-warm-gray mt-0.5" style={{ fontSize: '0.75rem' }}>
                Wed &ndash; Fri
              </p>
            </div>
            <div className="md:border-r border-parchment md:px-8">
              <p className="font-sans uppercase text-warm-gray mb-1.5"
                style={{ fontSize: '0.7rem', letterSpacing: '0.45em' }}>
                Where
              </p>
              <p className="font-serif text-charcoal" style={{ fontSize: '1.1rem' }}>
                Pitampura, Delhi
              </p>
              <p className="font-sans text-warm-gray mt-0.5" style={{ fontSize: '0.75rem' }}>India</p>
            </div>
            <div className="md:pl-8">
              <p className="font-sans uppercase text-warm-gray mb-1.5"
                style={{ fontSize: '0.7rem', letterSpacing: '0.45em' }}>
                RSVP By
              </p>
              <p className="font-serif text-charcoal" style={{ fontSize: '1.1rem' }}>18 June 2026</p>
            </div>
          </div>

          {/* Two-column body */}
          <div className="md:grid md:grid-cols-[1fr_1px_1fr] md:gap-12 lg:gap-16">
            {/* Left — invite copy */}
            <div>
              <div className="w-10 h-px bg-blush mb-8" />
              <h2 className="font-serif leading-[1.18] text-charcoal mb-7"
                style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' }}>
                {t.inviteHeading}
              </h2>
              <p className="font-sans font-light leading-[1.9] text-stone mb-5"
                style={{ fontSize: '1.05rem' }}>
                {t.inviteBody1}
              </p>
              {/* Event quick-ref */}
              <div className="border-l-2 border-blush/40 pl-4 mb-7 space-y-2">
                {[
                  { d: '20 Jan', e: 'Check-in · Mehendi · Engagement' },
                  { d: '21 Jan', e: 'Haldi · Wedding Night' },
                  { d: '22 Jan', e: 'Checkout' },
                ].map(({ d, e }) => (
                  <div key={d} className="flex gap-3 items-baseline">
                    <span className="font-serif text-charcoal/60 shrink-0" style={{ fontSize: '0.95rem', width: 56 }}>{d}</span>
                    <span className="font-sans text-stone" style={{ fontSize: '0.9rem' }}>{e}</span>
                  </div>
                ))}
              </div>
              <p className="font-sans font-light leading-[1.9] text-stone mb-9"
                style={{ fontSize: '1.05rem' }}>
                {t.inviteBody2}{' '}
                <span className="text-charcoal font-normal">{t.deadline}</span>.
              </p>
              <button
                onClick={onRSVPClick}
                className="font-sans uppercase text-charcoal border-b border-charcoal pb-0.5 hover:text-warm-gray hover:border-warm-gray transition-colors duration-300"
                style={{ fontSize: '0.8rem', letterSpacing: '0.3em' }}
              >
                {t.confirmAttend}
              </button>
            </div>

            {/* Vertical divider */}
            <div className="hidden md:block bg-parchment" />

            {/* Right — travel — CLEAR MESSAGE */}
            <div className="mt-12 md:mt-0">
              <div className="w-10 h-px bg-blush mb-8" />
              <h3 className="font-serif leading-[1.2] text-charcoal mb-6"
                style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.75rem)' }}>
                {t.travelHeading}
              </h3>

              {/* Step 1 */}
              <div className="mb-6">
                <p className="font-sans uppercase text-warm-gray mb-2"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.35em' }}>
                  Step 1 — Your journey to Delhi
                </p>
                <p className="font-sans font-light leading-[1.9] text-stone"
                  style={{ fontSize: '1.05rem' }}>
                  {t.travelBody1}
                </p>
              </div>

              {/* Travel modes */}
              <div className="flex gap-5 mb-7">
                {[
                  { icon: '✈', label: t.byFlight },
                  { icon: '🚄', label: t.byTrain },
                  { icon: '🚗', label: t.byRoad },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 bg-parchment/60 rounded px-4 py-3">
                    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                    <span className="font-sans text-stone" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 2 */}
              <div className="mb-5">
                <p className="font-sans uppercase text-warm-gray mb-2"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.35em' }}>
                  Step 2 — Once you're in Delhi
                </p>
                <p className="font-sans font-light leading-[1.9] text-stone"
                  style={{ fontSize: '1.05rem' }}>
                  {t.travelBody2}
                </p>
              </div>

              <p className="font-sans uppercase text-warm-gray"
                style={{ fontSize: '0.72rem', letterSpacing: '0.3em' }}>
                {t.travelFootnote}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

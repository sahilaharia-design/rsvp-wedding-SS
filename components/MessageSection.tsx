'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface MessageSectionProps {
  onRSVPClick: () => void
}

const EASE = [0.25, 0.1, 0.25, 1] as const

export default function MessageSection({ onRSVPClick }: MessageSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="bg-cream relative overflow-hidden">
      {/* Background year */}
      <div
        className="absolute right-[-2%] top-1/2 -translate-y-1/2 pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="font-serif italic leading-none text-charcoal/[0.04]"
          style={{ fontSize: 'clamp(160px, 20vw, 320px)' }}
        >
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
          <div className="border-t border-b border-parchment py-5 mb-14 grid grid-cols-2 md:grid-cols-3 gap-y-5">
            <div className="md:border-r border-parchment md:pr-10">
              <p className="font-sans text-[8px] tracking-[0.45em] uppercase text-warm-gray mb-1.5">
                The Occasion
              </p>
              <p className="font-serif text-[1.05rem] text-charcoal">Wedding Celebration</p>
            </div>
            <div className="md:border-r border-parchment md:px-10">
              <p className="font-sans text-[8px] tracking-[0.45em] uppercase text-warm-gray mb-1.5">
                When
              </p>
              <p className="font-serif text-[1.05rem] text-charcoal">20 &ndash; 21 January 2027</p>
              <p className="font-sans text-[11px] text-warm-gray mt-0.5">Wednesday &amp; Thursday</p>
            </div>
            <div className="col-span-2 md:col-span-1 border-t border-parchment pt-5 md:border-0 md:pt-0 md:pl-10">
              <p className="font-sans text-[8px] tracking-[0.45em] uppercase text-warm-gray mb-1.5">
                Where
              </p>
              <p className="font-serif text-[1.05rem] text-charcoal">Pitampura, Delhi, India</p>
            </div>
          </div>

          {/* Two-column body */}
          <div className="md:grid md:grid-cols-[1fr_1px_1fr] md:gap-12 lg:gap-16">
            {/* Left — invitation copy */}
            <div>
              <div className="w-10 h-px bg-blush mb-8" />
              <h2 className="font-serif text-[1.85rem] md:text-[2.35rem] leading-[1.18] text-charcoal mb-7">
                You Are Invited to
                <br />
                Celebrate With Us
              </h2>
              <p className="font-sans font-light text-[0.9rem] leading-[1.9] text-stone mb-5">
                Sakshi and Dr. Sahil will be celebrating their wedding in Pitampura,
                Delhi across two extraordinary days — 20th and 21st January 2027.
              </p>
              <p className="font-sans font-light text-[0.9rem] leading-[1.9] text-stone mb-9">
                We are making arrangements for our guests and want to ensure every detail
                is taken care of. Please confirm your presence by{' '}
                <span className="text-charcoal font-normal">18 June 2026</span>.
              </p>
              <button
                onClick={onRSVPClick}
                className="font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal border-b border-charcoal pb-0.5 hover:text-warm-gray hover:border-warm-gray transition-colors duration-300"
              >
                Confirm Attendance →
              </button>
            </div>

            {/* Vertical divider */}
            <div className="hidden md:block bg-parchment" />

            {/* Right — travel */}
            <div className="mt-12 md:mt-0">
              <div className="w-10 h-px bg-blush mb-8" />
              <h3 className="font-serif text-[1.4rem] md:text-[1.65rem] leading-[1.2] text-charcoal mb-6">
                Planning Your Travel
              </h3>
              <p className="font-sans font-light text-[0.9rem] leading-[1.9] text-stone mb-4">
                We will be hosting our guests at the venue in Pitampura, Delhi — and we&apos;re
                looking forward to taking care of you once you arrive.
              </p>
              <p className="font-sans font-light text-[0.9rem] leading-[1.9] text-stone mb-4">
                If you&apos;re joining us from outside Delhi, January is a peak travel
                period across India. Flights, trains, and hotels book up well in advance —
                we&apos;d gently encourage you to plan and book your travel early so you
                can arrive without any last-minute stress.
              </p>
              <p className="font-sans font-light text-[0.9rem] leading-[1.9] text-stone mb-5">
                Check-in is on the 20th. The celebrations wrap up on the 22nd, which
                gives you a comfortable window to plan your journey back.
              </p>
              <p className="font-sans text-[8px] tracking-[0.3em] uppercase text-warm-gray">
                Once you&apos;re here, we&apos;ll take care of the rest.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

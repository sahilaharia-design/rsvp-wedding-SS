'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/contexts/Language'

const EASE = [0.25, 0.1, 0.25, 1] as const

export default function TravelGuidance() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [artError, setArtError] = useState(false)
  const { t } = useLang()

  return (
    <section ref={ref} className="bg-cream relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-7 md:px-14 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          className="md:grid md:grid-cols-[1fr_0.85fr] md:gap-14 items-center"
        >
          {/* ── Text ── */}
          <div>
            <div className="w-12 h-[2px] bg-gold mb-7" />
            <h3 className="font-serif leading-[1.2] text-ink mb-5"
              style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)' }}>
              {t.travelHeading}
            </h3>

            <div className="mb-6">
              <p className="font-sans uppercase text-stone mb-2"
                style={{ fontSize: '0.85rem', letterSpacing: '0.15em' }}>
                Step 1 — Getting to Delhi
              </p>
              <p className="font-sans leading-[1.85] text-stone" style={{ fontSize: '1.05rem' }}>
                {t.travelBody1}
              </p>
            </div>

            {/* Travel mode icons */}
            <div className="flex gap-3 mb-7">
              {[
                { icon: '/graphics/plane.svg', label: t.byFlight },
                { icon: '/graphics/rail.svg', label: t.byTrain },
                { icon: '/graphics/road.svg', label: t.byRoad },
              ].map(({ icon, label }) => (
                <div key={label}
                  className="flex flex-col items-center gap-2 bg-blush/20 border-b-2 border-gold/50 rounded px-4 py-4 flex-1">
                  <Image src={icon} alt="" width={26} height={26} aria-hidden="true" />
                  <span className="font-sans text-ink/75 text-center" style={{ fontSize: '0.92rem' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <p className="font-sans uppercase text-stone mb-2"
                style={{ fontSize: '0.85rem', letterSpacing: '0.15em' }}>
                Step 2 — Once you&rsquo;re in Delhi
              </p>
              <p className="font-sans leading-[1.85] text-stone" style={{ fontSize: '1.05rem' }}>
                {t.travelBody2}
              </p>
            </div>
          </div>

          {/* ── Decorative art (symbolic, not the booked property) ── */}
          <div className="hidden md:block relative aspect-[4/5] rounded-2xl overflow-hidden mt-10 md:mt-0"
            style={{ border: '2px solid var(--thread-border, #D8C6AD)' }}>
            {!artError ? (
              <Image
                src="/artwork/travel-delhi-welcome.jpg"
                alt="Illustrated, symbolic welcome-to-Delhi artwork"
                fill sizes="480px"
                className="object-cover"
                onError={() => setArtError(true)}
              />
            ) : (
              <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #DDC8A5, #E8BEA0)' }} />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

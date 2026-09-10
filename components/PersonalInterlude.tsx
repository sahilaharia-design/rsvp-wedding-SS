'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/contexts/Language'

const EASE = [0.25, 0.1, 0.25, 1] as const

export default function PersonalInterlude() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [imgError, setImgError] = useState(false)
  const { t } = useLang()

  return (
    <section ref={ref} className="bg-cream">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE }}
        className="max-w-3xl mx-auto px-7 md:px-14 py-12 md:py-16 flex flex-col items-center text-center"
      >
        <div
          className="relative w-full max-w-[420px] aspect-[2/3] rounded-2xl overflow-hidden mb-7"
          style={{ border: '3px solid var(--thread-border, #D8C6AD)', boxShadow: '0 16px 40px rgba(48,54,50,0.14)' }}
        >
          {!imgError ? (
            <div className="absolute inset-0 ken-burns">
              <Image
                src="/photos/couple-roka.jpg"
                alt="Sakshi and Dr. Sahil seated together at their Roka ceremony"
                fill
                sizes="(max-width: 480px) 100vw, 420px"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #E8C5BE, #E8BEA0)' }} />
          )}
        </div>
        <p className="font-serif italic text-ink" style={{ fontSize: 'clamp(1.15rem, 2.8vw, 1.5rem)' }}>
          {t.interludeText}
        </p>
      </motion.div>
    </section>
  )
}

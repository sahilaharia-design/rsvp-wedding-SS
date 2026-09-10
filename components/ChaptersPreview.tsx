'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/contexts/Language'

const EASE = [0.25, 0.1, 0.25, 1] as const

export default function ChaptersPreview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [imgError, setImgError] = useState(false)
  const { t } = useLang()

  return (
    <section ref={ref} className="bg-paper">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE }}
        className="max-w-6xl mx-auto px-6 md:px-14 py-14 md:py-20"
      >
        <div className="text-center mb-8">
          <h2 className="font-serif text-ink mb-3" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>
            {t.chaptersPreviewHeading}
          </h2>
          <p className="font-sans text-stone" style={{ fontSize: '1.05rem' }}>
            {t.chaptersPreviewBody}
          </p>
        </div>

        <Link href="/themes" className="hover-lift group block relative rounded-xl overflow-hidden aspect-[3/1] md:aspect-[3.1/1]"
          style={{ border: '2px solid var(--thread-border, #D8C6AD)' }}>
          {!imgError ? (
            <Image
              src="/artwork/homepage-chapters-panorama.jpg"
              alt="Illustrated panorama of the four wedding celebrations — Bloom, Promise, Romance, Legacy"
              fill
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, #E8BEA0, #E8C5BE, #919B80, #DDC8A5)' }} />
          )}
          <div className="absolute inset-0 flex items-end justify-center pb-4 md:pb-6 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(48,54,50,0.55), transparent 45%)' }}>
            <span className="font-sans uppercase text-paper-light px-6 py-2.5 border border-paper-light/70 rounded-sm bg-black/10 backdrop-blur-[1px]"
              style={{ fontSize: '0.78rem', letterSpacing: '0.24em' }}>
              {t.chaptersPreviewLink}
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}

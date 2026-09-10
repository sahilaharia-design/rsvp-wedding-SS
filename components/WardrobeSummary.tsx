'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PALETTE_HEX } from '@/lib/palette'
import { useLang, themesStrings } from '@/contexts/Language'
import type { ThemesChapterData } from '@/components/ThemesChapter'

const EASE = [0.25, 0.1, 0.25, 1] as const

interface WardrobeSummaryProps {
  chapters: ThemesChapterData[]
  /** Prepended to each card's `#chapter-id` anchor — pass "/themes" when
      this is embedded on a page (like the homepage) that doesn't itself
      have those chapter sections, so the link actually goes somewhere. */
  linkPrefix?: string
  /** Suppress the built-in heading/intro when the caller supplies its own. */
  hideHeading?: boolean
}

export default function WardrobeSummary({ chapters, linkPrefix = '', hideHeading = false }: WardrobeSummaryProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { lang } = useLang()
  const tt = themesStrings[lang]

  return (
    <section id="what-to-wear" ref={ref} className="scroll-mt-20 bg-ivory border-y border-thread-border/60">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
        className="max-w-5xl mx-auto px-6 md:px-14 py-14 md:py-16"
      >
        {!hideHeading && (
          <div className="text-center mb-10">
            <h2 className="font-serif text-ink mb-3" style={{ fontSize: 'clamp(1.6rem, 3.8vw, 2.2rem)' }}>
              {tt.wearHeading}
            </h2>
            <p className="font-sans text-stone" style={{ fontSize: '1rem' }}>
              {tt.wearIntro}
            </p>
          </div>
        )}

        {/* Pure-text summary — useful even with every image failed to load */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {chapters.map((c) => (
            <a key={c.id} href={`${linkPrefix}#${c.id}`}
              className="hover-lift block bg-white/70 rounded-xl p-5 border border-thread-border/50 hover:border-gold transition-colors">
              <p className="font-sans uppercase text-gold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.18em' }}>
                {c.event}
              </p>
              <p className="font-sans text-stone mb-3" style={{ fontSize: '0.85rem' }}>
                {tt.dowShort[c.date] ?? c.date} &middot; {tt.timeOfDay[c.timeOfDay] ?? c.timeOfDay}
              </p>
              <p className="font-serif text-ink mb-3" style={{ fontSize: '1.15rem' }}>
                {c.dressCode ?? [c.men, c.womenSourceVerbatim].filter(Boolean).join(' / ')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {c.palette.map((name) => (
                  <span key={name} className="w-4 h-4 rounded-full inline-block border border-black/10"
                    style={{ background: PALETTE_HEX[name] ?? '#ccc' }} title={name} />
                ))}
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

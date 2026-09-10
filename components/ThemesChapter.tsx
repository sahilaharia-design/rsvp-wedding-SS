'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { PALETTE_HEX } from '@/lib/palette'
import { useLang, themesStrings } from '@/contexts/Language'

const EASE = [0.25, 0.1, 0.25, 1] as const

export interface ThemesChapterData {
  id: string
  number: number
  date: string
  timeOfDay: string
  art: string
  palette: string[]
  event: string
  story: string
  shortLine: string
  dressCode?: string
  men?: string
  womenSourceVerbatim?: string
  paletteSourceVerbatim?: string
  fabricNote?: string
  outfitExamples?: string[]
  note?: string
}

export default function ThemesChapter({
  chapter, reverse,
}: { chapter: ThemesChapterData; reverse: boolean }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [imgError, setImgError] = useState(false)
  const { lang } = useLang()
  const tt = themesStrings[lang]

  return (
    <section id={chapter.id} ref={ref} className="scroll-mt-20 bg-cream odd:bg-paper">
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.9, ease: EASE }}
        className={`max-w-6xl mx-auto px-6 md:px-14 py-14 md:py-20 md:grid md:grid-cols-2 md:gap-14 items-center ${reverse ? 'md:[direction:rtl]' : ''}`}
      >
        {/* Art */}
        <div className="relative aspect-[3/2] rounded-2xl overflow-hidden mb-8 md:mb-0"
          style={{ direction: 'ltr', border: '2px solid var(--thread-border, #D8C6AD)', boxShadow: '0 16px 40px rgba(48,54,50,0.12)' }}>
          {!imgError ? (
            <div className="absolute inset-0 ken-burns">
              <Image
                src={`/artwork/${chapter.art}`}
                alt={`${chapter.event} — illustrated, symbolic artwork for the ${chapter.event} celebration`}
                fill sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${PALETTE_HEX[chapter.palette[0]] ?? '#E8C5BE'}, ${PALETTE_HEX[chapter.palette[chapter.palette.length - 1]] ?? '#DDC8A5'})` }} />
          )}
        </div>

        {/* Text */}
        <div style={{ direction: 'ltr' }}>
          <p className="font-sans uppercase text-gold mb-2" style={{ fontSize: '0.8rem', letterSpacing: '0.28em' }}>
            {tt.chapterLabel} {chapter.number} &middot; {chapter.event}
          </p>
          <h3 className="font-serif text-ink mb-2" style={{ fontSize: 'clamp(1.8rem, 4.2vw, 2.6rem)' }}>
            {chapter.shortLine}
          </h3>
          <p className="font-sans text-stone mb-5" style={{ fontSize: '0.95rem', letterSpacing: '0.04em' }}>
            {tt.dow[chapter.date] ?? chapter.date} &middot; {tt.timeOfDay[chapter.timeOfDay] ?? chapter.timeOfDay}
          </p>
          <p className="font-serif italic leading-[1.7] text-ink/90 mb-7" style={{ fontSize: '1.15rem' }}>
            {chapter.story}
          </p>

          {/* What to wear — visible without hover, useful even if the image above fails */}
          <div id={`${chapter.id}-wear`} className="hover-lift bg-ivory/70 rounded-xl p-6 border border-thread-border/50">
            <p className="font-sans uppercase text-ink/60 mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.2em' }}>
              {tt.whatToWearEyebrow}
            </p>

            {chapter.dressCode && (
              <p className="font-sans text-ink mb-3" style={{ fontSize: '1.05rem' }}>
                <span className="font-semibold">{tt.dressCode}:</span> {chapter.dressCode}
                {chapter.fabricNote && <span className="text-stone"> &nbsp;&middot;&nbsp; {chapter.fabricNote}</span>}
              </p>
            )}

            {chapter.men && (
              <p className="font-sans text-ink mb-1" style={{ fontSize: '1rem' }}>
                <span className="font-semibold">{tt.men}:</span> {chapter.men}
              </p>
            )}
            {chapter.womenSourceVerbatim && (
              <p className="font-sans text-ink mb-3" style={{ fontSize: '1rem' }}>
                <span className="font-semibold">{tt.women}:</span> {chapter.womenSourceVerbatim}
              </p>
            )}

            {chapter.outfitExamples && chapter.outfitExamples.length > 0 && (
              <ul className="font-sans text-stone list-disc pl-5 space-y-1 mb-4" style={{ fontSize: '0.98rem' }}>
                {chapter.outfitExamples.map((ex) => <li key={ex}>{ex}</li>)}
              </ul>
            )}

            {/* Palette — decorative, named explicitly so it's never mistaken for a dress-code instruction */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-sans uppercase text-ink/50 mr-1" style={{ fontSize: '0.72rem', letterSpacing: '0.16em' }}>{tt.palette}:</span>
              {chapter.palette.map((name) => (
                <span key={name} className="inline-flex items-center gap-1.5 bg-white/60 rounded-full pl-1 pr-2.5 py-1">
                  <span className="w-3.5 h-3.5 rounded-full inline-block border border-black/10"
                    style={{ background: PALETTE_HEX[name] ?? '#ccc' }} />
                  <span className="font-sans text-ink/70" style={{ fontSize: '0.8rem' }}>{name}</span>
                </span>
              ))}
            </div>
            <p className="font-sans text-stone/70 mt-2" style={{ fontSize: '0.82rem' }}>
              {tt.paletteDisclaimer}
            </p>
            {/* Note: chapter.note (the Promise neon-vs-jewel-tones ambiguity) is
                intentionally not rendered here — it's an internal/organiser
                flag, not something guests should see as an on-page caveat.
                See the delivery notes for the full explanation. */}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

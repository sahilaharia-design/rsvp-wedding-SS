'use client'

// Page content lives here (client component, for hooks/interactivity);
// app/bride/themes/page.tsx and app/groom/themes/page.tsx are thin server
// wrappers that supply route metadata and the `audience` prop.
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useLang, themesStrings } from '@/contexts/Language'
import ThemesChapter from '@/components/ThemesChapter'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import BottomTabBar from '@/components/BottomTabBar'
import { useThemeChapters } from '@/lib/useThemeChapters'
import { AUDIENCE_CONFIG, type Audience } from '@/lib/audience'

export default function ThemesPageClient({ audience }: { audience: Audience }) {
  const { t, lang } = useLang()
  const tt = themesStrings[lang]
  const [heroImgError, setHeroImgError] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 })
  const chapters = useThemeChapters()
  const isBride = audience === 'bride'
  const homeRoute = AUDIENCE_CONFIG[audience].route

  return (
    <>
    <main className="bg-paper pb-16">
      {/* ── Reading-progress thread ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left"
        style={{ scaleX: progress, background: 'linear-gradient(90deg, #A17B3D, #760D25)' }}
      />

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-thread-border/60">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link href={homeRoute} className="font-display text-burgundy" style={{ fontSize: '1.4rem' }}>
            S&nbsp;&amp;&nbsp;S
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-sans uppercase text-ink/70"
            style={{ fontSize: '0.75rem', letterSpacing: '0.14em' }}>
            <Link href={homeRoute} className="hover:text-burgundy transition-colors">{t.navHome}</Link>
            {chapters.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="hover:text-burgundy transition-colors hidden sm:inline">
                {c.event}
              </a>
            ))}
            <a href="#what-to-wear" className="hover:text-burgundy transition-colors">{t.whatToWearShort}</a>
            <Link href={`${homeRoute}#mehndi-rsvp`} className="hover:text-burgundy transition-colors">
              {t.navMehndiRSVP}
            </Link>
            <Link href={AUDIENCE_CONFIG[audience].makeupRoute} className="hover:text-burgundy transition-colors">
              {t.navMakeup}
            </Link>
            {!isBride && (
              <Link href="/groom#travel-details" className="text-burgundy font-semibold hover:text-ink transition-colors">
                {t.navTravel}
              </Link>
            )}
          </div>
          <LanguageSwitcher variant="light" />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          {!heroImgError ? (
            <div className="absolute inset-0 ken-burns">
              <Image
                src="/artwork/journey-hero.jpg"
                alt="Illustrated artwork: a solo journey through the hills becoming a shared path"
                fill priority
                sizes="100vw"
                className="object-cover"
                onError={() => setHeroImgError(true)}
              />
            </div>
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #E8BEA0, #E8C5BE, #919B80)' }} />
          )}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(48,54,50,0.75) 0%, rgba(48,54,50,0.15) 45%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-14 pb-8 md:pb-12">
            <h1 className="font-serif text-paper-light leading-[1.15] mb-3 max-w-3xl"
              style={{ fontSize: 'clamp(1.7rem, 5vw, 3rem)' }}>
              {tt.heading}
            </h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 md:px-14 py-10 md:py-12 text-center">
          <p className="font-serif italic leading-[1.75] text-ink mb-6" style={{ fontSize: 'clamp(1.1rem, 2.6vw, 1.35rem)' }}>
            {tt.intro}
          </p>
          <p className="font-sans uppercase text-stone mb-1" style={{ fontSize: '0.85rem', letterSpacing: '0.16em' }}>
            {tt.datesLine}
          </p>
          <p className="font-sans text-stone/80" style={{ fontSize: '0.85rem' }}>
            {tt.checkoutNote}
          </p>
        </div>
      </section>

      {/* ── Chapters ── */}
      {chapters.map((c, i) => (
        <ThemesChapter key={c.id} chapter={c} reverse={i % 2 === 1} />
      ))}

      {/* ── Closing line ── */}
      <div className="text-center px-6 py-10">
        <p className="font-serif italic text-ink" style={{ fontSize: 'clamp(1.1rem, 2.6vw, 1.4rem)' }}>
          {tt.closing}
        </p>
      </div>

      {/* ── Bottom CTA — audience-specific: groom returns to travel, bride downloads the guide ── */}
      <section className="bg-cream">
        <div className="max-w-2xl mx-auto px-6 md:px-14 py-14 md:py-16 text-center">
          {isBride ? (
            <>
              <h2 className="font-serif text-ink mb-4" style={{ fontSize: 'clamp(1.5rem, 3.6vw, 2rem)' }}>
                {t.bridePdfHeading}
              </h2>
              <a href={AUDIENCE_CONFIG.bride.pdfPath} target="_blank" rel="noopener noreferrer"
                className="shimmer-btn inline-block px-9 py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm"
                style={{ fontSize: '0.82rem', letterSpacing: '0.28em' }}>
                {t.brideSecondaryCTA}
              </a>
            </>
          ) : (
            <>
              <h2 className="font-serif text-ink mb-4" style={{ fontSize: 'clamp(1.5rem, 3.6vw, 2rem)' }}>
                {t.travelBackHeading}
              </h2>
              <p className="font-sans text-stone mb-7" style={{ fontSize: '1.05rem' }}>
                {t.groomDeadlineLine}
              </p>
              <Link href="/groom#travel-details"
                className="shimmer-btn inline-block px-9 py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm">
                {t.groomPrimaryCTA}
              </Link>
              <div className="mt-5">
                <a href={AUDIENCE_CONFIG.groom.pdfPath} target="_blank" rel="noopener noreferrer"
                  className="font-sans text-burgundy underline decoration-gold/60 underline-offset-4 hover:text-ink transition-colors"
                  style={{ fontSize: '0.92rem' }}>
                  {t.groomDownloadLabel}
                </a>
              </div>
            </>
          )}
          <div className="mt-6">
            <Link href={homeRoute} className="font-sans text-burgundy underline decoration-gold/60 underline-offset-4 hover:text-ink transition-colors"
              style={{ fontSize: '0.92rem' }}>
              &larr; {t.navHome}
            </Link>
          </div>
        </div>
      </section>
    </main>
    <BottomTabBar audience={audience} />
    </>
  )
}

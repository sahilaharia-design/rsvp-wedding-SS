'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import Hero from '@/components/Hero'
import TravelReminder from '@/components/TravelReminder'
import ChaptersPreview from '@/components/ChaptersPreview'
import PersonalInterlude from '@/components/PersonalInterlude'
import TravelGuidance from '@/components/TravelGuidance'
import TravelDetailsSection from '@/components/TravelDetailsSection'
import WardrobeSummary from '@/components/WardrobeSummary'
import StickyCTA from '@/components/StickyCTA'
import Reveal from '@/components/Reveal'
import SiteHeader from '@/components/SiteHeader'
import SectionThread from '@/components/SectionThread'
import { useLang } from '@/contexts/Language'
import { useGuestSide } from '@/contexts/GuestSide'
import { useThemeChapters } from '@/lib/useThemeChapters'

function Footer() {
  const { t } = useLang()
  return (
    <footer className="px-7 md:px-14 py-12 border-t border-thread-border/60 text-center bg-paper">
      <p className="font-display gold-glint text-burgundy leading-none mb-4 break-words"
        style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)' }}>
        #SakshiKoMilaKinara
      </p>
      <p className="font-sans text-stone mb-5" style={{ fontSize: '0.95rem', letterSpacing: '0.06em' }}>
        {t.eventDates} &middot; Pitampura, Delhi
      </p>
      <Link href="/themes"
        className="inline-block font-sans text-burgundy underline decoration-gold/60 underline-offset-4 hover:text-ink transition-colors"
        style={{ fontSize: '0.95rem' }}>
        {t.footerThemesLink} &rarr;
      </Link>
    </footer>
  )
}

function WardrobeTeaser() {
  const { t } = useLang()
  const chapters = useThemeChapters()
  return (
    <section id="wardrobe" className="scroll-mt-20">
      <WardrobeSummary chapters={chapters} linkPrefix="/themes" />
      <div className="bg-cream text-center py-10">
        <Link href="/themes"
          className="shimmer-btn inline-block px-8 py-3.5 border-2 border-burgundy text-burgundy font-sans uppercase hover:bg-burgundy hover:text-paper-light transition-colors duration-300 rounded-sm"
          style={{ fontSize: '0.8rem', letterSpacing: '0.24em' }}>
          {t.wardrobeTeaserLink}
        </Link>
      </div>
    </section>
  )
}

export default function Home() {
  const { side } = useGuestSide()
  const isBride = side === 'bride'

  const scrollToTravelDetails = useCallback(() => {
    document.getElementById('travel-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <Reveal />
      <SiteHeader />

      <main>
        <Hero onCTAClick={scrollToTravelDetails} side={side} />

        {isBride ? (
          <>
            <SectionThread />
            <ChaptersPreview />
            <SectionThread />
            <PersonalInterlude />
            <SectionThread />
            <WardrobeTeaser />
          </>
        ) : (
          <>
            <SectionThread />
            <TravelReminder onCTAClick={scrollToTravelDetails} />
            <SectionThread />
            <ChaptersPreview />
            <SectionThread />
            <PersonalInterlude />
            <SectionThread />
            <TravelGuidance />
            <SectionThread />
            <TravelDetailsSection />
          </>
        )}

        <Footer />
        <StickyCTA onCTAClick={scrollToTravelDetails} side={side} />
      </main>
    </>
  )
}

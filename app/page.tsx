'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import Hero from '@/components/Hero'
import TravelReminder from '@/components/TravelReminder'
import ChaptersPreview from '@/components/ChaptersPreview'
import PersonalInterlude from '@/components/PersonalInterlude'
import TravelGuidance from '@/components/TravelGuidance'
import TravelDetailsSection from '@/components/TravelDetailsSection'
import StickyCTA from '@/components/StickyCTA'
import GrandReveal from '@/components/GrandReveal'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import MusicToggle from '@/components/MusicToggle'
import { useLang } from '@/contexts/Language'

function Footer() {
  const { t } = useLang()
  return (
    <footer className="px-7 md:px-14 py-12 border-t border-thread-border/60 text-center bg-paper">
      <p className="font-display text-burgundy leading-none mb-4 break-words"
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

export default function Home() {
  const scrollToTravelDetails = useCallback(() => {
    document.getElementById('travel-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <GrandReveal />
      <div className="fixed top-4 right-4 md:top-5 md:right-5 z-[90] flex items-center gap-2">
        <MusicToggle />
        <LanguageSwitcher />
      </div>
      <main>
        <Hero onCTAClick={scrollToTravelDetails} />
        <TravelReminder onCTAClick={scrollToTravelDetails} />
        <ChaptersPreview />
        <PersonalInterlude />
        <TravelGuidance />
        <TravelDetailsSection />
        <Footer />
        <StickyCTA onCTAClick={scrollToTravelDetails} />
      </main>
    </>
  )
}

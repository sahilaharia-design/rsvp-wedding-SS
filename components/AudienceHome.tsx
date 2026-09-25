'use client'

// Shared homepage layout for both /bride and /groom — one component system,
// configured by audience, rather than two independently maintained sites.
import { useCallback } from 'react'
import Link from 'next/link'
import Hero from '@/components/Hero'
import TravelReminder from '@/components/TravelReminder'
import ChaptersPreview from '@/components/ChaptersPreview'
import PersonalInterlude from '@/components/PersonalInterlude'
import TravelGuidance from '@/components/TravelGuidance'
import TravelDetailsSection from '@/components/TravelDetailsSection'
import LadiesPopupTeaser from '@/components/LadiesPopupTeaser'
import LovelyLadiesTeaser from '@/components/LovelyLadiesTeaser'
import LadiesSignpost from '@/components/LadiesSignpost'
import LovelyLadiesSection from '@/components/LovelyLadiesSection'
import MehndiRSVPSection from '@/components/MehndiRSVPSection'
import StickyCTA from '@/components/StickyCTA'
import SiteHeader from '@/components/SiteHeader'
import SectionThread from '@/components/SectionThread'
import { useLang } from '@/contexts/Language'
import { AUDIENCE_CONFIG, OTHER_AUDIENCE, type Audience } from '@/lib/audience'

function Footer({ audience, onCTAClick }: { audience: Audience; onCTAClick?: () => void }) {
  const { t } = useLang()
  const isBride = audience === 'bride'
  const config = AUDIENCE_CONFIG[audience]
  const other = OTHER_AUDIENCE[audience]

  return (
    <footer className="px-7 md:px-14 py-12 border-t border-thread-border/60 text-center bg-paper">
      {!isBride && onCTAClick && (
        <div className="mb-10">
          <p className="font-serif text-ink mb-5" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
            {t.travelBackHeading}
          </p>
          <button
            onClick={onCTAClick}
            className="shimmer-btn px-9 py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm"
            style={{ fontSize: '0.82rem', letterSpacing: '0.28em' }}
          >
            {t.groomPrimaryCTA}
          </button>
        </div>
      )}
      <p className="font-display gold-glint text-burgundy leading-none mb-4 break-words"
        style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)' }}>
        #SakshiKoMilaKinara
      </p>
      <p className="font-sans text-stone mb-5" style={{ fontSize: '0.95rem', letterSpacing: '0.06em' }}>
        {t.eventDates} &middot; Pitampura, Delhi
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <Link href={config.themesRoute}
          className="font-sans text-burgundy underline decoration-gold/60 underline-offset-4 hover:text-ink transition-colors"
          style={{ fontSize: '0.95rem' }}>
          {t.navThemes} &rarr;
        </Link>
        <a href={config.pdfPath} target="_blank" rel="noopener noreferrer"
          className="font-sans text-burgundy underline decoration-gold/60 underline-offset-4 hover:text-ink transition-colors"
          style={{ fontSize: '0.95rem' }}>
          {isBride ? t.brideDownloadLabel : t.groomDownloadLabel}
        </a>
        <Link href={AUDIENCE_CONFIG[other].route}
          className="font-sans text-stone/70 hover:text-ink underline decoration-stone/30 underline-offset-4 transition-colors"
          style={{ fontSize: '0.9rem' }}>
          {other === 'bride' ? t.switchToBride : t.switchToGroom}
        </Link>
      </div>
    </footer>
  )
}

function WardrobeCTA({ audience }: { audience: Audience }) {
  const { t } = useLang()
  const themesRoute = AUDIENCE_CONFIG[audience].themesRoute
  return (
    <section id="wardrobe" className="scroll-mt-20 bg-cream text-center py-14">
      <p className="font-serif text-ink mb-5" style={{ fontSize: 'clamp(1.3rem, 3vw, 1.7rem)' }}>
        {t.wardrobeCTAHeading}
      </p>
      <Link href={themesRoute}
        className="shimmer-btn inline-block px-8 py-3.5 border-2 border-burgundy text-burgundy font-sans uppercase hover:bg-burgundy hover:text-paper-light transition-colors duration-300 rounded-sm"
        style={{ fontSize: '0.8rem', letterSpacing: '0.24em' }}>
        {t.wardrobeExploreCTA}
      </Link>
    </section>
  )
}

export default function AudienceHome({ audience }: { audience: Audience }) {
  const isBride = audience === 'bride'

  const scrollToTravelDetails = useCallback(() => {
    document.getElementById('travel-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <SiteHeader audience={audience} onCTAClick={!isBride ? scrollToTravelDetails : undefined} />

      <main>
        <Hero onCTAClick={scrollToTravelDetails} audience={audience} />
        <LadiesPopupTeaser />

        {isBride ? (
          <>
            <SectionThread />
            <ChaptersPreview audience={audience} />
            <SectionThread />
            <PersonalInterlude />
            <SectionThread />
            <WardrobeCTA audience={audience} />
            <SectionThread />
            <LovelyLadiesSection audience={audience} />
            <SectionThread />
            <MehndiRSVPSection audience={audience} />
          </>
        ) : (
          // Groom's guests have one job here: confirm travel, with as
          // little between them and the form as possible. The chapter
          // story and Roka photo belong to the bride's experience — a
          // small text link (in Hero, and again in the footer) is enough
          // for anyone who also wants the themes/wardrobe guide.
          <>
            <SectionThread />
            <TravelReminder onCTAClick={scrollToTravelDetails} />
            <LovelyLadiesTeaser />
            <SectionThread />
            <TravelGuidance onCTAClick={scrollToTravelDetails} />
            <SectionThread />
            <TravelDetailsSection />
            <LadiesSignpost />
            <LovelyLadiesSection audience={audience} />
            <SectionThread />
            <MehndiRSVPSection audience={audience} />
          </>
        )}

        <Footer audience={audience} onCTAClick={!isBride ? scrollToTravelDetails : undefined} />
        {!isBride && <StickyCTA onCTAClick={scrollToTravelDetails} />}
      </main>
    </>
  )
}

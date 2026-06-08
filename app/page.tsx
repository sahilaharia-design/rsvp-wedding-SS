'use client'

import { useCallback } from 'react'
import Hero from '@/components/Hero'
import MessageSection from '@/components/MessageSection'
import StatementSection from '@/components/StatementSection'
import RSVPSection from '@/components/RSVPSection'
import StickyRSVP from '@/components/StickyRSVP'
import GrandReveal from '@/components/GrandReveal'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { LanguageProvider } from '@/contexts/Language'

export default function Home() {
  const scrollToRSVP = useCallback(() => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <LanguageProvider>
      <GrandReveal />
      <LanguageSwitcher />
      <main>
        <Hero onRSVPClick={scrollToRSVP} />
        <StatementSection />
        <MessageSection onRSVPClick={scrollToRSVP} />
        <RSVPSection />

        <footer className="px-7 md:px-14 py-12 border-t border-parchment text-center bg-cream">
          <p className="font-display text-blush mb-3" style={{ fontSize: '1.9rem' }}>
            #SakshiKoMilaKinara
          </p>
          <p className="font-sans uppercase text-warm-gray mb-1"
            style={{ fontSize: '0.75rem', letterSpacing: '0.35em' }}>
            20 &ndash; 22 January 2027
          </p>
          <p className="font-sans uppercase text-warm-gray/60"
            style={{ fontSize: '0.7rem', letterSpacing: '0.3em' }}>
            Pitampura &middot; Delhi &middot; India
          </p>
        </footer>

        <StickyRSVP onRSVPClick={scrollToRSVP} />
      </main>
    </LanguageProvider>
  )
}

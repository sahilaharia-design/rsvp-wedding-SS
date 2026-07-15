'use client'

import { useCallback } from 'react'
import Hero from '@/components/Hero'
import MessageSection from '@/components/MessageSection'
import RSVPSection from '@/components/RSVPSection'
import StickyRSVP from '@/components/StickyRSVP'
import GrandReveal from '@/components/GrandReveal'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import MusicToggle from '@/components/MusicToggle'
import { LanguageProvider } from '@/contexts/Language'
import { MusicProvider } from '@/contexts/Music'

export default function Home() {
  const scrollToRSVP = useCallback(() => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <LanguageProvider>
      <MusicProvider>
        <GrandReveal />
        <LanguageSwitcher />
        <MusicToggle />
        <main>
          <Hero onRSVPClick={scrollToRSVP} />
          <MessageSection onRSVPClick={scrollToRSVP} />
          <RSVPSection />

          <footer className="px-7 md:px-14 py-10 border-t border-parchment text-center bg-cream">
            <p className="font-display text-blush" style={{ fontSize: '2.2rem' }}>
              #SakshiKoMilaKinara
            </p>
          </footer>

          <StickyRSVP onRSVPClick={scrollToRSVP} />
        </main>
      </MusicProvider>
    </LanguageProvider>
  )
}

'use client'

import { useCallback } from 'react'
import Hero from '@/components/Hero'
import MessageSection from '@/components/MessageSection'
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
<MessageSection onRSVPClick={scrollToRSVP} />
        <RSVPSection />

        <footer className="px-7 md:px-14 py-14 border-t border-parchment text-center bg-cream">
          <p className="font-display text-blush" style={{ fontSize: '2.2rem' }}>
            #SakshiKoMilaKinara
          </p>
        </footer>

        <StickyRSVP onRSVPClick={scrollToRSVP} />
      </main>
    </LanguageProvider>
  )
}

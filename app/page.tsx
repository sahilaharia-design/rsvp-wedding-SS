'use client'

import { useCallback } from 'react'
import Hero from '@/components/Hero'
import MessageSection from '@/components/MessageSection'
import StatementSection from '@/components/StatementSection'
import RSVPSection from '@/components/RSVPSection'
import StickyRSVP from '@/components/StickyRSVP'
import GrandReveal from '@/components/GrandReveal'

export default function Home() {
  const scrollToRSVP = useCallback(() => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <GrandReveal />
      <main>
        <Hero onRSVPClick={scrollToRSVP} />
        <StatementSection />
        <MessageSection onRSVPClick={scrollToRSVP} />
        <RSVPSection />

        <footer className="px-7 md:px-14 py-12 border-t border-parchment text-center bg-cream">
          <p className="font-serif italic text-[1.15rem] text-blush mb-2">
            #SakshiKoMilaKinara
          </p>
          <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-warm-gray">
            20 &ndash; 21 January 2027 &middot; Delhi, India
          </p>
        </footer>

        <StickyRSVP onRSVPClick={scrollToRSVP} />
      </main>
    </>
  )
}

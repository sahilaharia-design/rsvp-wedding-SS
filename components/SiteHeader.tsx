'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import MusicToggle from '@/components/MusicToggle'
import { useLang } from '@/contexts/Language'
import { AUDIENCE_CONFIG, OTHER_AUDIENCE, type Audience } from '@/lib/audience'

/**
 * Persistent homepage header. Audience is passed in from the route (never
 * read from client storage), so "Switch guest side" is a plain link to the
 * other audience's route — correcting a mistaken choice without requiring
 * anyone to re-answer a question on every page.
 */
export default function SiteHeader({ audience }: { audience: Audience }) {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const other = OTHER_AUDIENCE[audience]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[80] transition-colors duration-500 ${scrolled ? 'bg-paper/92 backdrop-blur border-b border-thread-border/50' : 'bg-transparent'}`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-14 py-3.5 flex items-center justify-between">
        <Link
          href={AUDIENCE_CONFIG[audience].route}
          className="font-display text-burgundy hover:opacity-80 transition-opacity flex-shrink-0"
          style={{ fontSize: '1.3rem' }}
        >
          S&nbsp;&amp;&nbsp;S
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={AUDIENCE_CONFIG[other].route}
            className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-ink/8 font-sans text-[10px] md:text-[11px] tracking-wide text-ink/60 hover:text-ink transition-colors flex-shrink-0"
          >
            {other === 'bride' ? t.switchToBride : t.switchToGroom}
          </Link>
          <MusicToggle />
          <LanguageSwitcher variant={scrolled ? 'light' : 'dark'} />
        </div>
      </div>
    </header>
  )
}

'use client'

import { useEffect, useState } from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import MusicToggle from '@/components/MusicToggle'
import { useLang } from '@/contexts/Language'
import { useGuestSide } from '@/contexts/GuestSide'

/**
 * Persistent homepage header — gives the site real wayfinding (a monogram
 * that always scrolls back to the top) and a proper, discoverable way to
 * change the groom's-side/bride's-side choice, instead of a tiny corner icon.
 */
export default function SiteHeader() {
  const { t } = useLang()
  const { side, reset } = useGuestSide()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[80] transition-colors duration-500 ${scrolled ? 'bg-paper/92 backdrop-blur border-b border-thread-border/50' : 'bg-transparent'}`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-14 py-3.5 flex items-center justify-between">
        <button
          onClick={scrollToTop}
          className="font-display text-burgundy hover:opacity-80 transition-opacity flex-shrink-0"
          style={{ fontSize: '1.3rem' }}
          aria-label={t.homeLabel}
        >
          S&nbsp;&amp;&nbsp;S
        </button>

        <div className="flex items-center gap-2">
          {side !== null && (
            <button
              onClick={reset}
              className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-ink/8 font-sans text-[10px] md:text-[11px] tracking-wide text-ink/60 hover:text-ink transition-colors flex-shrink-0"
              title={t.switchSideLabel}
            >
              {side === 'bride' ? t.sideSwitchBrideShort : t.sideSwitchGroomShort}
            </button>
          )}
          <MusicToggle />
          <LanguageSwitcher variant={scrolled ? 'light' : 'dark'} />
        </div>
      </div>
    </header>
  )
}

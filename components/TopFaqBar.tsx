'use client'

import Link from 'next/link'
import { useLang } from '@/contexts/Language'
import { AUDIENCE_CONFIG, type Audience } from '@/lib/audience'

// Always-on announcement bar above SiteHeader (which is pushed down to make
// room for it — see its `top-9` offset) — the very first thing on screen,
// no scrolling or hero-reading required. Reuses the homepage FaqTeaser's
// strings so the "Got Questions?" wording stays consistent site-wide.
export default function TopFaqBar({ audience }: { audience: Audience }) {
  const { t } = useLang()
  const faqRoute = AUDIENCE_CONFIG[audience].faqRoute

  return (
    <Link
      href={faqRoute}
      className="fixed top-0 left-0 right-0 z-[85] h-9 flex items-center justify-center gap-2 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300"
      style={{ fontSize: '0.72rem', letterSpacing: '0.1em' }}
    >
      <span className="text-gold">?</span>
      {t.faqTeaserHeading}
      <span className="underline underline-offset-2">{t.faqTeaserCTA}</span>
      <span>&rarr;</span>
    </Link>
  )
}

'use client'

import Link from 'next/link'
import { useLang } from '@/contexts/Language'
import { AUDIENCE_CONFIG, type Audience } from '@/lib/audience'

// A warm nudge toward the FAQ page, placed just above the footer so anyone
// with a lingering question sees it before they leave — the footer text
// link alone is easy to scroll past unnoticed.
export default function FaqTeaser({ audience }: { audience: Audience }) {
  const { t } = useLang()
  const faqRoute = AUDIENCE_CONFIG[audience].faqRoute

  return (
    <section className="bg-champagne/20 text-center py-14">
      <p className="font-serif text-ink mb-3" style={{ fontSize: 'clamp(1.3rem, 3vw, 1.7rem)' }}>
        {t.faqTeaserHeading}
      </p>
      <p className="font-sans text-stone mb-6" style={{ fontSize: '0.95rem' }}>
        {t.faqTeaserBody}
      </p>
      <Link href={faqRoute}
        className="shimmer-btn inline-block px-8 py-3.5 border-2 border-burgundy text-burgundy font-sans uppercase hover:bg-burgundy hover:text-paper-light transition-colors duration-300 rounded-sm"
        style={{ fontSize: '0.8rem', letterSpacing: '0.24em' }}>
        {t.faqTeaserCTA}
      </Link>
    </section>
  )
}

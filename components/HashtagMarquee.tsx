'use client'

// Slow, endlessly scrolling ribbon under the hero — hashtag, dates, place.
// CSS-only motion (one translateX loop), pauses on hover, and sits still under
// prefers-reduced-motion. Decorative: the same facts are in the hero itself.
import { useLang } from '@/contexts/Language'
import type { Audience } from '@/lib/audience'

export default function HashtagMarquee({ audience }: { audience: Audience }) {
  const { t } = useLang()
  const dates = audience === 'bride' ? t.brideEventDates : t.eventDates

  const Item = () => (
    <>
      <span className="font-display text-[#F3D9A4] whitespace-nowrap" style={{ fontSize: '1.7rem', lineHeight: 1 }}>#SakshiKoMilaKinara</span>
      <span className="text-gold" aria-hidden="true">&#10022;</span>
      <span className="font-sans uppercase whitespace-nowrap text-paper-light/90" style={{ fontSize: '0.78rem', letterSpacing: '0.28em' }}>{dates}</span>
      <span className="text-gold" aria-hidden="true">&#10022;</span>
      <span className="font-sans uppercase whitespace-nowrap text-paper-light/90" style={{ fontSize: '0.78rem', letterSpacing: '0.28em' }}>Pitampura, Delhi</span>
      <span className="text-gold" aria-hidden="true">&#10022;</span>
    </>
  )

  return (
    <div aria-hidden="true" className="marquee relative overflow-hidden bg-burgundy border-y border-gold/50 py-3.5">
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-7 pr-7">
            <Item /><Item />
          </div>
        ))}
      </div>
    </div>
  )
}

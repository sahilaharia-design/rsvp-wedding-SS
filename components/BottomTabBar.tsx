'use client'

// Persistent site-wide bottom navigation — mounted on every guest-facing
// page (home, themes, makeup) so the four key destinations are always one
// tap away, the way a "proper website" should feel, not just a single
// scroll-driven page. Always visible (unlike the old StickyCTA it
// replaces) — this is navigation, not a contextual nudge, so it doesn't
// hide/show based on scroll position.
//
// Travel and Mehndi live as anchors on the audience's home page, not
// their own routes — clicking those tabs from the home page itself just
// scrolls; clicking from Themes or Makeup does a real navigation to
// `<home>#<anchor>`, and the home page's own mount-effect (see
// TravelDetailsSection / MehndiRSVPSection) picks up the hash and scrolls
// once it lands, since Next's client-side routing doesn't do that for you.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { useLang } from '@/contexts/Language'
import { AUDIENCE_CONFIG, type Audience } from '@/lib/audience'

interface Tab {
  label: string
  href: string
  anchorId?: string
}

export default function BottomTabBar({ audience }: { audience: Audience }) {
  const { t } = useLang()
  const pathname = usePathname()
  const config = AUDIENCE_CONFIG[audience]
  const isGroom = audience === 'groom'

  const tabs: Tab[] = isGroom
    ? [
        { label: t.navHome, href: config.route },
        { label: t.navTabTravel, href: `${config.route}#travel-details`, anchorId: 'travel-details' },
        { label: t.navMehndi, href: `${config.route}#mehndi-rsvp`, anchorId: 'mehndi-rsvp' },
        { label: t.navMakeup, href: config.makeupRoute },
      ]
    : [
        { label: t.navHome, href: config.route },
        { label: t.navTabThemes, href: config.themesRoute },
        { label: t.navMehndi, href: `${config.route}#mehndi-rsvp`, anchorId: 'mehndi-rsvp' },
        { label: t.navMakeup, href: config.makeupRoute },
      ]

  const onTabClick = useCallback(
    (tab: Tab) => (e: React.MouseEvent) => {
      if (tab.anchorId && pathname === config.route) {
        e.preventDefault()
        document.getElementById(tab.anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    [pathname, config.route]
  )

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[70] bg-paper/95 backdrop-blur border-t border-thread-border/60"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Site navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-4">
        {tabs.map((tab) => {
          const active = !tab.anchorId && pathname === tab.href
          return (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={onTabClick(tab)}
              className="flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-200"
            >
              <span
                className="w-1 h-1 rounded-full transition-opacity duration-200"
                style={{ background: '#A17B3D', opacity: active ? 1 : 0 }}
              />
              <span
                className={`font-sans uppercase transition-colors duration-200 ${active ? 'text-burgundy' : 'text-stone/70'}`}
                style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

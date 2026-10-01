'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import BottomTabBar from '@/components/BottomTabBar'
import { useLang, type Strings } from '@/contexts/Language'
import { AUDIENCE_CONFIG, OTHER_AUDIENCE, type Audience } from '@/lib/audience'
import { faqContent, type FaqItem, type FaqLinkType } from '@/content/faqContent'

const EASE = [0.25, 0.1, 0.25, 1] as const

// Resolves a content-level link type to an actual href + button label,
// reusing the same translated CTA strings their source pages already use
// (wardrobeExploreCTA, lovelyLadiesMakeupCardCTA, etc.) instead of writing
// new copy here — one source of truth per label, in all three languages.
function resolveFaqLink(type: FaqLinkType, audience: Audience, t: Strings) {
  const config = AUDIENCE_CONFIG[audience]
  switch (type) {
    case 'themes':
      return { href: config.themesRoute, label: t.wardrobeExploreCTA }
    case 'makeup':
      return { href: config.makeupRoute, label: t.lovelyLadiesMakeupCardCTA }
    case 'guide':
      return { href: config.pdfPath, label: audience === 'bride' ? t.brideDownloadLabel : t.groomDownloadLabel, external: true }
    case 'mehndiRsvp':
      return { href: `${config.route}#mehndi-rsvp`, label: t.lovelyLadiesMehndiCardCTA }
    case 'travelDetails':
      return { href: `${config.route}#travel-details`, label: t.groomPrimaryCTA }
    case 'switchAudience': {
      const other = OTHER_AUDIENCE[audience]
      return { href: AUDIENCE_CONFIG[other].route, label: other === 'bride' ? t.switchToBride : t.switchToGroom }
    }
  }
}

type ResolvedLink = ReturnType<typeof resolveFaqLink>

// Alternating card tints so the categories read as a lively set of cards
// rather than one long uniform list — same palette used in LovelyLadiesSection.
const CARD_TINTS = ['bg-blush/10', 'bg-champagne/20', 'bg-cream/70']

// Small line-art badges, one per category — same thin-stroke style as the
// existing plane/rail/road travel icons (the travel badge reuses that exact
// path), just enough personality to make the list scannable and inviting.
function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const stroke = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (id) {
    case 'save-the-date':
      return (
        <svg viewBox="0 0 64 64" className={className} {...stroke}>
          <rect x="10" y="14" width="44" height="40" rx="5" />
          <line x1="10" y1="25" x2="54" y2="25" />
          <line x1="21" y1="8" x2="21" y2="18" />
          <line x1="43" y1="8" x2="43" y2="18" />
          <circle cx="24" cy="36" r="2" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'travel':
      return (
        <svg viewBox="0 0 64 64" className={className} {...stroke}>
          <path d="M8 36l20-9V9c0-6 8-6 8 0v18l20 9v7l-20-5v13l6 5v4l-10-3-10 3v-4l6-5V38L8 43z" />
        </svg>
      )
    case 'mehndi':
      return (
        <svg viewBox="0 0 64 64" className={className} {...stroke}>
          <path d="M32 8c10 14 16 22 16 30a16 16 0 11-32 0c0-8 6-16 16-30z" />
          <path d="M26 38c0 4 3 7 7 7" />
        </svg>
      )
    case 'makeup':
      return (
        <svg viewBox="0 0 64 64" className={className} {...stroke}>
          <rect x="25" y="30" width="14" height="24" rx="2.5" />
          <path d="M25 30l3.5-16h7l3.5 16z" />
        </svg>
      )
    case 'wear':
      return (
        <svg viewBox="0 0 64 64" className={className} {...stroke}>
          <path d="M32 14a5 5 0 015 5c0 2-1.2 3.3-3 4.2L32 24.5" />
          <path d="M32 24l-24 14a4.5 4.5 0 004.5 7h39a4.5 4.5 0 004.5-7L32 24z" />
        </svg>
      )
    case 'good-to-know':
      return (
        <svg viewBox="0 0 64 64" className={className} {...stroke}>
          <circle cx="32" cy="32" r="22" />
          <path d="M25 24c0-4.5 3.5-8 8-8s7.5 3.3 7.5 7c0 6-7.5 6.5-7.5 13.5" />
          <circle cx="32.5" cy="46" r="1.9" fill="currentColor" stroke="none" />
        </svg>
      )
    default:
      return null
  }
}

// One open/closed accordion row. Kept as its own top-level component (not
// nested inside FaqPageClient) so each row's open state is local to itself
// — several can be open at once, and toggling one never re-renders the rest.
function FaqRow({ item, link }: { item: FaqItem; link?: ResolvedLink }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-thread-border/50 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-serif text-ink" style={{ fontSize: '1.05rem' }}>
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex-shrink-0 mt-1 font-sans text-burgundy"
          style={{ fontSize: '1.3rem', lineHeight: 1 }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-8">
              <p className="font-sans leading-[1.8] text-stone" style={{ fontSize: '0.95rem' }}>
                {item.answer}
              </p>
              {link && (
                <Link
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 border-2 border-burgundy text-burgundy font-sans uppercase hover:bg-burgundy hover:text-paper-light transition-colors duration-300 rounded-sm"
                  style={{ fontSize: '0.72rem', letterSpacing: '0.16em' }}
                >
                  {link.label} &rarr;
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqPageClient({ audience }: { audience: Audience }) {
  const { t, lang } = useLang()
  const config = AUDIENCE_CONFIG[audience]
  const categories = faqContent[lang]
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => !item.audience || item.audience === audience),
    }))
    .filter((category) => category.items.length > 0)

  return (
    <>
      <main className="min-h-screen bg-paper pb-16">
        <nav className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-thread-border/60">
          <div className="max-w-3xl mx-auto px-6 md:px-14 py-4 flex flex-wrap items-center justify-between gap-3">
            <Link href={config.route} className="font-display text-burgundy" style={{ fontSize: '1.4rem' }}>
              S&nbsp;&amp;&nbsp;S
            </Link>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-sans uppercase text-ink/70"
              style={{ fontSize: '0.75rem', letterSpacing: '0.14em' }}>
              <Link href={config.route} className="hover:text-burgundy transition-colors">{t.navHome}</Link>
              <Link href={`${config.route}#mehndi-rsvp`} className="hover:text-burgundy transition-colors">{t.navMehndi}</Link>
              <Link href={config.makeupRoute} className="hover:text-burgundy transition-colors">{t.navMakeup}</Link>
            </div>
            <LanguageSwitcher variant="light" />
          </div>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-2xl mx-auto px-7 md:px-14 py-14 md:py-20"
        >
          <div className="text-center mb-12">
            <p className="font-sans uppercase text-gold mb-4" style={{ fontSize: '0.8rem', letterSpacing: '0.24em' }}>
              {t.faqEyebrow}
            </p>
            <h1 className="font-serif text-ink mb-5" style={{ fontSize: 'clamp(1.9rem, 5vw, 2.8rem)' }}>
              {t.faqHeading}
            </h1>
            <p className="font-sans leading-[1.7] text-stone" style={{ fontSize: '1.02rem' }}>
              {t.faqIntro}
            </p>
          </div>

          <div className="space-y-10">
            {categories.map((category, i) => (
              <div key={category.id}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="hover-lift flex-shrink-0 w-10 h-10 rounded-full bg-paper border border-gold/50 flex items-center justify-center">
                    <CategoryIcon id={category.id} className="w-5 h-5 text-burgundy" />
                  </span>
                  <h2 className="font-sans uppercase text-burgundy" style={{ fontSize: '0.85rem', letterSpacing: '0.18em' }}>
                    {category.title}
                  </h2>
                </div>
                <div className={`rounded-2xl border-2 border-thread-border/60 ${CARD_TINTS[i % CARD_TINTS.length]} px-6`}>
                  {category.items.map((item) => (
                    <FaqRow key={item.id} item={item} link={item.link ? resolveFaqLink(item.link, audience, t) : undefined} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href={config.route} className="font-sans text-burgundy underline decoration-gold/60 underline-offset-4 hover:text-ink transition-colors" style={{ fontSize: '0.92rem' }}>
              &larr; {t.navHome}
            </Link>
          </div>
        </motion.div>
      </main>
      <BottomTabBar audience={audience} />
    </>
  )
}

'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
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

// faq-<id> anchor prefix — kept distinct from category ids (also used as
// DOM ids) so a search result's scroll target can never collide with a
// category section's own id.
const rowAnchor = (id: string) => `faq-${id}`

// Small line-art badges, one per category — same thin-stroke style as the
// existing plane/rail/road travel icons (the travel badge reuses that exact
// path), just enough personality to make the list scannable and inviting.
// Also reused at a smaller size in the jump-to-topic strip, so every topic
// is one tap away even for guests who never scroll past the intro.
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
    case 'venues':
      return (
        <svg viewBox="0 0 64 64" className={className} {...stroke}>
          <path d="M32 8c11 0 19 8.5 19 19 0 14-19 29-19 29S13 41 13 27c0-10.5 8-19 19-19z" />
          <circle cx="32" cy="27" r="7" />
        </svg>
      )
    case 'food-stay':
      return (
        <svg viewBox="0 0 64 64" className={className} {...stroke}>
          <path d="M14 20h30v15a13 13 0 01-13 13h-4a13 13 0 01-13-13V20z" />
          <path d="M44 24h4a6 6 0 010 12h-4" />
        </svg>
      )
    case 'nearby':
      return (
        <svg viewBox="0 0 64 64" className={className} {...stroke}>
          <path d="M21 22v-5a11 11 0 0122 0v5" />
          <rect x="14" y="22" width="36" height="30" rx="4" />
        </svg>
      )
    default:
      return null
  }
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  )
}

// One open/closed accordion row. Open state is lifted to the parent (an
// openIds set) rather than kept locally, so a search result can expand the
// one it points to without touching every other row's state.
function FaqRow({ item, link, open, onToggle }: { item: FaqItem; link?: ResolvedLink; open: boolean; onToggle: () => void }) {
  return (
    <div id={rowAnchor(item.id)} className="scroll-mt-24 border-b border-thread-border/50 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-serif text-ink" style={{ fontSize: '1.15rem', lineHeight: 1.4 }}>
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex-shrink-0 mt-1 font-sans text-burgundy"
          style={{ fontSize: '1.4rem', lineHeight: 1 }}
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
              <p className="font-sans leading-[1.75] text-stone" style={{ fontSize: '1.03rem' }}>
                {item.answer}
              </p>
              {link && (
                <Link
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 border-2 border-burgundy text-burgundy font-sans uppercase hover:bg-burgundy hover:text-paper-light transition-colors duration-300 rounded-sm"
                  style={{ fontSize: '0.76rem', letterSpacing: '0.16em' }}
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
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')
  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const categories = faqContent[lang]
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => !item.audience || item.audience === audience),
    }))
    .filter((category) => category.items.length > 0)

  // Flat index for search — question matches rank above answer-only
  // matches, so typing e.g. "pickup" surfaces the pickup FAQ itself before
  // any FAQ that merely mentions pickup in passing.
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return categories
      .flatMap((category) => category.items.map((item) => ({ item, categoryTitle: category.title })))
      .map(({ item, categoryTitle }) => {
        const qMatch = item.question.toLowerCase().includes(q)
        const aMatch = item.answer.toLowerCase().includes(q)
        const score = qMatch ? 2 : aMatch ? 1 : 0
        return { item, categoryTitle, score }
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }, [categories, query])

  const goToResult = (id: string) => {
    // 'instant' is explicit on purpose — globals.css sets scroll-behavior:
    // smooth on <html>, so omitting behavior (or passing 'auto') silently
    // inherits that smooth animation, which the state update right below
    // (closing the dropdown, opening the row) then interrupts mid-flight
    // for anything more than a short distance. Only an explicit 'instant'
    // actually bypasses the CSS and lands synchronously, in the same tick
    // as the click — before the row opens, which is fine since the row's
    // own top edge doesn't move when it opens (only the content after it
    // shifts down as the row grows).
    document.getElementById(rowAnchor(id))?.scrollIntoView({ behavior: 'instant', block: 'start' })
    setOpenIds((prev) => new Set(prev).add(id))
    setQuery('')
  }

  const jumpToCategory = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
          className="max-w-2xl mx-auto px-6 md:px-14 pt-6 pb-14 md:pt-10 md:pb-20"
        >
          <div className="text-center mb-5">
            <p className="font-sans uppercase text-gold mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.22em' }}>
              {t.faqEyebrow}
            </p>
            <h1 className="font-serif text-ink mb-2" style={{ fontSize: 'clamp(1.6rem, 6vw, 2.4rem)', lineHeight: 1.15 }}>
              {t.faqHeading}
            </h1>
            <p className="font-sans text-stone" style={{ fontSize: '0.95rem' }}>
              {t.faqIntro}
            </p>
          </div>

          {/* Topic grid — every category visible at once, no scrolling
              (horizontal or vertical) required to see what's covered. This
              replaces an earlier horizontal-scroll strip that only showed
              2-3 topics at a time and buried the rest off-screen. */}
          <motion.div
            className="grid grid-cols-3 gap-2.5 mb-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.035 } } }}
          >
            {categories.map((category, i) => (
              <motion.button
                key={category.id}
                type="button"
                onClick={() => jumpToCategory(category.id)}
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                whileTap={{ scale: 0.94 }}
                className={`hover-lift flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-thread-border/50 ${CARD_TINTS[i % CARD_TINTS.length]} px-1.5 py-3.5 text-center transition-colors duration-200 hover:border-burgundy`}
              >
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-paper border border-gold/50 flex items-center justify-center">
                  <CategoryIcon id={category.id} className="w-4 h-4 text-burgundy" />
                </span>
                <span className="font-sans uppercase text-ink/80 leading-tight" style={{ fontSize: '0.62rem', letterSpacing: '0.02em' }}>
                  {category.title}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Search — finds a question by keyword across every category,
              not just the ones a guest happens to browse into. */}
          <div className="relative mb-2">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone/50" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') setQuery('') }}
                placeholder={t.faqSearchPlaceholder}
                className="w-full rounded-full border-2 border-thread-border/60 bg-paper pl-12 pr-5 py-3.5 font-sans text-ink placeholder:text-stone/50 focus:outline-none focus:border-burgundy transition-colors duration-200"
                style={{ fontSize: '1rem' }}
              />
            </div>
            {query.trim().length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-2 rounded-2xl border-2 border-thread-border/60 bg-paper shadow-lg overflow-hidden">
                {searchResults.length > 0 ? (
                  searchResults.map(({ item, categoryTitle }) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goToResult(item.id)}
                      className="w-full text-left px-5 py-3.5 border-b border-thread-border/40 last:border-b-0 hover:bg-blush/15 transition-colors duration-150"
                    >
                      <p className="font-sans uppercase text-gold mb-0.5" style={{ fontSize: '0.68rem', letterSpacing: '0.1em' }}>
                        {categoryTitle}
                      </p>
                      <p className="font-serif text-ink" style={{ fontSize: '1rem' }}>
                        {item.question}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="px-5 py-4 font-sans text-stone/70" style={{ fontSize: '0.92rem' }}>
                    {t.faqSearchNoResults}
                  </p>
                )}
              </div>
            )}
          </div>
          <p className="text-center font-sans text-stone/60 mb-8" style={{ fontSize: '0.78rem' }}>
            {t.faqLanguageNote}
          </p>

          <div className="space-y-8">
            {categories.map((category, i) => (
              <div key={category.id} id={category.id} className="scroll-mt-24">
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
                    <FaqRow
                      key={item.id}
                      item={item}
                      link={item.link ? resolveFaqLink(item.link, audience, t) : undefined}
                      open={openIds.has(item.id)}
                      onToggle={() => toggleItem(item.id)}
                    />
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

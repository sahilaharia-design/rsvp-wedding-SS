'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import BottomTabBar from '@/components/BottomTabBar'
import { useLang } from '@/contexts/Language'
import { AUDIENCE_CONFIG, type Audience } from '@/lib/audience'
import { faqContent, type FaqItem } from '@/content/faqContent'

const EASE = [0.25, 0.1, 0.25, 1] as const

// One open/closed accordion row. Kept as its own top-level component (not
// nested inside FaqPageClient) so each row's open state is local to itself
// — several can be open at once, and toggling one never re-renders the rest.
function FaqRow({ item }: { item: FaqItem }) {
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
            <p className="font-sans leading-[1.8] text-stone pb-6 pr-8" style={{ fontSize: '0.95rem' }}>
              {item.answer}
            </p>
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
            {categories.map((category) => (
              <div key={category.id}>
                <h2 className="font-sans uppercase text-burgundy mb-2" style={{ fontSize: '0.85rem', letterSpacing: '0.18em' }}>
                  {category.title}
                </h2>
                <div className="rounded-2xl border-2 border-thread-border/60 bg-blush/10 px-6">
                  {category.items.map((item) => (
                    <FaqRow key={item.id} item={item} />
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

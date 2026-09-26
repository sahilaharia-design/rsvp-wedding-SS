'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import BottomTabBar from '@/components/BottomTabBar'
import { useLang } from '@/contexts/Language'
import { AUDIENCE_CONFIG, MAKEUP_GUIDE_PDF_PATH, type Audience } from '@/lib/audience'

const EASE = [0.25, 0.1, 0.25, 1] as const

// Reached from either /bride/makeup or /groom/makeup — same guide, same
// copy (it's addressed to "the lovely ladies" on either side), only the
// back link differs. The PDF itself is the actual salon directory (contacts,
// maps, Instagram links); this page only introduces it and hands off to
// Open/Download, per direct instruction not to hand-recreate an unverified
// directory on the site.
export default function MakeupGuidePage({ audience }: { audience: Audience }) {
  const { t } = useLang()
  const homeRoute = AUDIENCE_CONFIG[audience].route

  return (
    <>
    <main className="min-h-screen bg-paper pb-16">
      <nav className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-thread-border/60">
        <div className="max-w-3xl mx-auto px-6 md:px-14 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link href={homeRoute} className="font-display text-burgundy" style={{ fontSize: '1.4rem' }}>
            S&nbsp;&amp;&nbsp;S
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-sans uppercase text-ink/70"
            style={{ fontSize: '0.75rem', letterSpacing: '0.14em' }}>
            <Link href={homeRoute} className="hover:text-burgundy transition-colors">{t.navHome}</Link>
            <Link href={`${homeRoute}#mehndi-rsvp`} className="hover:text-burgundy transition-colors">{t.navMehndi}</Link>
          </div>
          <LanguageSwitcher variant="light" />
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="max-w-2xl mx-auto px-7 md:px-14 py-14 md:py-20 text-center"
      >
        <p className="font-sans uppercase text-gold mb-4" style={{ fontSize: '0.8rem', letterSpacing: '0.24em' }}>
          {t.makeupEyebrow}
        </p>
        <h1 className="font-serif text-ink mb-6" style={{ fontSize: 'clamp(1.9rem, 5vw, 2.8rem)' }}>
          {t.makeupHeading}
        </h1>
        <p className="font-sans leading-[1.85] text-stone mb-8" style={{ fontSize: '1.05rem' }}>
          {t.makeupBody1}
        </p>

        <div className="rounded-2xl border-2 border-thread-border/60 bg-blush/15 p-7 mb-8 text-left">
          <p className="font-serif text-ink mb-3" style={{ fontSize: '1.15rem' }}>
            {t.makeupTimingHeading}
          </p>
          <p className="font-sans leading-[1.8] text-stone" style={{ fontSize: '0.98rem' }}>
            {t.makeupTimingBody}
          </p>
        </div>

        <a href={MAKEUP_GUIDE_PDF_PATH} target="_blank" rel="noopener noreferrer"
          className="shimmer-btn inline-block px-9 py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm mb-4"
          style={{ fontSize: '0.82rem', letterSpacing: '0.28em' }}>
          {t.makeupOpenBtn}
        </a>

        {/* The full guide shown in place — one click from the Lovely Ladies
            card lands here with the whole PDF already visible, no second
            click required to see the salon directory. */}
        <div className="rounded-2xl overflow-hidden border-2 border-thread-border/60 mb-3"
          style={{ height: 'min(82vh, 900px)', boxShadow: '0 16px 40px rgba(48,54,50,0.12)' }}>
          <iframe
            src={`${MAKEUP_GUIDE_PDF_PATH}#view=FitH`}
            title="Makeup Guide"
            className="w-full h-full"
            style={{ border: 'none' }}
          />
        </div>
        <p className="font-sans text-stone/70 mb-10" style={{ fontSize: '0.82rem' }}>
          {t.makeupViewerCaption}
        </p>

        <p className="font-sans text-stone/70 italic mb-10" style={{ fontSize: '0.85rem' }}>
          {t.makeupDisclaimer}
        </p>

        <Link href={homeRoute} className="font-sans text-burgundy underline decoration-gold/60 underline-offset-4 hover:text-ink transition-colors" style={{ fontSize: '0.92rem' }}>
          &larr; {t.navHome}
        </Link>
      </motion.div>
    </main>
    <BottomTabBar audience={audience} />
    </>
  )
}

'use client'

// The neutral entry point. Always shows both choices — never auto-redirects
// based on stored state. A previously saved preference (if any existed)
// must never override an explicit invitation link, so this page simply
// doesn't read any stored preference at all.
import Link from 'next/link'
import { motion } from 'framer-motion'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLang } from '@/contexts/Language'
import { AUDIENCE_CONFIG } from '@/lib/audience'

const EASE = [0.25, 0.1, 0.25, 1] as const

export default function RootPicker() {
  const { t } = useLang()

  return (
    <main className="min-h-screen bg-paper flex flex-col">
      <div className="flex justify-end px-5 md:px-10 pt-5">
        <LanguageSwitcher variant="light" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="flex-1 flex flex-col items-center justify-center px-6 py-14 text-center"
      >
        <p className="font-display text-burgundy mb-6" style={{ fontSize: '2.2rem' }}>
          S&nbsp;&amp;&nbsp;S
        </p>
        <p className="font-sans uppercase text-stone mb-4" style={{ fontSize: '0.8rem', letterSpacing: '0.28em' }}>
          {t.rootEyebrow}
        </p>
        <h1 className="font-serif text-ink mb-3" style={{ fontSize: 'clamp(1.9rem, 5vw, 2.8rem)' }}>
          {t.rootHeading}
        </h1>
        <p className="font-serif italic text-stone mb-3" style={{ fontSize: 'clamp(1.05rem, 2.4vw, 1.25rem)' }}>
          {t.rootIntro}
        </p>
        <p className="font-sans text-stone mb-12" style={{ fontSize: '0.95rem', letterSpacing: '0.04em' }}>
          {t.eventDates} &middot; Pitampura, Delhi
        </p>

        <div className="grid sm:grid-cols-2 gap-5 w-full max-w-2xl">
          <Link
            href={AUDIENCE_CONFIG.bride.route}
            className="shimmer-btn group text-left bg-paper-light border-2 border-thread-border/60 hover:border-burgundy rounded-2xl p-7 transition-colors duration-300"
          >
            <h2 className="font-serif text-ink mb-2" style={{ fontSize: '1.5rem' }}>
              {t.rootBrideChoice}
            </h2>
            <p className="font-sans text-stone" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
              {t.rootBrideChoiceBody}
            </p>
          </Link>

          <Link
            href={AUDIENCE_CONFIG.groom.route}
            className="shimmer-btn group text-left bg-paper-light border-2 border-thread-border/60 hover:border-burgundy rounded-2xl p-7 transition-colors duration-300"
          >
            <h2 className="font-serif text-ink mb-2" style={{ fontSize: '1.5rem' }}>
              {t.rootGroomChoice}
            </h2>
            <p className="font-sans text-stone" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
              {t.rootGroomChoiceBody}
            </p>
          </Link>
        </div>

        <p className="font-display gold-glint text-burgundy leading-none mt-14 break-words"
          style={{ fontSize: 'clamp(1.4rem, 3.8vw, 2rem)' }}>
          #SakshiKoMilaKinara
        </p>
      </motion.div>
    </main>
  )
}

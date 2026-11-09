'use client'

// Single-purpose landing page for the groom's guests: /groom/travel.
// One job — get a guest to complete the Travel Details form, fast. Everything
// here either (a) warms them up (Diwali greeting, deadline), (b) removes a
// reason to hesitate (3 quick steps, "good to know" answers), or (c) carries
// them to the form (hero CTA, sticky bar). The form itself is the same
// TravelDetailsSection used on /groom, so there is one copy to keep correct.
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/contexts/Language'
import { AUDIENCE_CONFIG } from '@/lib/audience'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import HeroAtmosphere from '@/components/HeroAtmosphere'
import TravelDetailsSection from '@/components/TravelDetailsSection'

const EASE = [0.25, 0.1, 0.25, 1] as const
const DEADLINE_ISO = '2026-11-15' // last day to confirm (IST) — keep in step with Language.tsx `deadline`
const textShadow = { textShadow: '0 2px 10px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.85)' }

// Whole calendar days from today (IST) to the deadline: >0 days left, 0 last day, <0 passed.
function useDaysLeft() {
  const [days, setDays] = useState<number | null>(null)
  useEffect(() => {
    const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) // YYYY-MM-DD
    const diff = Math.round((Date.parse(DEADLINE_ISO) - Date.parse(todayIST)) / 86_400_000)
    setDays(diff)
  }, [])
  return days
}

function Diya({ delay = 0 }: { delay?: number }) {
  return (
    <svg viewBox="0 0 48 52" width="34" height="37" aria-hidden="true" style={{ overflow: 'visible' }}>
      <ellipse className="diya-glow" cx="24" cy="18" rx="17" ry="17" fill="rgba(243,217,164,0.35)" style={{ animationDelay: `${delay}s` }} />
      <path className="diya-flame" style={{ animationDelay: `${delay}s` }} d="M24 3C30 11 33 16 24 26C15 16 18 11 24 3Z" fill="#F3B64A" />
      <path className="diya-flame" style={{ animationDelay: `${delay + 0.2}s` }} d="M24 12C27 16 28 19 24 24C20 19 21 16 24 12Z" fill="#FFF3C9" />
      <path d="M4 30h40c-1 10-8 16-20 16S5 40 4 30Z" fill="#B97914" />
      <path d="M4 30h40" stroke="#F3D9A4" strokeWidth="1.6" />
      <path d="M12 36c4 3 20 3 24 0" stroke="#F3D9A4" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

export default function TravelLanding() {
  const { t } = useLang()
  const days = useDaysLeft()
  const heroCtaRef = useRef<HTMLButtonElement>(null)
  const [heroCtaVisible, setHeroCtaVisible] = useState(true)
  const [formVisible, setFormVisible] = useState(false)
  // Header floats transparent over the photo, then turns into a solid bar
  // (dark logo, light switcher) once the guest scrolls onto paper-coloured sections.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const deadlineLabel = days === null
    ? ''
    : days > 1 ? t.tlDaysLeft.replace('{n}', String(days))
    : days === 1 ? t.tlDayLeft
    : days === 0 ? t.tlLastDay
    : t.tlStillOpen

  const goToForm = () => document.getElementById('travel-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Sticky CTA shows only while the guest is neither looking at the hero
  // button nor already at the form.
  useEffect(() => {
    const cta = heroCtaRef.current
    const form = document.getElementById('travel-details')
    if (!cta || !form || typeof IntersectionObserver === 'undefined') return
    // The top ~110px is covered by the fixed bar + header, so a button sliding
    // under them is no longer tappable and counts as out of view.
    const a = new IntersectionObserver(([e]) => setHeroCtaVisible(e.isIntersecting), { rootMargin: '-110px 0px 0px 0px' })
    const b = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), { threshold: 0.12 })
    a.observe(cta); b.observe(form)
    return () => { a.disconnect(); b.disconnect() }
  }, [])
  const showSticky = !heroCtaVisible && !formVisible

  const steps = useMemo(() => [t.tlStep1, t.tlStep2, t.tlStep3], [t])
  const reassurance = useMemo(() => [
    { title: t.tlR1T, body: t.tlR1B, icon: 'ticket' },
    { title: t.tlR2T, body: t.tlR2B, icon: 'clock' },
    { title: t.tlR3T, body: t.tlR3B, icon: 'shield' },
  ], [t])

  return (
    <>
      {/* Deadline bar — always on screen */}
      <button
        onClick={goToForm}
        className="fixed top-0 left-0 right-0 z-[85] h-9 px-3 flex items-center justify-center gap-2 bg-burgundy text-paper-light font-sans hover:bg-[#5c0a1c] transition-colors duration-300"
        style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}
      >
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#F3B64A] opacity-75 animate-ping motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F3B64A]" />
        </span>
        <span className="truncate">{t.tlBar.replace('{date}', t.deadline)}</span>
        {deadlineLabel && <span className="flex-shrink-0 rounded-full bg-gold/30 px-2 py-0.5 text-[#F3D9A4] font-medium">{deadlineLabel}</span>}
      </button>

      <header className={`fixed top-9 left-0 right-0 z-[80] transition-colors duration-500 ${scrolled ? 'bg-paper/95 backdrop-blur border-b border-thread-border/50' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-5 md:px-14 py-3.5 flex items-center justify-between">
          <Link href={AUDIENCE_CONFIG.groom.route} className={`font-display hover:opacity-80 transition-colors ${scrolled ? 'text-burgundy' : 'text-paper-light'}`} style={{ fontSize: '1.3rem', ...(scrolled ? {} : textShadow) }}>
            S&nbsp;&amp;&nbsp;S
          </Link>
          <LanguageSwitcher variant={scrolled ? 'light' : 'dark'} />
        </div>
      </header>

      <main className="pb-24">
        {/* ── Diwali hero ── */}
        <section className="relative min-h-[92svh] overflow-hidden bg-ink">
          <div className="absolute inset-0 ken-burns">
            <Image
              src="/photos/couple-celebration.webp"
              alt="Sakshi and Dr. Sahil smiling together, foreheads touching, amid floral and candlelit decor"
              fill priority sizes="100vw"
              className="object-cover"
              style={{ objectPosition: '38% 28%' }}
            />
          </div>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(10,8,7,0.97) 0%, rgba(10,8,7,0.92) 30%, rgba(10,8,7,0.72) 52%, rgba(10,8,7,0.42) 72%, rgba(10,8,7,0.6) 100%)' }} />
          <HeroAtmosphere />

          <div className="relative z-10 min-h-[92svh] flex flex-col justify-end max-w-3xl mx-auto px-6 md:px-14 pt-36 pb-12">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
              <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
                className="flex items-end gap-3 mb-4" aria-hidden="true">
                {[0, 0.35, 0.7, 0.15, 0.5].map((d, i) => <Diya key={i} delay={d} />)}
              </motion.div>

              <motion.p variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
                className="font-sans uppercase text-[#F3D9A4] mb-3" style={{ fontSize: '0.82rem', letterSpacing: '0.3em', ...textShadow }}>
                {t.tlDiwaliEyebrow}
              </motion.p>

              <motion.h1 variants={{ hidden: { opacity: 0, y: 18, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } } }}
                className="font-serif italic gold-glint text-paper-light leading-[1.08] mb-4"
                style={{ fontSize: 'clamp(2.2rem, 7.4vw, 3.9rem)', ...textShadow }}>
                {t.tlHeading}
              </motion.h1>

              <motion.p variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
                className="font-sans text-paper-light/95 leading-[1.65] mb-5 max-w-xl" style={{ fontSize: 'clamp(1rem, 2.4vw, 1.12rem)', ...textShadow }}>
                {t.tlSub}
              </motion.p>

              <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } }}
                className="font-sans text-paper-light/85 mb-6" style={{ fontSize: '0.92rem', ...textShadow }}>
                {t.eventDates} &nbsp;·&nbsp; Pitampura, Delhi
              </motion.p>

              <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}>
                <button
                  ref={heroCtaRef}
                  onClick={goToForm}
                  className="shimmer-btn w-full sm:w-auto shadow-xl px-9 py-5 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm"
                  style={{ fontSize: '0.86rem', letterSpacing: '0.2em' }}
                >
                  {t.tlCTA} &darr;
                </button>
                <p className="font-sans text-paper-light/75 mt-3" style={{ fontSize: '0.8rem', ...textShadow }}>{t.tlMicro}</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── 3 quick steps ── */}
        <section className="bg-paper px-6 md:px-14 py-10 border-b border-thread-border/50">
          <div className="max-w-xl mx-auto">
            <p className="font-sans uppercase text-burgundy mb-5" style={{ fontSize: '0.78rem', letterSpacing: '0.2em' }}>{t.tlStepsTitle}</p>
            <ol className="space-y-3">
              {steps.map((s, i) => (
                <motion.li key={i}
                  initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  className="flex items-center gap-4 rounded-2xl bg-paper-light border border-thread-border/60 px-4 py-3.5">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-burgundy text-paper-light font-serif flex items-center justify-center" style={{ fontSize: '1.1rem' }}>{i + 1}</span>
                  <span className="font-sans text-ink" style={{ fontSize: '1.02rem' }}>{s}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── The form (shared with /groom) ── */}
        <TravelDetailsSection />

        {/* ── Good to know ── */}
        <section className="bg-paper px-6 md:px-14 py-12 border-t border-thread-border/50">
          <div className="max-w-xl mx-auto">
            <p className="font-sans uppercase text-burgundy mb-5" style={{ fontSize: '0.78rem', letterSpacing: '0.2em' }}>{t.tlReassureTitle}</p>
            <div className="space-y-3">
              {reassurance.map((r) => (
                <div key={r.icon} className="flex gap-4 rounded-2xl bg-paper-light border border-thread-border/60 px-4 py-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/12 border border-gold/40 flex items-center justify-center text-gold">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {r.icon === 'ticket' && <path d="M4 8a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-4V8zM14 6v12" />}
                      {r.icon === 'clock' && <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
                      {r.icon === 'shield' && <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4" />}
                    </svg>
                  </span>
                  <div>
                    <p className="font-serif text-ink mb-1" style={{ fontSize: '1.15rem' }}>{r.title}</p>
                    <p className="font-sans text-stone leading-[1.6]" style={{ fontSize: '0.95rem' }}>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-sans text-stone text-center mt-8" style={{ fontSize: '0.98rem' }}>
              {t.tlQuestions}{' '}
              <Link href={AUDIENCE_CONFIG.groom.faqRoute} className="text-burgundy underline decoration-gold/60 underline-offset-4">{t.faqTeaserCTA} &rarr;</Link>
            </p>
          </div>
        </section>

        <footer className="px-6 py-10 text-center bg-cream">
          <p className="font-display gold-glint text-burgundy leading-none mb-3 break-words" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)' }}>#SakshiKoMilaKinara</p>
          <p className="font-serif italic text-ink" style={{ fontSize: '1.1rem' }}>{t.tlThanks}</p>
        </footer>
      </main>

      {/* Sticky confirm bar — follows the guest through the hero → steps gap */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed bottom-0 left-0 right-0 z-[85] px-4 pt-3 bg-paper/95 backdrop-blur border-t border-thread-border/60"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            <button onClick={goToForm}
              className="shimmer-btn w-full max-w-xl mx-auto block py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm"
              style={{ fontSize: '0.84rem', letterSpacing: '0.18em' }}>
              {t.tlStickyCTA} &darr;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

// Shared "you're done" confirmation for the Travel Details and Mehndi RSVP
// forms. The form it replaces is very tall, so the moment it swaps for this
// card the page collapses and the guest — who was scrolled down at the
// submit button — lands on whatever section is next, with the confirmation
// above the fold. Scrolling it into view on mount (explicitly 'instant':
// globals.css sets scroll-behavior: smooth on <html>, which a smooth scroll
// started mid-layout-shift doesn't survive) keeps the confirmation on screen.
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import SparkleBurst from '@/components/SparkleBurst'

const EASE = [0.25, 0.1, 0.25, 1] as const

export interface FormSuccessLink {
  href: string
  label: string
}

interface FormSuccessProps {
  heading: string
  body: string
  summaryLabel: string
  summary: string[]
  note?: string
  links: FormSuccessLink[]
}

export default function FormSuccess({ heading, body, summaryLabel, summary, note, links }: FormSuccessProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const jump = () => ref.current?.scrollIntoView({ behavior: 'instant', block: 'start' })
    jump()
    // The collapsing form and the entrance animation keep shifting layout for
    // a few hundred ms, so re-anchor once it settles — but only if the card
    // has drifted, so a guest who has already started scrolling isn't yanked.
    const t = setTimeout(() => {
      const top = ref.current?.getBoundingClientRect().top ?? 0
      if (top < 100 || top > 220) jump()
    }, 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      ref={ref}
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="scroll-mt-36 rounded-3xl border-2 border-gold/45 bg-paper-light shadow-lg px-6 py-10 text-center"
    >
      <div className="relative mx-auto mb-6 flex items-center justify-center" style={{ width: 88, height: 88 }}>
        <SparkleBurst count={12} distance={70} />
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald/10 border-2 border-emerald/40"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        />
        <svg viewBox="0 0 48 48" className="relative w-11 h-11 text-emerald" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <motion.path
            d="M12 25l9 9 16-19"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
          />
        </svg>
      </div>

      <h2 className="font-serif italic leading-[1.15] text-charcoal mb-4" style={{ fontSize: 'clamp(2.2rem, 8vw, 3.2rem)' }}>
        {heading}
      </h2>
      <p className="font-sans leading-[1.8] text-stone mx-auto max-w-md" style={{ fontSize: '1.1rem' }}>
        {body.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
      </p>

      {summary.length > 0 && (
        <div className="mt-7 mx-auto max-w-md rounded-2xl bg-blush/20 border border-thread-border/60 px-5 py-4 text-left">
          <p className="font-sans uppercase text-gold mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}>
            {summaryLabel}
          </p>
          <ul className="space-y-1">
            {summary.map((line, i) => (
              <li key={i} className="font-sans text-ink" style={{ fontSize: '1rem' }}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {note && (
        <p className="mt-5 mx-auto max-w-md font-sans leading-[1.7] text-stone/80" style={{ fontSize: '0.92rem' }}>
          {note}
        </p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="shimmer-btn inline-block px-6 py-3.5 border-2 border-burgundy text-burgundy font-sans uppercase hover:bg-burgundy hover:text-paper-light transition-colors duration-300 rounded-sm"
            style={{ fontSize: '0.76rem', letterSpacing: '0.18em' }}
          >
            {l.label} &rarr;
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

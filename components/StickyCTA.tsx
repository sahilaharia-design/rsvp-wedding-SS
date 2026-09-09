'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/Language'

interface StickyCTAProps {
  onCTAClick: () => void
}

export default function StickyCTA({ onCTAClick }: StickyCTAProps) {
  const [inTravelSection, setInTravelSection] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [fieldFocused, setFieldFocused] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    const hero = document.getElementById('hero')
    const travelDetails = document.getElementById('travel-details')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === hero) {
            // Show button once hero is out of view
            setPastHero(!entry.isIntersecting)
          }
          if (entry.target === travelDetails) {
            // Hide while the travel details form (or its success state) is visible
            setInTravelSection(entry.isIntersecting)
          }
        })
      },
      { threshold: 0.15 }
    )

    if (hero) observer.observe(hero)
    if (travelDetails) observer.observe(travelDetails)

    // Hide while a form field has focus — the mobile keyboard is likely open
    // and the bar would otherwise sit on top of it / cover error text.
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) setFieldFocused(true)
    }
    const onFocusOut = () => setFieldFocused(false)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)

    return () => {
      observer.disconnect()
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  const visible = pastHero && !inTravelSection && !fieldFocused

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="fixed bottom-0 left-0 right-0 z-50 px-6 pt-3 md:hidden"
          style={{
            paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 0.75rem))',
            background: 'linear-gradient(to top, #FAF6F0 70%, transparent)',
          }}
        >
          <button
            onClick={onCTAClick}
            className="w-full py-5 bg-burgundy text-paper-light font-sans uppercase shadow-lg hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm"
          style={{ fontSize: '0.95rem', letterSpacing: '0.25em' }}
          >
            {t.confirmTravelBtn}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/Language'

interface StickyCTAProps {
  onCTAClick: () => void
}

export default function StickyCTA({ onCTAClick }: StickyCTAProps) {
  const [visible, setVisible] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    const hero = document.getElementById('hero')
    const travelDetails = document.getElementById('travel-details')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === hero) {
            // Show button once hero is out of view
            setVisible(!entry.isIntersecting)
          }
          if (entry.target === travelDetails && entry.isIntersecting) {
            // Hide once the travel details form is visible
            setVisible(false)
          }
        })
      },
      { threshold: 0.15 }
    )

    if (hero) observer.observe(hero)
    if (travelDetails) observer.observe(travelDetails)

    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-3 md:hidden"
          style={{
            background: 'linear-gradient(to top, #FAF6F0 70%, transparent)',
          }}
        >
          <button
            onClick={onCTAClick}
            className="w-full py-5 bg-marigold text-charcoal font-sans uppercase shadow-lg hover:bg-marigold-dark transition-colors duration-300"
          style={{ fontSize: '0.95rem', letterSpacing: '0.25em' }}
          >
            {t.confirmTravelBtn}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

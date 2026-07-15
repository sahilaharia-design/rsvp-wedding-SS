'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StickyRSVPProps {
  onRSVPClick: () => void
}

export default function StickyRSVP({ onRSVPClick }: StickyRSVPProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    const rsvp = document.getElementById('rsvp')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === hero) {
            // Show button once hero is out of view
            setVisible(!entry.isIntersecting)
          }
          if (entry.target === rsvp && entry.isIntersecting) {
            // Hide once RSVP section is visible
            setVisible(false)
          }
        })
      },
      { threshold: 0.15 }
    )

    if (hero) observer.observe(hero)
    if (rsvp) observer.observe(rsvp)

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
            onClick={onRSVPClick}
            className="w-full py-5 bg-marigold text-charcoal font-sans uppercase shadow-lg hover:bg-marigold-dark transition-colors duration-300"
          style={{ fontSize: '0.95rem', letterSpacing: '0.25em' }}
          >
            Confirm Attendance
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

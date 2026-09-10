'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useGuestSide } from '@/contexts/GuestSide'
import { useLang } from '@/contexts/Language'
import { useMusic } from '@/contexts/Music'

const EASE = [0.25, 0.1, 0.25, 1] as const

/**
 * Shown once the envelope is dismissed (or immediately for a returning
 * visitor who hasn't picked yet), before the guest sees the rest of the
 * homepage. Groom's side (travelling from Mumbai) gets the full travel/stay
 * flow front and centre; bride's side (already in Delhi) gets an
 * events/wardrobe-first homepage. Skippable — nothing on this site may be
 * hard-gated behind a screen.
 */
export default function SideSelect() {
  const { side, ready, setSide } = useGuestSide()
  const { t } = useLang()
  const { start } = useMusic()

  const visible = ready && side === null

  const choose = (next: 'groom' | 'bride') => {
    start() // first real user gesture if the envelope was skipped
    setSide(next)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center px-6 grain-overlay"
          style={{ background: 'linear-gradient(160deg, #FAF6F0 0%, #F2EDE4 55%, #EDE0D2 100%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE } }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <motion.div
            className="w-full max-w-2xl text-center"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <div className="w-10 h-[2px] bg-gold mx-auto mb-6" />
            <h2 className="font-serif text-ink mb-3" style={{ fontSize: 'clamp(1.6rem, 4.2vw, 2.3rem)' }}>
              {t.sideSelectHeading}
            </h2>
            <p className="font-sans text-stone mb-10" style={{ fontSize: '1.05rem' }}>
              {t.sideSelectBody}
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <motion.button
                onClick={() => choose('groom')}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="shimmer-btn group text-left bg-paper-light border-2 border-thread-border/60 hover:border-burgundy rounded-2xl p-7 transition-colors duration-300"
              >
                <span className="font-sans uppercase text-gold" style={{ fontSize: '0.72rem', letterSpacing: '0.2em' }}>
                  {t.sideGroomTag}
                </span>
                <h3 className="font-serif text-ink mt-2 mb-2" style={{ fontSize: '1.4rem' }}>
                  {t.sideGroomLabel}
                </h3>
                <p className="font-sans text-stone" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {t.sideGroomBody}
                </p>
              </motion.button>

              <motion.button
                onClick={() => choose('bride')}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="shimmer-btn group text-left bg-paper-light border-2 border-thread-border/60 hover:border-burgundy rounded-2xl p-7 transition-colors duration-300"
              >
                <span className="font-sans uppercase text-gold" style={{ fontSize: '0.72rem', letterSpacing: '0.2em' }}>
                  {t.sideBrideTag}
                </span>
                <h3 className="font-serif text-ink mt-2 mb-2" style={{ fontSize: '1.4rem' }}>
                  {t.sideBrideLabel}
                </h3>
                <p className="font-sans text-stone" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {t.sideBrideBody}
                </p>
              </motion.button>
            </div>

            <button
              onClick={() => choose('groom')}
              className="mt-8 font-sans text-stone/70 hover:text-ink underline decoration-stone/30 underline-offset-4 transition-colors"
              style={{ fontSize: '0.85rem' }}
            >
              {t.sideSkip}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

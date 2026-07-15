'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMusic } from '@/contexts/Music'

export default function MusicToggle() {
  const { playing, revealed, toggle } = useMusic()

  return (
    <AnimatePresence>
      {revealed && (
        <motion.button
          onClick={toggle}
          aria-label={playing ? 'Mute music' : 'Play music'}
          className="fixed top-4 left-4 md:top-5 md:left-5 z-[90] flex items-center justify-center rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          style={{
            width: 40,
            height: 40,
            background: 'rgba(110,26,40,0.82)',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          }}
        >
          <motion.div
            animate={playing ? { rotate: 360 } : { rotate: 0 }}
            transition={playing ? { duration: 14, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" stroke="rgba(245,237,226,0.35)" strokeWidth="0.7" />
              <circle cx="12" cy="12" r="2.3" fill="#F5EDE2" />
              {playing && (
                <>
                  <path d="M12 3.2v3.4" stroke="#F5EDE2" strokeWidth="0.9" strokeLinecap="round" />
                  <path d="M12 17.4v3.4" stroke="#F5EDE2" strokeWidth="0.9" strokeLinecap="round" />
                  <path d="M3.2 12h3.4" stroke="#F5EDE2" strokeWidth="0.9" strokeLinecap="round" />
                  <path d="M17.4 12h3.4" stroke="#F5EDE2" strokeWidth="0.9" strokeLinecap="round" />
                </>
              )}
            </svg>
          </motion.div>

          {!playing && (
            <svg
              className="absolute"
              width="40" height="40" viewBox="0 0 40 40" fill="none"
            >
              <line x1="12" y1="12" x2="28" y2="28" stroke="#F5EDE2" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  )
}

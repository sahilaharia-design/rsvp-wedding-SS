'use client'

// Hoisted to the root layout (rather than each page) so language selection
// and music playback survive client-side navigation between routes instead
// of resetting to English / going silent on every route change.
import { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import { LanguageProvider } from '@/contexts/Language'
import { MusicProvider } from '@/contexts/Music'

export default function Providers({ children }: { children: ReactNode }) {
  // reducedMotion="user" makes every Framer Motion animation on the site
  // respect the OS-level "reduce motion" setting automatically — elements
  // still reach their end state, just without the transform/transition.
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <MusicProvider>{children}</MusicProvider>
      </LanguageProvider>
    </MotionConfig>
  )
}

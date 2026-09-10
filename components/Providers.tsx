'use client'

// Hoisted to the root layout (rather than each page) so language selection
// and music playback survive client-side navigation between "/" and
// "/themes" instead of resetting to English / going silent on every route
// change.
import { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import { LanguageProvider } from '@/contexts/Language'
import { MusicProvider } from '@/contexts/Music'
import { GuestSideProvider } from '@/contexts/GuestSide'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user" makes every Framer Motion animation on the site
    // respect the OS-level "reduce motion" setting automatically — elements
    // still reach their end state, just without the transform/transition.
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <MusicProvider>
          <GuestSideProvider>{children}</GuestSideProvider>
        </MusicProvider>
      </LanguageProvider>
    </MotionConfig>
  )
}

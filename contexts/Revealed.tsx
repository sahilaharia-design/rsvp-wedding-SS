'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

/**
 * Tracks whether the Reveal sequence (envelope → side question → welcome)
 * has actually finished. Homepage sections read this to time their own
 * entrance animations to the moment the guest actually sees them — not to
 * their own mount, which happens instantly while still hidden behind the
 * full-screen overlay.
 */
const RevealedContext = createContext<{ revealed: boolean; setRevealed: (v: boolean) => void }>({
  revealed: false,
  setRevealed: () => {},
})

export function RevealedProvider({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <RevealedContext.Provider value={{ revealed, setRevealed }}>
      {children}
    </RevealedContext.Provider>
  )
}

export function useRevealed() {
  return useContext(RevealedContext)
}

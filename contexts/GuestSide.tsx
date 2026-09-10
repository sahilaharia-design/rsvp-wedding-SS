'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type GuestSide = 'groom' | 'bride' | null

const STORAGE_KEY = 'std-guest-side'

interface GuestSideContextValue {
  side: GuestSide
  /** false until localStorage has been read on mount — avoids flashing the
      picker for returning guests before their saved choice loads. */
  ready: boolean
  setSide: (side: GuestSide) => void
  /** Reopen the picker (e.g. from a "switch" control) without losing the
      current choice until the guest picks again. */
  reset: () => void
}

const GuestSideContext = createContext<GuestSideContextValue>({
  side: null,
  ready: false,
  setSide: () => {},
  reset: () => {},
})

export function GuestSideProvider({ children }: { children: ReactNode }) {
  const [side, setSideState] = useState<GuestSide>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'groom' || stored === 'bride') {
        setSideState(stored)
      } else if (typeof window !== 'undefined' && window.location.hash === '#travel-details') {
        // A direct travel-details link is already a clear signal — don't
        // interrupt it with the side picker; default quietly to the full
        // (groom's-side) experience so the form is reachable immediately.
        setSideState('groom')
      }
    } catch {
      // localStorage unavailable (private mode etc.) — picker just shows every visit
    }
    setReady(true)
  }, [])

  const setSide = useCallback((next: GuestSide) => {
    setSideState(next)
    try {
      if (next) localStorage.setItem(STORAGE_KEY, next)
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore — in-memory state still works for this visit
    }
  }, [])

  const reset = useCallback(() => {
    setSide(null)
    try {
      // Also clear the "envelope already opened this session" flag, so
      // the "switch view" control genuinely starts the whole ceremony
      // over (envelope + question) rather than only reopening the
      // question underneath an envelope that silently never reappears.
      sessionStorage.removeItem('std-revealed')
    } catch {
      // ignore
    }
  }, [setSide])

  return (
    <GuestSideContext.Provider value={{ side, ready, setSide, reset }}>
      {children}
    </GuestSideContext.Provider>
  )
}

export function useGuestSide() {
  return useContext(GuestSideContext)
}

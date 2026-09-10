'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type GuestSide = 'groom' | 'bride' | null

const STORAGE_KEY = 'std-guest-side'

interface GuestSideContextValue {
  side: GuestSide
  /** false until sessionStorage has been read on mount — avoids flashing
      the picker before an already-answered-this-session choice loads. */
  ready: boolean
  setSide: (side: GuestSide) => void
  /** Reopen the picker (e.g. from a "start over" control) without losing
      the current choice until the guest picks again. */
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
      // Deliberately sessionStorage, not localStorage: the choice should
      // only be remembered for the current browser tab/session, not
      // forever. A permanent choice meant every future visit — on the
      // couple's own devices while testing, and for any guest checking
      // the site again another day — silently skipped the question with
      // no way to tell it had even asked before.
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored === 'groom' || stored === 'bride') {
        setSideState(stored)
      } else if (typeof window !== 'undefined' && window.location.hash === '#travel-details') {
        // A direct travel-details link is already a clear signal — don't
        // interrupt it with the side picker; default quietly to the full
        // (groom's-side) experience so the form is reachable immediately.
        setSideState('groom')
      }
    } catch {
      // sessionStorage unavailable (private mode etc.) — picker just shows every visit
    }
    setReady(true)
  }, [])

  const setSide = useCallback((next: GuestSide) => {
    setSideState(next)
    try {
      if (next) sessionStorage.setItem(STORAGE_KEY, next)
      else sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore — in-memory state still works for this visit
    }
  }, [])

  const reset = useCallback(() => {
    setSide(null)
    try {
      // Also clear the "envelope already opened this session" flag, so
      // the "start over" control genuinely restarts the whole ceremony —
      // envelope included — not just the question underneath an envelope
      // that would otherwise never reappear this session.
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

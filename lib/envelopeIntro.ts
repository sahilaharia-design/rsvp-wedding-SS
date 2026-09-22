// Shared with Hero.tsx so its entrance animation can be timed to play as
// the envelope's payoff instead of finishing invisibly underneath it.
export const ENVELOPE_STORAGE_KEY = 'std-envelope-shown'

// How long EnvelopeIntro spends in each stage after the guest taps to
// open — the single source of truth both files read from, so they can
// never silently drift out of sync with each other.
export const ENVELOPE_STAGE_MS = {
  opening: 750,
  welcome: 1500,
  leaving: 550,
} as const

export const ENVELOPE_SEQUENCE_MS =
  ENVELOPE_STAGE_MS.opening + ENVELOPE_STAGE_MS.welcome + ENVELOPE_STAGE_MS.leaving

// Pure read, no side effects — mirrors the same decision EnvelopeIntro's
// own effect makes, so Hero can pick its entrance delay before paint. If
// this is ever wrong for any reason, the *worst* case is a slightly
// mistimed entrance animation — it still always plays, so this can never
// produce the old "stuck invisible" bug class.
export function willShowEnvelopeIntro(): boolean {
  if (typeof window === 'undefined') return false
  if (window.location.hash.length > 0) return false
  try {
    return sessionStorage.getItem(ENVELOPE_STORAGE_KEY) !== '1'
  } catch {
    return true
  }
}

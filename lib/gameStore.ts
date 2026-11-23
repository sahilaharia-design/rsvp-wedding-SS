// Tiny client-side store for the Excitement Hub (tap count + which "road to
// the wedding" tasks a guest has finished). Lives in localStorage only — no
// account, nothing leaves the device. Every read/write is wrapped, because
// storage can be blocked (private windows, strict settings) and the site must
// work identically without it.
export interface GameState {
  taps: number
  done: Record<string, boolean>
}

const KEY = 'ss-excite-v1'
const EVENT = 'ss-game-change'
const EMPTY: GameState = { taps: 0, done: {} }

export function readGame(): GameState {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const p = JSON.parse(raw)
    return { taps: Number.isFinite(p.taps) ? Math.max(0, Math.min(p.taps, 100000)) : 0, done: p.done && typeof p.done === 'object' ? p.done : {} }
  } catch {
    return EMPTY
  }
}

function write(next: GameState) {
  try { window.localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* storage blocked — in-memory state still updates */ }
  window.dispatchEvent(new Event(EVENT))
}

export function addTap(): GameState {
  const s = readGame(); const next = { ...s, taps: s.taps + 1 }; write(next); return next
}
export function markTask(id: string, value = true) {
  const s = readGame()
  if (!!s.done[id] === value) return
  write({ ...s, done: { ...s.done, [id]: value } })
}
export function subscribeGame(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener('storage', cb) }
}

'use client'

import { createContext, useContext, useRef, useState, useCallback, useEffect, ReactNode } from 'react'

const MUTE_KEY = 'std-music-muted'
const STARTED_KEY = 'std-music-started'

interface MusicContextValue {
  playing: boolean
  revealed: boolean
  start: () => void
  toggle: () => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

// Source: "Indian Classical Music - Sitar" by Aar_Music, via Pixabay
// (Pixabay Content License — free for commercial use, no attribution required)
export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(STARTED_KEY)) {
      setRevealed(true)
    }
  }, [])

  const start = useCallback(() => {
    setRevealed(true)
    sessionStorage.setItem(STARTED_KEY, '1')
    const audio = audioRef.current
    if (!audio) return
    if (localStorage.getItem(MUTE_KEY) === '1') return
    audio.volume = 0.5
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => {
        setPlaying(true)
        localStorage.setItem(MUTE_KEY, '0')
      }).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
      localStorage.setItem(MUTE_KEY, '1')
    }
  }, [])

  return (
    <MusicContext.Provider value={{ playing, revealed, start, toggle }}>
      {children}
      <audio ref={audioRef} loop preload="none">
        <source src="/audio/sitar-theme.m4a" type="audio/mp4" />
        <source src="/audio/sitar-theme.mp3" type="audio/mpeg" />
      </audio>
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used within MusicProvider')
  return ctx
}

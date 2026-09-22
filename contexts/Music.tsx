'use client'

import { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react'

const MUTE_KEY = 'std-music-muted'

interface MusicContextValue {
  playing: boolean
  toggle: () => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

// Source: "Indian Classical Music - Sitar" by Aar_Music, via Pixabay
// (Pixabay Content License — free for commercial use, no attribution required)
// Never autoplays — only ever starts from a direct click on MusicToggle,
// which is itself a valid user gesture for the browser's autoplay policy.
export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.volume = 0.5
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
    <MusicContext.Provider value={{ playing, toggle }}>
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

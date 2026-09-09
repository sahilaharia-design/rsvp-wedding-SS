'use client'

import { useLang, Lang } from '@/contexts/Language'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
  { code: 'gu', label: 'ગુ' },
]

interface LanguageSwitcherProps {
  /** 'dark' (default) sits on a photo/dark background; 'light' sits on paper/ivory nav bars. */
  variant?: 'dark' | 'light'
}

export default function LanguageSwitcher({ variant = 'dark' }: LanguageSwitcherProps) {
  const { lang, setLang } = useLang()
  const isLight = variant === 'light'

  return (
    <div className={`flex gap-0.5 rounded-full px-1 py-1 flex-shrink-0 ${isLight ? 'bg-ink/8' : 'bg-black/25 backdrop-blur-sm'}`}>
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`
            px-2.5 py-1 md:px-3 md:py-1.5 rounded-full font-sans text-[10px] md:text-[11px] tracking-wide transition-all duration-200
            ${lang === code
              ? (isLight ? 'bg-burgundy text-paper-light font-medium' : 'bg-white/90 text-charcoal font-medium')
              : (isLight ? 'text-ink/60 hover:text-ink' : 'text-white/60 hover:text-white/90')}
          `}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

'use client'

import { useLang, Lang } from '@/contexts/Language'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
  { code: 'gu', label: 'ગુ' },
]

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()

  return (
    <div className="fixed top-4 right-4 md:top-5 md:right-5 z-[90] flex gap-0.5 bg-black/25 backdrop-blur-sm rounded-full px-1 py-1">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`
            px-2.5 py-1 md:px-3 md:py-1.5 rounded-full font-sans text-[10px] md:text-[11px] tracking-wide transition-all duration-200
            ${lang === code
              ? 'bg-white/90 text-charcoal font-medium'
              : 'text-white/60 hover:text-white/90'}
          `}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-allura)', 'cursive'],
      },
      colors: {
        cream: '#FAF6F0',
        ivory: '#F2EDE4',
        charcoal: '#18181B',
        stone: '#4A4540',
        'warm-gray': '#8B8580',
        blush: '#D4A99A',
        'rose-gold': '#C4956A',
        parchment: '#EDE8DF',
        burgundy: '#6E1A28',
        'dark-brown': '#2C1810',
        'kinara-bg': '#F5EDE2',
        marigold: '#E2971F',
        'marigold-dark': '#B97914',
      },
      letterSpacing: {
        luxury: '0.3em',
        wide: '0.2em',
      },
      animation: {
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config

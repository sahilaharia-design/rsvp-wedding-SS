import type { Metadata } from 'next'
import ThemesPageClient from '@/components/ThemesPageClient'

export const metadata: Metadata = {
  title: 'The Four Chapters & What to Wear — Sakshi & Dr. Sahil',
  description:
    'From a solo journey to a shared forever — the story behind Bloom, Promise, Romance & Legacy, and what to wear to each. 20–22 January 2027 · Delhi.',
  openGraph: {
    title: 'The Four Chapters & What to Wear — Sakshi & Dr. Sahil',
    description: 'The story behind each celebration, and what to wear. 20–22 January 2027 · Delhi.',
    type: 'website',
    url: 'https://sakshisahil.com/themes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Four Chapters & What to Wear — Sakshi & Dr. Sahil',
    description: 'The story behind each celebration, and what to wear. 20–22 January 2027 · Delhi.',
  },
}

export default function ThemesPage() {
  return <ThemesPageClient />
}

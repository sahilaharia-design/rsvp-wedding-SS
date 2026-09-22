import type { Metadata } from 'next'
import AudienceHome from '@/components/AudienceHome'

export const metadata: Metadata = {
  title: 'Sakshi & Dr. Sahil — Sakshi’s Guests',
  description: 'Explore our four celebrations and what to wear. Wed 20 – Fri 22 January 2027 · Pitampura, Delhi.',
  openGraph: {
    title: 'Sakshi & Dr. Sahil — #SakshiKoMilaKinara',
    description: 'Explore our four celebrations and what to wear.',
    type: 'website',
    url: 'https://sakshisahil.com/bride',
  },
}

export default function BridePage() {
  return <AudienceHome audience="bride" />
}

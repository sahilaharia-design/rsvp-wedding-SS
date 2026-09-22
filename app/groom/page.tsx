import type { Metadata } from 'next'
import AudienceHome from '@/components/AudienceHome'

export const metadata: Metadata = {
  title: 'Sakshi & Dr. Sahil — Sahil’s Guests',
  description: 'Please share your travel details by 20 October 2026. Wed 20 – Fri 22 January 2027 · Pitampura, Delhi.',
  openGraph: {
    title: 'Sakshi & Dr. Sahil — #SakshiKoMilaKinara',
    description: 'Confirm your travel details and explore our celebrations.',
    type: 'website',
    url: 'https://sakshisahil.com/groom',
  },
}

export default function GroomPage() {
  return <AudienceHome audience="groom" />
}

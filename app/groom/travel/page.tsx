import type { Metadata } from 'next'
import TravelLanding from '@/components/TravelLanding'

// The shareable "confirm your travel" link for the groom's guests. This is
// a focused landing page (Diwali greeting + the travel form) rather than a
// redirect to the full homepage — one job: get the travel details in.
export const metadata: Metadata = {
  title: 'Confirm your travel — Sakshi & Dr. Sahil',
  description: 'Happy Diwali! Please confirm your travel details by 15 November 2026 — it takes about 2 minutes. Wed 20 – Fri 22 January 2027 · Pitampura, Delhi.',
  openGraph: {
    title: 'Happy Diwali — please confirm your travel · Sakshi & Dr. Sahil',
    description: 'It takes about 2 minutes. Wed 20 – Fri 22 January 2027 · Pitampura, Delhi.',
    type: 'website',
    url: 'https://sakshisahil.com/groom/travel',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy Diwali — please confirm your travel · Sakshi & Dr. Sahil',
    description: 'It takes about 2 minutes. Wed 20 – Fri 22 January 2027 · Pitampura, Delhi.',
    images: ['/opengraph-image'],
  },
}

export default function GroomTravelPage() {
  return <TravelLanding />
}

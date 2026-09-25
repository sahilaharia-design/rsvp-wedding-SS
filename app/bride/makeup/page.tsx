import type { Metadata } from 'next'
import MakeupGuidePage from '@/components/MakeupGuidePage'

export const metadata: Metadata = {
  title: 'For the Lovely Ladies — Makeup Guide — Sakshi & Dr. Sahil',
  description: 'A few nearby Pitampura salons to make getting ready easier, or choose an artist you already love. 20 & 21 January · 3–5 pm.',
  openGraph: {
    title: 'For the Lovely Ladies — Makeup Guide',
    description: 'A few nearby Pitampura salons to make getting ready easier.',
    type: 'website',
    url: 'https://sakshisahil.com/bride/makeup',
    images: ['/opengraph-image'],
  },
}

export default function BrideMakeupPage() {
  return <MakeupGuidePage audience="bride" />
}

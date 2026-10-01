import type { Metadata } from 'next'
import FaqPageClient from '@/components/FaqPageClient'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — Sakshi & Dr. Sahil',
  description: 'Everything about the celebrations, travel, and what to wear — all in one place. Wed 20 – Thu 21 January 2027 · Pitampura, Delhi.',
  openGraph: {
    title: 'Frequently Asked Questions — Sakshi & Dr. Sahil',
    description: 'Everything about the celebrations, travel, and what to wear — all in one place.',
    type: 'website',
    url: 'https://sakshisahil.com/bride/faq',
    images: ['/og/faq.jpg'],
  },
}

export default function BrideFaqPage() {
  return <FaqPageClient audience="bride" />
}

import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, Allura } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

const allura = Allura({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-allura',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sakshisahil.com'),
  title: 'Sakshi & Dr. Sahil — #SakshiKoMilaKinara',
  description:
    'Sakshi & Dr. Sahil\'s wedding · Wed 20 – Fri 22 January 2027 · Pitampura, Delhi, India. Join us for four celebrations — see the story, what to wear, and how to plan your visit at sakshisahil.com',
  openGraph: {
    title: 'Sakshi & Dr. Sahil — #SakshiKoMilaKinara',
    description: 'Wed 20 – Fri 22 January 2027 · Pitampura, Delhi · Four celebrations, one shared forever. sakshisahil.com',
    type: 'website',
    url: 'https://sakshisahil.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sakshi & Dr. Sahil — #SakshiKoMilaKinara',
    description: 'Wed 20 – Fri 22 January 2027 · Pitampura, Delhi, India — four celebrations, one shared forever.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${allura.variable}`}>
      <body className="bg-cream text-charcoal antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

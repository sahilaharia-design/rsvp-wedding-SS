import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, Allura } from 'next/font/google'
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
  title: '#SakshiKoMilaKinara — Save The Date',
  description:
    'Sakshi & Dr. Sahil — 20–21 January 2027, Delhi, India. Please save the date and confirm your attendance.',
  openGraph: {
    title: '#SakshiKoMilaKinara',
    description: 'Sakshi ❤️ Dr. Sahil · 20–21 January 2027 · Delhi, India',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${allura.variable}`}>
      <body className="bg-cream text-charcoal antialiased">{children}</body>
    </html>
  )
}

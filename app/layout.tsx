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
  metadataBase: new URL('https://sakshisahil.com'),
  title: 'Save The Date — #SakshiKoMilaKinara',
  description:
    'Sakshi & Dr. Sahil are getting married! Wed 20 – Fri 22 January 2027 · Pitampura, Delhi, India. Confirm your travel details at sakshisahil.com',
  openGraph: {
    title: '#SakshiKoMilaKinara — Save the Date',
    description: 'Sakshi & Dr. Sahil · Wed 20 – Fri 22 January 2027 · Pitampura, Delhi · Confirm your travel details at sakshisahil.com',
    type: 'website',
    url: 'https://sakshisahil.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: '#SakshiKoMilaKinara — Save the Date',
    description: 'Sakshi & Dr. Sahil · Wed 20 – Fri 22 January 2027 · Pitampura, Delhi, India',
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

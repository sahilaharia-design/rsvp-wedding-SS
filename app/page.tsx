import type { Metadata } from 'next'
import RootPicker from '@/components/RootPicker'

export const metadata: Metadata = {
  title: 'Sakshi & Dr. Sahil — #SakshiKoMilaKinara',
  description: 'Welcome to our celebrations. Wed 20 – Fri 22 January 2027 · Pitampura, Delhi.',
}

export default function Home() {
  return <RootPicker />
}

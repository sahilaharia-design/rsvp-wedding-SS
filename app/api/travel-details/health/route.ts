import { NextResponse } from 'next/server'
import { probeSheet } from '@/lib/sheet'

// TEMPORARY diagnostic — reports whether the sheet backend answers sensibly.
// Writes nothing and reveals no URL or data. Remove once diagnosed.
export const dynamic = 'force-dynamic'
export async function GET() {
  return NextResponse.json(await probeSheet(), { headers: { 'Cache-Control': 'no-store' } })
}

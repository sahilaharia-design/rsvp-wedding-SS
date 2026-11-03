import { NextRequest, NextResponse } from 'next/server'
import { postToSheet } from '@/lib/sheet'

// Guests are in India: run next to them (Mumbai) so photo uploads reach the server quickly.
export const preferredRegion = 'bom1'

// Same Apps Script Web App as /api/travel-details — one new 'mehndi_rsvp'
// action, writing to its own "Mehndi RSVP" tab. See google-apps-script.gs.
type GuestInput = {
  name?: string
  status?: 'joining' | 'unable' | 'not_sure'
  hand_preference?: 'one_hand' | 'both_hands' | null
}

export async function POST(request: NextRequest) {
  let body: {
    audience?: 'bride' | 'groom'
    submitted_by_name?: string
    submitted_by_mobile?: string
    guests?: GuestInput[]
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { audience, submitted_by_name, submitted_by_mobile, guests } = body

  if (!submitted_by_name?.trim()) {
    return NextResponse.json({ error: 'Please share your name.' }, { status: 400 })
  }
  // Mobile is optional — only validated (and normalised) when provided.
  const rawMobile = submitted_by_mobile?.trim() ?? ''
  let normalisedMobile = ''
  if (rawMobile) {
    normalisedMobile = rawMobile.replace(/\D/g, '').slice(-10)
    if (normalisedMobile.length < 10) {
      return NextResponse.json({ error: 'Please enter a valid mobile number, or leave it blank.' }, { status: 400 })
    }
  }
  if (!Array.isArray(guests) || guests.length === 0) {
    return NextResponse.json({ error: 'Please add at least one guest.' }, { status: 400 })
  }

  const cleanGuests: { name: string; status: string; hand_preference: string | null }[] = []
  for (const g of guests) {
    const name = g.name?.trim()
    if (!name) {
      return NextResponse.json({ error: 'Every guest needs a name.' }, { status: 400 })
    }
    if (!g.status || !['joining', 'unable', 'not_sure'].includes(g.status)) {
      return NextResponse.json({ error: `Please confirm whether ${name} is joining.` }, { status: 400 })
    }
    if (g.status === 'joining' && g.hand_preference !== 'one_hand' && g.hand_preference !== 'both_hands') {
      return NextResponse.json({ error: `Please pick a Mehndi preference for ${name}.` }, { status: 400 })
    }
    cleanGuests.push({
      name,
      status: g.status,
      hand_preference: g.status === 'joining' ? (g.hand_preference ?? null) : null,
    })
  }

  const result = await postToSheet({
    action: 'mehndi_rsvp',
    audience: audience === 'bride' || audience === 'groom' ? audience : '',
    submitted_by_name: submitted_by_name.trim(),
    submitted_by_mobile: normalisedMobile,
    group_id: crypto.randomUUID(),
    guests: cleanGuests,
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? 'Something went wrong. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, guestCount: cleanGuests.length })
}

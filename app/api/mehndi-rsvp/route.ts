import { NextRequest, NextResponse } from 'next/server'

// Same Apps Script Web App as /api/travel-details — one new 'mehndi_rsvp'
// action, writing to its own "Mehndi RSVP" tab. See google-apps-script.gs.
async function postToSheet(payload: Record<string, unknown>) {
  const url = process.env.TRAVEL_APPS_SCRIPT_URL
  if (!url || url === 'PENDING') {
    return { ok: false, error: 'Not configured yet — please try again shortly.' }
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error('Apps Script non-OK response:', res.status)
      return { ok: false, error: 'Something went wrong. Please try again.' }
    }
    const json = await res.json().catch(() => ({ ok: true }))
    return json
  } catch (e) {
    console.error('Apps Script append error:', e)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}

type GuestInput = {
  name?: string
  status?: 'joining' | 'unable' | 'not_sure'
  hand_preference?: 'one_hand' | 'both_hands' | null
}

export async function POST(request: NextRequest) {
  let body: {
    submitted_by_name?: string
    submitted_by_mobile?: string
    guests?: GuestInput[]
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { submitted_by_name, submitted_by_mobile, guests } = body

  if (!submitted_by_name?.trim() || !submitted_by_mobile?.trim()) {
    return NextResponse.json({ error: 'Please share your name and mobile number.' }, { status: 400 })
  }
  const normalisedMobile = submitted_by_mobile.replace(/\D/g, '').slice(-10)
  if (normalisedMobile.length < 10) {
    return NextResponse.json({ error: 'Please enter a valid mobile number.' }, { status: 400 })
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

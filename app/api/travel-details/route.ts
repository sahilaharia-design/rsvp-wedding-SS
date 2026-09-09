import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(request: NextRequest) {
  let body: {
    full_name?: string
    mobile_number?: string
    arrival_mode?: string
    arrival_date?: string
    arrival_time?: string
    travel_number?: string
    departure_date?: string
    guest_names?: string
    notes?: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const {
    full_name, mobile_number, arrival_mode, arrival_date,
    arrival_time, travel_number, departure_date, guest_names, notes,
  } = body

  if (!full_name?.trim() || !mobile_number?.trim()) {
    return NextResponse.json({ error: 'Please fill in your name and mobile number.' }, { status: 400 })
  }

  const normalised = mobile_number.replace(/\D/g, '').slice(-10)
  if (normalised.length < 10) {
    return NextResponse.json({ error: 'Please enter a valid mobile number.' }, { status: 400 })
  }

  if (!arrival_mode || !arrival_date?.trim()) {
    return NextResponse.json({ error: 'Please let us know how and when you\'re arriving.' }, { status: 400 })
  }

  const result = await postToSheet({
    action: 'travel_info',
    full_name: full_name.trim(),
    mobile: normalised,
    arrival_mode,
    arrival_date: arrival_date.trim(),
    arrival_time: arrival_time?.trim() ?? '',
    travel_number: travel_number?.trim() ?? '',
    departure_date: departure_date?.trim() ?? '',
    guest_names: guest_names?.trim() ?? '',
    notes: notes?.trim() ?? '',
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? 'Something went wrong. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, mobile: normalised })
}

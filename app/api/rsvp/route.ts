import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'

// ── Local JSON fallback (dev only — Vercel FS is read-only) ──────────────────
const IS_DEV = process.env.NODE_ENV === 'development'
const LOCAL_FILE = IS_DEV
  ? require('path').join(process.cwd(), '.rsvp-local.json')
  : ''

function localRead(): Record<string, unknown>[] {
  if (!IS_DEV) return []
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf8'))
  } catch {
    return []
  }
}

function localWrite(rows: Record<string, unknown>[]) {
  if (!IS_DEV) return
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(rows, null, 2))
}
// ────────────────────────────────────────────────────────────────────────────

async function appendToSheet(payload: Record<string, unknown>) {
  const url = process.env.APPS_SCRIPT_URL
  if (!url || url === 'PENDING') return
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error('Apps Script non-OK response:', res.status)
    }
  } catch (e) {
    console.error('Apps Script append error:', e)
  }
}

// ────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: {
    full_name?: string
    mobile_number?: string
    attending?: boolean
    guest_count?: number
    guest_names?: string[]
    travel_mode?: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { full_name, mobile_number, attending, guest_count, guest_names, travel_mode } = body

  if (!full_name?.trim() || !mobile_number?.trim() || attending === undefined) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const normalised = mobile_number.replace(/\D/g, '').slice(-10)
  if (normalised.length < 10) {
    return NextResponse.json({ error: 'Please enter a valid mobile number.' }, { status: 400 })
  }

  const useSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  if (useSupabase) {
    const { supabaseAdmin } = await import('@/lib/supabase')
    const db = supabaseAdmin()

    const { data: existing } = await db
      .from('rsvp')
      .select('id')
      .eq('mobile_number', normalised)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'This number has already been submitted. Thank you!' },
        { status: 409 }
      )
    }

    const { error } = await db.from('rsvp').insert({
      full_name: full_name.trim(),
      mobile_number: normalised,
      attending,
      guest_count: attending ? (guest_count ?? 0) : null,
      guest_names: attending && guest_names?.length ? guest_names.join(', ') : null,
      travel_mode: attending ? (travel_mode ?? null) : null,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }
  } else {
    const rows = localRead()
    const duplicate = rows.find((r) => r.mobile_number === normalised)
    if (duplicate) {
      return NextResponse.json(
        { error: 'This number has already been submitted. Thank you!' },
        { status: 409 }
      )
    }
    rows.push({
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      full_name: full_name.trim(),
      mobile_number: normalised,
      attending,
      guest_count: attending ? (guest_count ?? 0) : null,
      guest_names: attending && guest_names?.length ? guest_names.join(', ') : null,
      travel_mode: attending ? (travel_mode ?? null) : null,
    })
    localWrite(rows)
  }

  // Await the sheet append — do NOT use void. Vercel terminates on return.
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  await appendToSheet({
    timestamp,
    full_name: full_name.trim(),
    mobile: normalised,
    attending: attending ? 'Yes' : 'No',
    guests: attending ? (guest_count ?? 0) : 0,
    guest_names: attending && guest_names?.length
      ? guest_names.filter((n) => n.trim()).join(' | ')
      : '',
    travel_mode: attending ? (travel_mode ?? '') : '',
  })

  return NextResponse.json({ success: true })
}

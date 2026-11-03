import { NextRequest, NextResponse } from 'next/server'
import { postToSheet } from '@/lib/sheet'

// Base64 is ~1.37x the raw file size — this caps raw files at roughly 3.2MB,
// comfortably under typical serverless request body limits with headroom
// for JSON field overhead.
const MAX_BASE64_LEN = 4_500_000

export async function POST(request: NextRequest) {
  let body: {
    mobile_number?: string
    full_name?: string
    filename?: string
    mime_type?: string
    data?: string // base64, no "data:...;base64," prefix
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { mobile_number, full_name, filename, mime_type, data } = body

  if (!mobile_number?.trim() || !data) {
    return NextResponse.json({ error: 'Missing file or mobile number.' }, { status: 400 })
  }

  if (data.length > MAX_BASE64_LEN) {
    return NextResponse.json(
      { error: 'That file is too large. Please upload a clearer, smaller photo (under 3MB).' },
      { status: 413 }
    )
  }

  const normalised = mobile_number.replace(/\D/g, '').slice(-10)
  const result = await postToSheet({
    action: 'travel_file',
    mobile: normalised,
    full_name: full_name?.trim().slice(0, 100) ?? '',
    filename: (filename ?? 'id-document').slice(0, 120),
    mime_type: mime_type ?? 'application/octet-stream',
    data,
  }, 60_000)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}

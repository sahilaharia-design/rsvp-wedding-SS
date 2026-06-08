import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// ── Local JSON fallback (dev without Supabase) ──────────────────────────────
const LOCAL_FILE = path.join(process.cwd(), '.rsvp-local.json')

function localRead(): Record<string, unknown>[] {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf8'))
  } catch {
    return []
  }
}

function localWrite(rows: Record<string, unknown>[]) {
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(rows, null, 2))
}
// ────────────────────────────────────────────────────────────────────────────

async function appendToSheet(payload: Record<string, unknown>) {
  const url = process.env.APPS_SCRIPT_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    })
  } catch (e) {
    console.error('Apps Script append error:', e)
  }
}

async function sendThankYouEmail(name: string, email: string, attending: boolean) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return
  try {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const attendingHtml = attending
      ? `<p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.85;color:#4A4540;margin:0 0 14px;">
           Thank you for confirming your presence. We are so looking forward to celebrating with you in Delhi, India.
         </p>
         <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.85;color:#4A4540;margin:0;">
           We will be in touch with further details as we get closer to January 2027.
         </p>`
      : `<p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.85;color:#4A4540;margin:0;">
           We understand, and thank you so much for letting us know. You will be missed — we hope to celebrate with you again soon.
         </p>`

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#FAF6F0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF6F0;padding:40px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background-color:#FAF6F0;">
        <tr><td align="center" style="padding:40px 40px 24px;">
          <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:5px;text-transform:uppercase;color:#8B8580;margin:0 0 16px;">Save the Date</p>
          <div style="width:40px;height:1px;background:#D4A99A;margin:0 auto 18px;"></div>
          <h1 style="font-family:Georgia,serif;font-style:italic;font-size:32px;color:#18181B;margin:0 0 10px;line-height:1.1;">#SakshiKoMilaKinara</h1>
          <p style="font-family:Georgia,serif;font-size:17px;color:#4A4540;margin:0;">Sakshi &amp; Dr. Sahil</p>
        </td></tr>
        <tr><td style="padding:0 40px;"><div style="height:1px;background:#EDE8DF;"></div></td></tr>
        <tr><td style="padding:28px 40px;">
          <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.85;color:#4A4540;margin:0 0 14px;">Dear ${name},</p>
          ${attendingHtml}
        </td></tr>
        <tr><td style="padding:0 40px 28px;">
          <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.85;color:#4A4540;margin:0 0 4px;">With love,</p>
          <p style="font-family:Georgia,serif;font-size:16px;color:#18181B;margin:0 0 6px;">Sakshi &amp; Dr. Sahil</p>
          <p style="font-family:Georgia,serif;font-style:italic;font-size:14px;color:#D4A99A;margin:0;">#SakshiKoMilaKinara</p>
        </td></tr>
        <tr><td style="padding:0 40px 40px;">
          <div style="border-top:1px solid #EDE8DF;border-bottom:1px solid #EDE8DF;padding:20px 0;text-align:center;">
            <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#8B8580;margin:0 0 8px;">The Celebration</p>
            <p style="font-family:Georgia,serif;font-size:20px;color:#18181B;margin:0 0 4px;">20 &ndash; 21 January 2027</p>
            <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#8B8580;margin:0;">Delhi, India</p>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    await transporter.sendMail({
      from: `"Sakshi & Dr. Sahil" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '#SakshiKoMilaKinara — Thank You',
      html,
    })
  } catch (e) {
    console.error('Email send error:', e)
  }
}

// ────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: {
    full_name?: string
    mobile_number?: string
    email?: string
    attending?: boolean
    guest_count?: number
    travel_mode?: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { full_name, mobile_number, email, attending, guest_count, travel_mode } = body

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
      email: email?.trim() ?? null,
      attending,
      guest_count: attending ? (guest_count ?? 1) : null,
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
      email: email?.trim() ?? null,
      attending,
      guest_count: attending ? (guest_count ?? 1) : null,
      travel_mode: attending ? (travel_mode ?? null) : null,
    })
    localWrite(rows)
  }

  // Fire-and-forget — RSVP response is not gated on these
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  void appendToSheet({
    timestamp,
    full_name: full_name.trim(),
    mobile: normalised,
    email: email?.trim() ?? '',
    attending: attending ? 'Yes' : 'No',
    guests: attending ? (guest_count ?? 1) : 0,
    travel_mode: attending ? (travel_mode ?? '') : '',
  })

  if (email?.trim()) {
    void sendThankYouEmail(full_name.trim(), email.trim(), attending)
  }

  return NextResponse.json({ success: true })
}

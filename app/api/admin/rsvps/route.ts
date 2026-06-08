import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const LOCAL_FILE = path.join(process.cwd(), '.rsvp-local.json')

function localRead(): Record<string, unknown>[] {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf8'))
  } catch {
    return []
  }
}

function checkAuth(request: NextRequest) {
  return request.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const useSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  let data: Record<string, unknown>[]

  if (useSupabase) {
    const { supabaseAdmin } = await import('@/lib/supabase')
    const db = supabaseAdmin()
    const { data: rows, error } = await db
      .from('rsvp')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    data = rows
  } else {
    data = localRead().sort(
      (a, b) =>
        new Date(b.created_at as string).getTime() -
        new Date(a.created_at as string).getTime()
    )
  }

  const attending = data.filter((r) => r.attending)
  const declined = data.filter((r) => !r.attending)
  const totalGuests = attending.reduce((sum, r) => sum + ((r.guest_count as number) ?? 0), 0)

  return NextResponse.json({
    stats: {
      totalResponses: data.length,
      totalAttending: attending.length,
      totalDeclined: declined.length,
      totalGuests,
    },
    rows: data,
  })
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const useSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  let data: Record<string, unknown>[]

  if (useSupabase) {
    const { supabaseAdmin } = await import('@/lib/supabase')
    const db = supabaseAdmin()
    const { data: rows, error } = await db
      .from('rsvp')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    data = rows
  } else {
    data = localRead().sort(
      (a, b) =>
        new Date(a.created_at as string).getTime() -
        new Date(b.created_at as string).getTime()
    )
  }

  const csv = [
    'ID,Name,Mobile,Email,Attending,Guests,Travel Mode,Submitted At',
    ...data.map((r) =>
      [
        r.id,
        `"${r.full_name}"`,
        r.mobile_number,
        r.email ?? '',
        r.attending ? 'Yes' : 'No',
        r.guest_count ?? 0,
        r.travel_mode ?? '',
        new Date(r.created_at as string).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      ].join(',')
    ),
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="rsvp-sakshi-sahil.csv"',
    },
  })
}

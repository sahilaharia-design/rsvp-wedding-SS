import { createClient } from '@supabase/supabase-js'

export type RSVPRow = {
  id: string
  created_at: string
  full_name: string
  mobile_number: string
  attending: boolean
  guest_count: number | null
}

export function supabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Missing Supabase public env vars.')
  return createClient(url, key)
}

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase admin env vars.')
  return createClient(url, key)
}

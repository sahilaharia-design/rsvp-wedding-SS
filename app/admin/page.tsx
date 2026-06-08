'use client'

import { useState, useEffect, useCallback } from 'react'

type Stats = {
  totalResponses: number
  totalAttending: number
  totalDeclined: number
  totalGuests: number
}

type Row = {
  id: string
  created_at: string
  full_name: string
  mobile_number: string
  attending: boolean
  guest_count: number | null
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async (pw: string) => {
    setLoading(true)
    const res = await fetch('/api/admin/rsvps', {
      headers: { 'x-admin-password': pw },
    })
    if (res.status === 401) {
      setAuthError('Incorrect password.')
      setLoading(false)
      return
    }
    const json = await res.json()
    setStats(json.stats)
    setRows(json.rows)
    setAuthed(true)
    setLoading(false)
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    await fetchData(password)
  }

  async function handleExport() {
    const res = await fetch('/api/admin/rsvps', {
      method: 'POST',
      headers: { 'x-admin-password': password },
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rsvp-sakshi-sahil.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="font-serif italic text-[1.4rem] text-charcoal mb-1 text-center">
            #SakshiKoMilaKinara
          </p>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-warm-gray text-center mb-10">
            Admin Dashboard
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-warm-gray">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-parchment focus:border-charcoal outline-none py-3 font-sans text-[0.95rem] text-charcoal transition-colors duration-200"
              />
            </div>
            {authError && (
              <p className="font-sans text-[0.8rem] text-red-600">{authError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-charcoal text-cream font-sans text-[11px] tracking-[0.3em] uppercase hover:bg-stone disabled:opacity-50 transition-colors duration-300"
            >
              {loading ? 'Loading…' : 'Enter'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream px-6 md:px-12 py-12">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="font-serif italic text-[1.4rem] text-charcoal mb-1">
              #SakshiKoMilaKinara
            </p>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-warm-gray">
              RSVP Dashboard
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchData(password)}
              className="px-5 py-2 border border-parchment text-stone font-sans text-[10px] tracking-[0.2em] uppercase hover:border-charcoal hover:text-charcoal transition-colors duration-200"
            >
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="px-5 py-2 bg-charcoal text-cream font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-stone transition-colors duration-200"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Total Responses', value: stats.totalResponses },
              { label: 'Attending', value: stats.totalAttending },
              { label: 'Declined', value: stats.totalDeclined },
              { label: 'Guests Confirmed', value: stats.totalGuests },
            ].map((s) => (
              <div key={s.label} className="bg-ivory p-6">
                <p className="font-serif text-[2.2rem] text-charcoal leading-none mb-2">
                  {s.value}
                </p>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-warm-gray">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-parchment">
                {['Name', 'Mobile', 'Attending', 'Guests', 'Submitted'].map((h) => (
                  <th
                    key={h}
                    className="pb-3 pr-6 font-sans text-[10px] tracking-[0.25em] uppercase text-warm-gray font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-parchment/50 hover:bg-ivory/60 transition-colors">
                  <td className="py-4 pr-6 font-sans text-[0.875rem] text-charcoal">{r.full_name}</td>
                  <td className="py-4 pr-6 font-sans text-[0.875rem] text-stone">{r.mobile_number}</td>
                  <td className="py-4 pr-6">
                    <span
                      className={`font-sans text-[10px] tracking-[0.15em] uppercase px-2 py-1 ${
                        r.attending
                          ? 'bg-charcoal/5 text-charcoal'
                          : 'bg-warm-gray/10 text-warm-gray'
                      }`}
                    >
                      {r.attending ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-4 pr-6 font-sans text-[0.875rem] text-stone">
                    {r.attending ? r.guest_count : '—'}
                  </td>
                  <td className="py-4 font-sans text-[0.8rem] text-warm-gray">
                    {new Date(r.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: 'Asia/Kolkata',
                    })}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center font-sans text-[0.875rem] text-warm-gray">
                    No responses yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

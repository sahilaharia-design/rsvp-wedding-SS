// Single place that talks to the Google Apps Script web app (the "Guest
// Confirmations" sheet backend). Every guest-facing route goes through here.
//
// The important rule: success means the script answered with valid JSON that
// says `ok: true`. Anything else — an HTML error / sign-in page, an empty
// body, `ok: false` — is a FAILURE. Previously an unparseable reply was
// silently treated as success, so a broken or stale Apps Script deployment
// made the site tell guests "All Set" while nothing was written to the sheet.

export type SheetResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string }

const GENERIC_ERROR = 'We couldn’t save that just now. Please try again in a moment.'

export async function postToSheet(payload: Record<string, unknown>, timeoutMs = 25_000): Promise<SheetResult> {
  const url = process.env.TRAVEL_APPS_SCRIPT_URL
  if (!url || url === 'PENDING') {
    console.error('[sheet] TRAVEL_APPS_SCRIPT_URL is not configured')
    return { ok: false, error: GENERIC_ERROR }
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    })
    const text = await res.text()
    if (!res.ok) {
      console.error('[sheet] non-OK response', res.status, text.slice(0, 200).replace(/\s+/g, ' '))
      return { ok: false, error: GENERIC_ERROR }
    }
    let json: unknown
    try {
      json = JSON.parse(text)
    } catch {
      console.error('[sheet] reply was not JSON — Apps Script deployment stale, unauthorised, or not public?', text.slice(0, 200).replace(/\s+/g, ' '))
      return { ok: false, error: GENERIC_ERROR }
    }
    const obj = json as { ok?: unknown; error?: unknown }
    if (!obj || obj.ok !== true) {
      console.error('[sheet] script reported failure', JSON.stringify(json).slice(0, 300))
      return { ok: false, error: GENERIC_ERROR }
    }
    return { ok: true, data: obj as Record<string, unknown> }
  } catch (e) {
    console.error('[sheet] request failed', e)
    return { ok: false, error: GENERIC_ERROR }
  }
}

// Read-only diagnostic: sends an action the script does not recognise (so it
// can never write anything) and reports the *shape* of what came back.
export async function probeSheet() {
  const url = process.env.TRAVEL_APPS_SCRIPT_URL
  if (!url || url === 'PENDING') return { configured: false }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'health_probe_noop' }),
      signal: AbortSignal.timeout(25_000),
    })
    const text = await res.text()
    let json: { ok?: unknown; error?: unknown } | null = null
    try { json = JSON.parse(text) } catch { /* not JSON */ }
    return {
      configured: true,
      httpStatus: res.status,
      contentType: res.headers.get('content-type'),
      isJson: json !== null,
      scriptAnswered: json ? { ok: json.ok, error: typeof json.error === 'string' ? json.error.slice(0, 160) : undefined } : null,
      textHead: json ? undefined : text.slice(0, 160).replace(/\s+/g, ' '),
    }
  } catch (e) {
    return { configured: true, fetchError: String(e).slice(0, 200) }
  }
}

import { redirect } from 'next/navigation'

// The old neutral /themes route has no audience to render nav/PDF/travel
// visibility for, so it lands guests on the neutral picker instead of
// guessing — a helpful fallback rather than a broken or ambiguous page.
export default function LegacyThemesPage() {
  redirect('/')
}

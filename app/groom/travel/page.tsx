import { redirect } from 'next/navigation'

// A directly shareable/typeable travel link (matches the proposed
// /groom/travel route). The actual form lives inline on /groom so there is
// only one copy of it to keep correct — this route just lands there.
export default function GroomTravelPage() {
  redirect('/groom#travel-details')
}

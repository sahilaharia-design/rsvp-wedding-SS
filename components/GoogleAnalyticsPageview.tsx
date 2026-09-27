'use client'

// The gtag snippet in the root layout loads once per full page load and
// doesn't know about Next.js client-side navigation (clicking the bottom
// tab bar, the audience-switch link, any <Link>) — those change the URL
// without a browser reload, so GA would otherwise only ever see the very
// first page someone lands on. This fires a page_view on every subsequent
// route change. The very first pageview is left to gtag's own automatic
// one from the inline config call (reliable — it's synchronous JS in the
// script tag itself), so this component explicitly skips firing on mount
// to avoid double-counting that first pageview.
import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (typeof window.gtag !== 'function') return
    const query = searchParams.toString()
    window.gtag('event', 'page_view', {
      page_path: query ? `${pathname}?${query}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}

export default function GoogleAnalyticsPageview() {
  // useSearchParams() requires a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  )
}

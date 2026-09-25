// Central per-audience configuration. Routes, PDFs and travel visibility are
// derived from here rather than duplicated across components — the route
// itself (not client state) determines which audience is showing.
export type Audience = 'bride' | 'groom'

interface AudienceConfig {
  route: string
  themesRoute: string
  pdfPath: string
  makeupRoute: string
  travelEnabled: boolean
}

export const AUDIENCE_CONFIG: Record<Audience, AudienceConfig> = {
  bride: { route: '/bride', themesRoute: '/bride/themes', pdfPath: '/guides/bride-guide-v2.pdf', makeupRoute: '/bride/makeup', travelEnabled: false },
  groom: { route: '/groom', themesRoute: '/groom/themes', pdfPath: '/guides/groom-guide-v2.pdf', makeupRoute: '/groom/makeup', travelEnabled: true },
}

// "For the lovely ladies" makeup guide — same PDF served on both /bride and
// /groom (each has its own /makeup route pointing at it). Versioned
// filename so a re-upload never serves a stale cached copy under the same
// URL (mirrors the bride/groom guide pattern above).
export const MAKEUP_GUIDE_PDF_PATH = '/guides/makeup-guide-v2.pdf'

export const OTHER_AUDIENCE: Record<Audience, Audience> = { bride: 'groom', groom: 'bride' }

// Central per-audience configuration. Routes, PDFs and travel visibility are
// derived from here rather than duplicated across components — the route
// itself (not client state) determines which audience is showing.
export type Audience = 'bride' | 'groom'

interface AudienceConfig {
  route: string
  themesRoute: string
  pdfPath: string
  travelEnabled: boolean
}

export const AUDIENCE_CONFIG: Record<Audience, AudienceConfig> = {
  bride: { route: '/bride', themesRoute: '/bride/themes', pdfPath: '/guides/bride-guide.pdf', travelEnabled: false },
  groom: { route: '/groom', themesRoute: '/groom/themes', pdfPath: '/guides/groom-guide.pdf', travelEnabled: true },
}

export const OTHER_AUDIENCE: Record<Audience, Audience> = { bride: 'groom', groom: 'bride' }

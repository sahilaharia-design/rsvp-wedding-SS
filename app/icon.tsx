import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#6E1A28',
        borderRadius: '50%',
        fontFamily: 'serif',
        fontStyle: 'italic',
        fontSize: 13,
        color: '#F5EDE2',
        letterSpacing: '-0.5px',
      }}
    >
      S♡S
    </div>,
    { ...size }
  )
}

import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const alt = 'Sakshi & Dr. Sahil — Confirm Your Travel Details · Wed 20 – Fri 22 January 2027 · Pitampura, Delhi'
export const size = { width: 700, height: 1522 }
export const contentType = 'image/png'

function fileToBase64(relativePath: string) {
  const filePath = path.join(process.cwd(), 'public', relativePath)
  return fs.readFileSync(filePath).toString('base64')
}

export default async function Image() {
  const heroBase64 = fileToBase64('hero-og.jpg')
  const allura = fs.readFileSync(path.join(process.cwd(), 'public/fonts/allura.woff'))
  const cormorant = fs.readFileSync(path.join(process.cwd(), 'public/fonts/cormorant.woff'))
  const inter = fs.readFileSync(path.join(process.cwd(), 'public/fonts/inter.woff'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0D0805',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${heroBase64}`}
          width={size.width}
          height={size.height}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
        {/* Top vignette */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
            backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)',
            display: 'flex',
          }}
        />
        {/* Bottom gradient */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
            backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.55) 55%, transparent 100%)',
            display: 'flex',
          }}
        />

        {/* Eyebrow */}
        <div style={{ position: 'absolute', top: 58, left: 37, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', color: '#FFFFFF', fontFamily: 'Inter', fontWeight: 500, fontSize: 20, letterSpacing: 13 }}>
            CONFIRM TRAVEL
          </div>
          <div style={{ display: 'flex', marginTop: 12, width: 93, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
        </div>

        {/* Bottom text block */}
        <div style={{ position: 'absolute', bottom: 56, left: 37, right: 37, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', color: '#FFFFFF', fontFamily: 'Allura', fontSize: 75, lineHeight: 1 }}>
            #SakshiKoMilaKinara
          </div>
          <div style={{ display: 'flex', marginTop: 16, color: 'rgba(255,255,255,0.9)', fontFamily: 'Cormorant Garamond', fontWeight: 500, fontSize: 28 }}>
            Wedding of Sakshi &amp; Dr. Sahil
          </div>
          <div style={{ display: 'flex', marginTop: 12, color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter', fontWeight: 500, fontSize: 14, letterSpacing: 3 }}>
            WED 20 – FRI 22 JANUARY 2027 · PITAMPURA, DELHI
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Allura', data: allura, weight: 400, style: 'normal' },
        { name: 'Cormorant Garamond', data: cormorant, weight: 500, style: 'normal' },
        { name: 'Inter', data: inter, weight: 500, style: 'normal' },
      ],
    }
  )
}

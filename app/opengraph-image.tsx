import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const alt = 'Sakshi & Dr. Sahil — #SakshiKoMilaKinara · Wed 20 – Fri 22 January 2027 · Pitampura, Delhi'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

function fileToBase64(relativePath: string) {
  const filePath = path.join(process.cwd(), 'public', relativePath)
  return fs.readFileSync(filePath).toString('base64')
}

// 1200×630 (1.91:1) — the size social platforms (WhatsApp, Facebook, X)
// actually render at and center-crop toward. All content sits well inside
// the safe centre, so nothing gets clipped in the crop.
export default async function Image() {
  const envelopeBase64 = fileToBase64('artwork/invitation-envelope.jpg')
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
          alignItems: 'center',
          backgroundColor: '#F7EEDF',
          padding: '0 70px',
        }}
      >
        {/* Illustrated envelope card */}
        <div
          style={{
            display: 'flex',
            flexShrink: 0,
            width: 460,
            height: 460,
            borderRadius: 16,
            overflow: 'hidden',
            border: '3px solid #D8C6AD',
            position: 'relative',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/jpeg;base64,${envelopeBase64}`}
            width={460}
            height={460}
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 64 }}>
          <div style={{ display: 'flex', color: '#A17B3D', fontFamily: 'Inter', fontWeight: 500, fontSize: 19, letterSpacing: 11 }}>
            YOU&apos;RE INVITED
          </div>
          <div style={{ display: 'flex', marginTop: 20, width: 56, height: 2, backgroundColor: '#760D25' }} />

          <div style={{ display: 'flex', marginTop: 26, color: '#760D25', fontFamily: 'Allura', fontSize: 66, lineHeight: 1 }}>
            #SakshiKoMilaKinara
          </div>

          <div style={{ display: 'flex', marginTop: 22, color: '#303632', fontFamily: 'Cormorant Garamond', fontWeight: 500, fontSize: 36 }}>
            Sakshi &amp; Dr. Sahil
          </div>

          <div style={{ display: 'flex', marginTop: 16, color: '#8B8580', fontFamily: 'Inter', fontWeight: 500, fontSize: 15, letterSpacing: 2 }}>
            WED 20 – FRI 22 JANUARY 2027
          </div>
          <div style={{ display: 'flex', marginTop: 6, color: '#8B8580', fontFamily: 'Inter', fontWeight: 500, fontSize: 15, letterSpacing: 2 }}>
            PITAMPURA, DELHI
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

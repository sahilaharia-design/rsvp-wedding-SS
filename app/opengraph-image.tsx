import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const alt = 'Sakshi & Dr. Sahil — #SakshiKoMilaKinara · Wed 20 – Fri 22 January 2027 · Pitampura, Delhi'
export const size = { width: 700, height: 1522 }
export const contentType = 'image/png'

function fileToBase64(relativePath: string) {
  const filePath = path.join(process.cwd(), 'public', relativePath)
  return fs.readFileSync(filePath).toString('base64')
}

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
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#F7EEDF',
          paddingTop: 90,
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', color: '#A17B3D', fontFamily: 'Inter', fontWeight: 500, fontSize: 20, letterSpacing: 12 }}>
          YOU&apos;RE INVITED
        </div>
        <div style={{ display: 'flex', marginTop: 22, width: 56, height: 2, backgroundColor: '#A17B3D' }} />

        {/* Illustrated envelope card */}
        <div
          style={{
            display: 'flex',
            marginTop: 44,
            width: 604,
            height: 403,
            borderRadius: 14,
            overflow: 'hidden',
            border: '3px solid #D8C6AD',
            position: 'relative',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/jpeg;base64,${envelopeBase64}`}
            width={604}
            height={403}
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div style={{ display: 'flex', marginTop: 46, width: 90, height: 2, backgroundColor: '#760D25' }} />

        {/* Hashtag */}
        <div style={{ display: 'flex', marginTop: 34, color: '#760D25', fontFamily: 'Allura', fontSize: 78, lineHeight: 1 }}>
          #SakshiKoMilaKinara
        </div>

        {/* Names */}
        <div style={{ display: 'flex', marginTop: 26, color: '#303632', fontFamily: 'Cormorant Garamond', fontWeight: 500, fontSize: 34 }}>
          Sakshi &amp; Dr. Sahil
        </div>

        {/* Dates */}
        <div style={{ display: 'flex', marginTop: 18, color: '#8B8580', fontFamily: 'Inter', fontWeight: 500, fontSize: 15, letterSpacing: 3 }}>
          WED 20 – FRI 22 JANUARY 2027 · PITAMPURA, DELHI
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

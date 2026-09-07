'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/Language'

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type ArrivalMode = 'flight' | 'train' | 'road'

const EASE = [0.25, 0.1, 0.25, 1] as const
const MAX_FILES = 4
const MAX_FILE_BYTES = 3.2 * 1024 * 1024 // ~3.2MB raw — keeps base64 well under the API's cap

const labelCls = 'block font-sans uppercase text-charcoal/70'
const labelStyle = { fontSize: '0.95rem', letterSpacing: '0.12em' }
const inputCls = 'w-full bg-transparent border-b-2 border-stone/30 focus:border-marigold outline-none py-4 font-sans text-charcoal placeholder:text-stone/35 transition-colors duration-200'
const inputStyle = { fontSize: '1.1rem' }

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Strip the "data:<mime>;base64," prefix
      const commaIdx = result.indexOf(',')
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function TravelDetailsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { t } = useLang()

  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [arrivalMode, setArrivalMode] = useState<ArrivalMode | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState('')
  const [uploadProgress, setUploadProgress] = useState('')

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    if (!picked.length) return

    const tooBig = picked.filter((f) => f.size > MAX_FILE_BYTES)
    const okSized = picked.filter((f) => f.size <= MAX_FILE_BYTES)

    if (tooBig.length) {
      setFileError(`"${tooBig[0].name}"${tooBig.length > 1 ? ` and ${tooBig.length - 1} other file(s)` : ''} — too large, please use a photo under 3MB.`)
    } else {
      setFileError('')
    }
    setFiles((prev) => [...prev, ...okSized].slice(0, MAX_FILES))
    e.target.value = '' // allow re-selecting the same file later
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('submitting')
    setErrorMsg('')
    setUploadProgress('')

    const fd = new FormData(e.currentTarget)
    const full_name = fd.get('full_name') as string
    const mobile_number = fd.get('mobile_number') as string
    const arrival_date = fd.get('arrival_date') as string
    const arrival_time = fd.get('arrival_time') as string
    const travel_number = fd.get('travel_number') as string
    const departure_date = fd.get('departure_date') as string
    const notes = fd.get('notes') as string

    if (!arrivalMode) {
      setErrorMsg(t.arrivalModeLabel)
      setFormState('error')
      return
    }

    try {
      const infoRes = await fetch('/api/travel-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name, mobile_number,
          arrival_mode: arrivalMode, arrival_date, arrival_time,
          travel_number, departure_date, notes,
        }),
      })
      const infoJson = await infoRes.json()
      if (!infoRes.ok) {
        setErrorMsg(infoJson.error ?? 'Something went wrong. Please try again.')
        setFormState('error')
        return
      }

      const normalisedMobile = infoJson.mobile as string
      const failedUploads: string[] = []

      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`${t.uploadingLabel} ${i + 1}/${files.length}`)
        const file = files[i]
        try {
          const data = await fileToBase64(file)
          const uploadRes = await fetch('/api/travel-details/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mobile_number: normalisedMobile,
              full_name,
              filename: file.name,
              mime_type: file.type,
              data,
            }),
          })
          if (!uploadRes.ok) failedUploads.push(file.name)
        } catch {
          failedUploads.push(file.name)
        }
      }

      setUploadProgress('')

      if (failedUploads.length) {
        setErrorMsg(`Your details were saved, but ${failedUploads.join(', ')} didn't upload. Please try again or send it to us on WhatsApp.`)
        setFormState('error')
        return
      }

      setFormState('success')
    } catch {
      setErrorMsg(t.travelDetailsError)
      setFormState('error')
    }
  }

  return (
    <section id="travel-details" ref={ref} className="bg-cream relative overflow-hidden">
      <div className="relative px-7 md:px-14 py-12 md:py-16">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }} className="py-10 text-center">
                  <div className="w-12 h-[2px] bg-marigold mx-auto mb-8" />
                  <h2 className="font-serif italic leading-[1.2] text-charcoal mb-5"
                    style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>
                    {t.travelSuccessHeading}
                  </h2>
                  <p className="font-sans leading-[1.9] text-stone" style={{ fontSize: '1.1rem' }}>
                    {t.travelSuccessBody.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <p className="font-sans uppercase text-stone mb-5"
                    style={{ fontSize: '0.75rem', letterSpacing: '0.4em' }}>
                    {t.travelConfirmEyebrow}
                  </p>
                  <div className="w-12 h-[2px] bg-marigold mb-7" />
                  <h2 className="font-serif leading-[1.15] text-charcoal mb-5"
                    style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>
                    {t.travelConfirmHeading}
                  </h2>
                  <p className="font-sans leading-[1.85] text-stone mb-8"
                    style={{ fontSize: '1.1rem' }}>
                    {t.travelConfirmIntro}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-7">
                    <div className="space-y-2">
                      <label className={labelCls} style={labelStyle}>{t.fullName}</label>
                      <input type="text" name="full_name" required
                        placeholder="Your name" className={inputCls} style={inputStyle} />
                    </div>

                    <div className="space-y-2">
                      <label className={labelCls} style={labelStyle}>{t.mobile}</label>
                      <input type="tel" name="mobile_number" required
                        placeholder="10-digit mobile number" className={inputCls} style={inputStyle} />
                    </div>

                    {/* Arrival mode */}
                    <div className="space-y-4">
                      <label className={labelCls} style={labelStyle}>{t.arrivalModeLabel}</label>
                      <div className="flex flex-wrap gap-x-7 gap-y-3">
                        {([
                          { value: 'flight' as ArrivalMode, label: t.byFlight },
                          { value: 'train' as ArrivalMode, label: t.byTrain },
                          { value: 'road' as ArrivalMode, label: t.byRoad },
                        ]).map(({ value, label }) => (
                          <label key={value} className="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="arrival_mode" value={value} required
                              onChange={() => setArrivalMode(value)} />
                            <span className="font-sans text-charcoal" style={{ fontSize: '1.15rem' }}>
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Arrival date + time */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={labelCls} style={labelStyle}>{t.arrivalDate}</label>
                        <input type="date" name="arrival_date" required
                          className={inputCls} style={inputStyle} />
                      </div>
                      <div className="space-y-2">
                        <label className={labelCls} style={labelStyle}>{t.arrivalTime}</label>
                        <input type="time" name="arrival_time" required
                          className={inputCls} style={inputStyle} />
                      </div>
                    </div>

                    {/* Travel number */}
                    <div className="space-y-2">
                      <label className={labelCls} style={labelStyle}>
                        {t.travelNumber} <span className="normal-case tracking-normal">{t.optionalTag}</span>
                      </label>
                      <input type="text" name="travel_number" autoComplete="off"
                        placeholder="e.g. AI-2401" className={inputCls} style={inputStyle} />
                    </div>

                    {/* Departure date */}
                    <div className="space-y-2">
                      <label className={labelCls} style={labelStyle}>
                        {t.departureDate} <span className="normal-case tracking-normal">{t.optionalTag}</span>
                      </label>
                      <input type="date" name="departure_date" className={inputCls} style={inputStyle} />
                    </div>

                    {/* ID upload */}
                    <div className="space-y-3">
                      <label className={labelCls} style={labelStyle}>{t.idUploadLabel}</label>
                      <p className="font-sans text-stone leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                        {t.idUploadHint}
                      </p>

                      <div className="space-y-2">
                        {files.map((f, i) => (
                          <div key={`${f.name}-${i}`}
                            className="flex items-center justify-between bg-parchment/60 px-4 py-3 rounded">
                            <span className="font-sans text-charcoal truncate pr-3" style={{ fontSize: '0.9rem' }}>
                              {f.name}
                            </span>
                            <button type="button" onClick={() => removeFile(i)}
                              className="font-sans text-charcoal/50 hover:text-charcoal flex-shrink-0"
                              style={{ fontSize: '0.85rem' }} aria-label={`Remove ${f.name}`}>
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>

                      {files.length < MAX_FILES && (
                        <label className="inline-block cursor-pointer border border-charcoal/30 hover:border-charcoal px-6 py-3 font-sans uppercase text-charcoal transition-colors duration-200"
                          style={{ fontSize: '0.82rem', letterSpacing: '0.2em' }}>
                          {t.chooseFiles}
                          <input type="file" accept="image/*,.pdf" multiple
                            onChange={handleFilesSelected} className="hidden" />
                        </label>
                      )}

                      {fileError && (
                        <p className="font-sans text-rose-700" style={{ fontSize: '0.9rem' }}>{fileError}</p>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <label className={labelCls} style={labelStyle}>
                        {t.notesLabel} <span className="normal-case tracking-normal">{t.optionalTag}</span>
                      </label>
                      <textarea name="notes" rows={3} autoComplete="off"
                        className={inputCls} style={inputStyle} />
                    </div>

                    {formState === 'error' && errorMsg && (
                      <p className="font-sans text-rose-700" style={{ fontSize: '1rem' }}>{errorMsg}</p>
                    )}

                    {uploadProgress && (
                      <p className="font-sans text-stone" style={{ fontSize: '0.9rem' }}>{uploadProgress}</p>
                    )}

                    <div className="pt-4">
                      <button type="submit" disabled={formState === 'submitting'}
                        className="w-full py-5 bg-marigold text-charcoal font-sans uppercase hover:bg-marigold-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                        style={{ fontSize: '1rem', letterSpacing: '0.28em' }}>
                        {formState === 'submitting' ? t.sending : t.travelConfirmBtn}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

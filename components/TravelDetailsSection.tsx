'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/Language'

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type ArrivalMode = 'flight' | 'train' | 'road'

const EASE = [0.25, 0.1, 0.25, 1] as const
const MAX_FILES = 4
const MAX_FILE_BYTES = 3.2 * 1024 * 1024 // ~3.2MB raw — keeps base64 well under the API's cap
const TOTAL_STEPS = 3

const labelCls = 'block font-sans uppercase text-charcoal/70'
const labelStyle = { fontSize: '0.85rem', letterSpacing: '0.12em' }
const inputCls = 'w-full bg-white/70 border-2 border-thread-border/50 focus:border-burgundy outline-none rounded-xl px-4 py-4 font-sans text-charcoal placeholder:text-stone/40 transition-colors duration-200 min-h-[52px]'
const inputStyle = { fontSize: '1.05rem' }

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const commaIdx = result.indexOf(',')
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const ARRIVAL_ICONS: Record<ArrivalMode, string> = {
  flight: '/graphics/plane.svg',
  train: '/graphics/rail.svg',
  road: '/graphics/road.svg',
}

interface FieldsState {
  full_name: string
  mobile_number: string
  arrival_date: string
  arrival_time: string
  travel_number: string
  departure_date: string
  guest_names: string
  notes: string
}

const EMPTY_FIELDS: FieldsState = {
  full_name: '', mobile_number: '', arrival_date: '', arrival_time: '',
  travel_number: '', departure_date: '', guest_names: '', notes: '',
}

export default function TravelDetailsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { t } = useLang()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [fields, setFields] = useState<FieldsState>(EMPTY_FIELDS)
  const [arrivalMode, setArrivalMode] = useState<ArrivalMode | null>(null)
  const [stepError, setStepError] = useState('')

  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  const setField = (key: keyof FieldsState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }))

  function addFiles(list: FileList | File[]) {
    const picked = Array.from(list)
    if (!picked.length) return
    const tooBig = picked.filter((f) => f.size > MAX_FILE_BYTES)
    const okSized = picked.filter((f) => f.size <= MAX_FILE_BYTES)
    if (tooBig.length) {
      setFileError(`"${tooBig[0].name}"${tooBig.length > 1 ? ` and ${tooBig.length - 1} other file(s)` : ''} — too large, please use a photo under 3MB.`)
    } else {
      setFileError('')
    }
    setFiles((prev) => [...prev, ...okSized].slice(0, MAX_FILES))
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = ''
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  function goNext() {
    if (step === 0) {
      if (!fields.full_name.trim() || !fields.mobile_number.trim() || !arrivalMode) {
        setStepError(t.arrivalModeLabel)
        return
      }
    }
    if (step === 1) {
      if (!fields.arrival_date || !fields.arrival_time) {
        setStepError(t.arrivalDate)
        return
      }
    }
    setStepError('')
    setDirection(1)
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }

  function goBack() {
    setStepError('')
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!arrivalMode) return
    setFormState('submitting')
    setErrorMsg('')
    setUploadProgress('')

    try {
      const infoRes = await fetch('/api/travel-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, arrival_mode: arrivalMode }),
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
              full_name: fields.full_name,
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

  const stepTitle = [t.stepAboutTitle, t.stepArrivalTitle, t.stepFinalTitle][step]
  const travelNumberLabel = arrivalMode === 'train' ? t.trainNumberLabel
    : arrivalMode === 'road' ? t.roadDetailsLabel
    : t.flightNumberLabel

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -28 : 28 }),
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
                  transition={{ duration: 0.6 }} className="py-10 text-center relative">
                  <div className="w-12 h-[2px] bg-gold mx-auto mb-8" />
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
                  <div className="w-12 h-[2px] bg-gold mb-7" />
                  <h2 className="font-serif leading-[1.15] text-charcoal mb-5"
                    style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>
                    {t.travelConfirmHeading}
                  </h2>
                  <p className="font-sans leading-[1.85] text-stone mb-8"
                    style={{ fontSize: '1.1rem' }}>
                    {t.travelConfirmIntro}
                  </p>

                  {/* ── Step progress ── */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans uppercase text-burgundy" style={{ fontSize: '0.78rem', letterSpacing: '0.16em' }}>
                        {stepTitle}
                      </span>
                      <span className="font-sans text-stone/70" style={{ fontSize: '0.8rem' }}>
                        {t.stepOf.replace('{n}', String(step + 1))}
                      </span>
                    </div>
                    <div className="h-[3px] bg-thread-border/40 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #A17B3D, #760D25)' }}
                        animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="overflow-hidden">
                      <AnimatePresence mode="wait" custom={direction} initial={false}>
                        <motion.div
                          key={step}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter" animate="center" exit="exit"
                          transition={{ duration: 0.35, ease: EASE }}
                          className="space-y-7"
                        >
                          {step === 0 && (
                            <>
                              <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>{t.fullName}</label>
                                <input type="text" value={fields.full_name} onChange={setField('full_name')} required
                                  placeholder="Your name" className={inputCls} style={inputStyle} />
                              </div>

                              <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>{t.mobile}</label>
                                <input type="tel" value={fields.mobile_number} onChange={setField('mobile_number')} required
                                  placeholder="10-digit mobile number" className={inputCls} style={inputStyle} />
                              </div>

                              {/* Arrival mode — segmented control with a sliding active pill */}
                              <div className="space-y-3">
                                <label className={labelCls} style={labelStyle}>{t.arrivalModeLabel}</label>
                                <div className="grid grid-cols-3 gap-3">
                                  {(['flight', 'train', 'road'] as ArrivalMode[]).map((mode) => {
                                    const label = mode === 'flight' ? t.byFlight : mode === 'train' ? t.byTrain : t.byRoad
                                    const active = arrivalMode === mode
                                    return (
                                      <button
                                        key={mode} type="button"
                                        onClick={() => setArrivalMode(mode)}
                                        className="relative flex flex-col items-center gap-2 rounded-xl py-4 border-2 transition-colors duration-200 overflow-hidden"
                                        style={{ borderColor: active ? '#760D25' : 'rgba(216,198,173,0.6)' }}
                                      >
                                        {active && (
                                          <motion.div
                                            layoutId="arrivalModeFill"
                                            className="absolute inset-0 bg-burgundy"
                                            transition={{ duration: 0.3, ease: EASE }}
                                          />
                                        )}
                                        <Image src={ARRIVAL_ICONS[mode]} alt="" width={22} height={22}
                                          className="relative z-10"
                                          style={{ filter: active ? 'invert(1) brightness(2)' : 'none' }} />
                                        <span className="relative z-10 font-sans" style={{ fontSize: '0.85rem', color: active ? '#FFF9F1' : '#303632' }}>
                                          {label}
                                        </span>
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            </>
                          )}

                          {step === 1 && (
                            <>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className={labelCls} style={labelStyle}>{t.arrivalDate}</label>
                                  <input type="date" value={fields.arrival_date} onChange={setField('arrival_date')} required
                                    className={inputCls} style={inputStyle} />
                                </div>
                                <div className="space-y-2">
                                  <label className={labelCls} style={labelStyle}>
                                    {t.arrivalTime}
                                  </label>
                                  <input type="time" value={fields.arrival_time} onChange={setField('arrival_time')} required
                                    className={inputCls} style={inputStyle} />
                                  <p className="font-sans text-stone/60" style={{ fontSize: '0.78rem' }}>{t.arrivalTimeHint}</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>
                                  {travelNumberLabel} <span className="normal-case tracking-normal">{t.optionalTag}</span>
                                </label>
                                <input type="text" value={fields.travel_number} onChange={setField('travel_number')} autoComplete="off"
                                  placeholder="e.g. AI-2401" className={inputCls} style={inputStyle} />
                              </div>

                              <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>
                                  {t.departureDate} <span className="normal-case tracking-normal">{t.optionalTag}</span>
                                </label>
                                <input type="date" value={fields.departure_date} onChange={setField('departure_date')}
                                  className={inputCls} style={inputStyle} />
                              </div>

                              <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>
                                  {t.guestNamesLabel} <span className="normal-case tracking-normal">{t.optionalTag}</span>
                                </label>
                                <input type="text" value={fields.guest_names} onChange={setField('guest_names')} autoComplete="off"
                                  className={inputCls} style={inputStyle} />
                              </div>
                            </>
                          )}

                          {step === 2 && (
                            <>
                              {/* ID upload — dropzone */}
                              <div className="space-y-3">
                                <label className={labelCls} style={labelStyle}>{t.idUploadLabel}</label>
                                <p className="font-sans text-stone leading-[1.6]" style={{ fontSize: '0.88rem' }}>
                                  {t.idUploadHint}
                                </p>

                                <div className="space-y-2">
                                  {files.map((f, i) => (
                                    <div key={`${f.name}-${i}`}
                                      className="flex items-center justify-between bg-white/70 border border-thread-border/50 px-4 py-3 rounded-xl">
                                      <span className="font-sans text-charcoal truncate pr-3" style={{ fontSize: '0.9rem' }}>
                                        {f.name}
                                      </span>
                                      <button type="button" onClick={() => removeFile(i)}
                                        className="font-sans text-charcoal/50 hover:text-burgundy flex-shrink-0 transition-colors"
                                        style={{ fontSize: '0.85rem' }} aria-label={`Remove ${f.name}`}>
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>

                                {files.length < MAX_FILES && (
                                  <label
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files) addFiles(e.dataTransfer.files) }}
                                    className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-2xl px-6 py-8 text-center transition-colors duration-200"
                                    style={{
                                      border: `2px dashed ${dragOver ? '#760D25' : 'rgba(216,198,173,0.8)'}`,
                                      background: dragOver ? 'rgba(161,123,61,0.08)' : 'rgba(255,255,255,0.5)',
                                    }}
                                  >
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#760D25" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 16V4M12 4 7 9M12 4l5 5" />
                                      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                                    </svg>
                                    <span className="font-sans uppercase text-charcoal" style={{ fontSize: '0.82rem', letterSpacing: '0.15em' }}>
                                      {t.chooseFiles}
                                    </span>
                                    <input type="file" accept="image/*,.pdf" multiple
                                      onChange={handleFilesSelected} className="hidden" />
                                  </label>
                                )}

                                {fileError && (
                                  <p className="font-sans text-rose-700" style={{ fontSize: '0.9rem' }}>{fileError}</p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>
                                  {t.notesLabel} <span className="normal-case tracking-normal">{t.optionalTag}</span>
                                </label>
                                <textarea value={fields.notes} onChange={setField('notes')} rows={3} autoComplete="off"
                                  className={inputCls} style={inputStyle} />
                              </div>
                            </>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {stepError && (
                      <p className="font-sans text-rose-700 mt-4" style={{ fontSize: '0.95rem' }}>{stepError}</p>
                    )}
                    {formState === 'error' && errorMsg && (
                      <p className="font-sans text-rose-700 mt-4" style={{ fontSize: '1rem' }}>{errorMsg}</p>
                    )}
                    {uploadProgress && (
                      <p className="font-sans text-stone mt-4" style={{ fontSize: '0.9rem' }}>{uploadProgress}</p>
                    )}

                    {/* ── Step navigation ── */}
                    <div className="flex items-center gap-3 pt-8">
                      {step > 0 && (
                        <button type="button" onClick={goBack}
                          className="hover-lift px-6 py-4 border-2 border-thread-border/60 text-charcoal font-sans uppercase rounded-sm hover:border-burgundy transition-colors duration-300"
                          style={{ fontSize: '0.85rem', letterSpacing: '0.2em' }}>
                          {t.backBtn}
                        </button>
                      )}
                      {step < TOTAL_STEPS - 1 ? (
                        <button type="button" onClick={goNext}
                          className="shimmer-btn flex-1 py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm"
                          style={{ fontSize: '0.9rem', letterSpacing: '0.24em' }}>
                          {t.nextBtn}
                        </button>
                      ) : (
                        <button type="submit" disabled={formState === 'submitting'}
                          className="shimmer-btn flex-1 py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 rounded-sm"
                          style={{ fontSize: '0.9rem', letterSpacing: '0.24em' }}>
                          {formState === 'submitting' ? t.sending : t.travelConfirmBtn}
                        </button>
                      )}
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

'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/Language'
import { AUDIENCE_CONFIG } from '@/lib/audience'
import FormSuccess from '@/components/FormSuccess'

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type ArrivalMode = 'flight' | 'train' | 'road'

const EASE = [0.25, 0.1, 0.25, 1] as const
const MAX_FILES = 4
const MAX_FILE_BYTES = 3.2 * 1024 * 1024 // ~3.2MB raw — keeps base64 well under the API's cap
// Phone cameras routinely produce 4–8MB photos, so images are shrunk in the
// browser before the size cap is applied (PDFs can't be, and still hit it).
// ID photos only need to be legible, not high-res. Smaller files upload far
// faster over mobile data (the biggest single factor in how long Confirm takes).
const COMPRESS_ABOVE_BYTES = 400 * 1024
const COMPRESS_TARGET_BYTES = 900 * 1024
const REQUEST_TIMEOUT_MS = 90_000
const OTHER_TIME = 'other' // arrival_time sentinel for "later than 2 pm / a different day"

const labelCls = 'block font-sans uppercase text-charcoal/70'
const labelStyle = { fontSize: '0.85rem', letterSpacing: '0.12em' }
const inputCls = 'w-full bg-white/70 border-2 border-thread-border/50 focus:border-burgundy outline-none rounded-xl px-4 py-4 font-sans text-charcoal placeholder:text-stone/40 transition-colors duration-200 min-h-[52px]'
const inputStyle = { fontSize: '1.05rem' }
const sectionLabelCls = 'font-sans uppercase text-burgundy'
const sectionLabelStyle = { fontSize: '0.78rem', letterSpacing: '0.16em' }

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

// Shrinks a large photo to a JPEG that comfortably fits the upload cap.
// Falls back to the original file on any failure — never blocks the guest.
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.size <= COMPRESS_ABOVE_BYTES) return file
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    for (const [maxDim, quality] of [[1600, 0.75], [1280, 0.68], [1000, 0.6]] as const) {
      const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(bitmap.width * scale)
      canvas.height = Math.round(bitmap.height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) return file
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', quality))
      if (blob && blob.size <= COMPRESS_TARGET_BYTES) {
        bitmap.close?.()
        return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
      }
    }
    bitmap.close?.()
    return file
  } catch {
    return file
  }
}

// fetch with a hard timeout, so a stalled mobile connection ends in a clear
// error + retry rather than a button stuck on "Sending…" forever.
async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: ctl.signal })
  } finally {
    clearTimeout(timer)
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

class HttpError extends Error {
  constructor(public status: number) { super(`HTTP ${status}`) }
}

async function uploadOnce(body: Record<string, string>) {
  const res = await fetchWithTimeout('/api/travel-details/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new HttpError(res.status)
}

// The sheet backend (Google Apps Script) occasionally hiccups, so a network
// error or 5xx gets one automatic retry before the guest ever sees a problem.
// Client errors (bad/oversized file) are not retried — they'd fail again.
async function uploadWithRetry(body: Record<string, string>) {
  try {
    await uploadOnce(body)
  } catch (err) {
    if (err instanceof HttpError && err.status < 500) throw err
    await sleep(1500)
    await uploadOnce(body)
  }
}

type StepStatus = 'active' | 'done' | 'error'
interface StepRow { key: string; label: string; status: StepStatus }

type FieldKey = 'name' | 'mobile' | 'time' | 'other' | 'id'
const FIELD_IDS: Record<FieldKey, string> = {
  name: 'field-name', mobile: 'field-mobile', time: 'field-time', other: 'field-other', id: 'id-upload-group',
}
const FIELD_ORDER: FieldKey[] = ['name', 'mobile', 'time', 'other', 'id']
const errorBorderCls = 'border-rose-500 focus:border-rose-600'

const ARRIVAL_ICONS: Record<ArrivalMode, string> = {
  flight: '/graphics/plane.svg',
  train: '/graphics/rail.svg',
  road: '/graphics/road.svg',
}

// Only 20 January is being offered as an arrival date for now (per direct
// instruction) — fixed rather than a picker, so there's nothing to ask.
const ARRIVAL_DATE = '2027-01-20'

// The Mehndi (the first celebration) starts at 11am and pickup coordination
// is built around it, so 2pm is a hard cap — but per direct feedback the
// earlier 11am-only floor was too strict, so morning arrivals are offered
// too (hourly early on, half-hourly from 10:30 through the 2pm cap, since
// that's the denser pickup-coordination window).
const ARRIVAL_TIME_VALUES = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
]

interface FieldsState {
  full_name: string
  mobile_number: string
  arrival_date: string
  arrival_time: string
  arrival_other: string
  travel_number: string
  guest_names: string
  notes: string
}

const EMPTY_FIELDS: FieldsState = {
  full_name: '', mobile_number: '', arrival_date: ARRIVAL_DATE, arrival_time: '', arrival_other: '',
  travel_number: '', guest_names: '', notes: '',
}

// One continuous form, no steps — every field is visible and fillable in
// any order, one submit at the end. Previously a 3-step wizard requiring a
// "Continue" tap between each group; flattened per direct feedback that
// taking travel details should be a single, seamless page with no extra
// clicks. The three groups (About You / Your Arrival / ID & Notes) remain
// as plain labelled sections for scannability, not gated steps.
export default function TravelDetailsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { t } = useLang()

  // A soft (client-side) navigation to a #travel-details link — e.g. from
  // /groom/travel's redirect, or the sticky CTA on a different route —
  // doesn't trigger the browser's native scroll-to-hash the way a full page
  // load does, so it has to be done explicitly here on mount.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#travel-details') {
      ref.current?.scrollIntoView({ block: 'start' })
    }
  }, [])

  const [fields, setFields] = useState<FieldsState>(EMPTY_FIELDS)
  const [arrivalMode, setArrivalMode] = useState<ArrivalMode | null>(null)
  // One-tap helper for the suggested Mumbai → Hazrat Nizamuddin train (shown
  // when "By Train" is picked): fills the nearest arrival slot (the train
  // gets in ~9:45 am) and the train name, which the guest can still edit.
  const [trainTipApplied, setTrainTipApplied] = useState(false)
  function applyTrainTip() {
    setArrivalMode('train')
    setFields((prev) => ({ ...prev, arrival_time: '10:00', arrival_other: '', travel_number: '12953 August Kranti Rajdhani' }))
    setTrainTipApplied(true)
  }

  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [files, setFiles] = useState<File[]>([])
  // Mirror of `files` that's readable synchronously, plus the in-flight
  // photo-preparation promise: a guest who picks a big photo and taps
  // Confirm straight away must not be told "upload your ID" while it is
  // still being shrunk — submit waits for it instead.
  const filesRef = useRef<File[]>([])
  const pendingFilesRef = useRef<Promise<void> | null>(null)
  const [processing, setProcessing] = useState(false)
  const [fileError, setFileError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  // Submit progress: the details save and every ID upload run at the same
  // time, each with its own row so the guest can see exactly what's happening
  // (previously: one tiny "Uploading 1/2" line while everything ran in a queue).
  const [steps, setSteps] = useState<StepRow[]>([])
  const [slow, setSlow] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  // What has already been saved — so a retry after a partial failure only
  // redoes what actually failed (no duplicate ID files in Drive).
  const savedInfoRef = useRef<string | null>(null)
  const uploadedRef = useRef<Map<File, string>>(new Map())

  function setStep(key: string, status: StepStatus) {
    setSteps((prev) => prev.map((s) => (s.key === key ? { ...s, status } : s)))
  }

  const previews = useMemo(
    () => files.map((f) => (f.type.startsWith('image/') ? URL.createObjectURL(f) : null)),
    [files],
  )
  useEffect(() => () => previews.forEach((u) => u && URL.revokeObjectURL(u)), [previews])

  // Closing the tab mid-upload would silently lose the ID photos.
  useEffect(() => {
    if (formState !== 'submitting') return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [formState])
  // Belt-and-suspenders against a double-click or Enter-key repeat firing
  // handleSubmit twice before React re-renders the button's `disabled`
  // state — this ref is synchronous, so the second call bails immediately
  // regardless of render timing.
  const isSubmittingRef = useRef(false)

  // Validation is custom (the <form> is noValidate) because the browser's
  // native "please fill out this field" bubble is small, disappears fast,
  // and on a phone is easy to miss entirely — guests were tapping Confirm,
  // seeing nothing happen, and giving up. Instead, tapping Confirm with
  // anything missing shows a banner listing exactly what's left (each item
  // jumps to its field) and marks those fields inline; the list then
  // shrinks live as they fix things.
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})
  const [attempted, setAttempted] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  function validate(fileList: File[] = files) {
    const e: Partial<Record<FieldKey, string>> = {}
    if (!fields.full_name.trim()) e.name = t.errName
    if (fields.mobile_number.replace(/\D/g, '').length < 10) e.mobile = t.errMobile
    if (!fields.arrival_time) e.time = t.errTime
    else if (fields.arrival_time === OTHER_TIME && !fields.arrival_other.trim()) e.other = t.errOther
    if (fileList.length === 0) e.id = t.idUploadRequiredError
    return e
  }

  useEffect(() => {
    if (attempted) setErrors(validate())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, files, attempted, t])

  function jumpTo(key: FieldKey) {
    const el = document.getElementById(FIELD_IDS[key])
    el?.scrollIntoView({ behavior: 'instant', block: 'center' })
    ;(el as HTMLElement | null)?.focus?.({ preventScroll: true })
  }

  const setField = (key: keyof FieldsState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }))

  async function addFilesInner(list: FileList | File[]) {
    const original = Array.from(list)
    if (!original.length) return
    setProcessing(true)
    try {
      const picked = await Promise.all(original.map(compressImage))
      const tooBig = picked.filter((f) => f.size > MAX_FILE_BYTES)
      const okSized = picked.filter((f) => f.size <= MAX_FILE_BYTES)
      if (tooBig.length) {
        setFileError(t.fileTooLargeError.replace('{name}', tooBig[0].name + (tooBig.length > 1 ? ` (+${tooBig.length - 1})` : '')))
      } else {
        setFileError('')
      }
      const next = [...filesRef.current, ...okSized].slice(0, MAX_FILES)
      filesRef.current = next
      setFiles(next)
    } finally {
      setProcessing(false)
    }
  }

  function addFiles(list: FileList | File[]) {
    const p = addFilesInner(list)
    pendingFilesRef.current = p
    return p
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = ''
  }

  function removeFile(idx: number) {
    const next = filesRef.current.filter((_, i) => i !== idx)
    filesRef.current = next
    setFiles(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    if (pendingFilesRef.current) await pendingFilesRef.current
    const currentFiles = filesRef.current
    const found = validate(currentFiles)
    setAttempted(true)
    setErrors(found)
    if (Object.keys(found).length) {
      isSubmittingRef.current = false
      // Keep the guest at the button, where the "what's left" banner appears.
      requestAnimationFrame(() => bannerRef.current?.scrollIntoView({ behavior: 'instant', block: 'center' }))
      return
    }
    const isOther = fields.arrival_time === OTHER_TIME
    const payload = {
      ...fields,
      arrival_mode: arrivalMode,
      // "Later / different day" has no fixed date or slot — the guest's own words go in the time column.
      arrival_date: isOther ? '' : fields.arrival_date,
      arrival_time: isOther ? `Other: ${fields.arrival_other.trim()}` : fields.arrival_time,
    }
    const payloadKey = JSON.stringify(payload)
    const mobile = fields.mobile_number.replace(/\D/g, '').slice(-10)

    setFormState('submitting')
    setErrorMsg('')
    setSlow(false)
    setSteps([
      { key: 'details', label: t.stepDetails, status: savedInfoRef.current === payloadKey ? 'done' : 'active' },
      ...currentFiles.map((f, i): StepRow => ({
        key: `f${i}`,
        label: `${t.stepIdPhoto} · ${f.name}`,
        status: uploadedRef.current.get(f) === mobile ? 'done' : 'active',
      })),
    ])
    requestAnimationFrame(() => progressRef.current?.scrollIntoView({ behavior: 'instant', block: 'center' }))
    const slowTimer = setTimeout(() => setSlow(true), 12_000)

    try {
      let detailsErr = ''
      const detailsTask = (async () => {
        if (savedInfoRef.current === payloadKey) return true
        try {
          const res = await fetchWithTimeout('/api/travel-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          const json = await res.json().catch(() => ({} as { error?: string }))
          if (!res.ok) {
            detailsErr = res.status >= 500 ? t.mehndiErrorGeneric : (json.error ?? t.mehndiErrorGeneric)
            throw new Error('details')
          }
          savedInfoRef.current = payloadKey
          setStep('details', 'done')
          return true
        } catch {
          if (!detailsErr) detailsErr = t.travelDetailsError
          setStep('details', 'error')
          return false
        }
      })()

      // All photos go up in parallel with the details save. This is safe: the
      // sheet script serialises its row writes, and a photo that lands before
      // the details simply creates the row, which the details then fill in.
      const fileTasks = currentFiles.map(async (file, i) => {
        if (uploadedRef.current.get(file) === mobile) return true
        try {
          const data = await fileToBase64(file)
          await uploadWithRetry({ mobile_number: mobile, full_name: fields.full_name, filename: file.name, mime_type: file.type, data })
          uploadedRef.current.set(file, mobile)
          setStep(`f${i}`, 'done')
          return true
        } catch {
          setStep(`f${i}`, 'error')
          return false
        }
      })

      const [detailsOk, ...filesOk] = await Promise.all([detailsTask, ...fileTasks])

      if (!detailsOk) {
        setErrorMsg(detailsErr)
        setFormState('error')
        return
      }
      const failed = currentFiles.filter((_, i) => !filesOk[i])
      if (failed.length) {
        setErrorMsg(t.travelUploadPartialError.replace('{files}', failed.map((f) => f.name).join(', ')))
        setFormState('error')
        return
      }
      setFormState('success')
    } catch {
      setErrorMsg(t.travelDetailsError)
      setFormState('error')
    } finally {
      clearTimeout(slowTimer)
      isSubmittingRef.current = false
    }
  }

  const travelNumberLabel = arrivalMode === 'train' ? t.trainNumberLabel
    : arrivalMode === 'road' ? t.roadDetailsLabel
    : t.flightNumberLabel

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
                <motion.div key="success">
                  <FormSuccess
                    heading={t.travelSuccessHeading}
                    body={t.travelSuccessBody}
                    summaryLabel={t.successReceivedLabel}
                    summary={[
                      fields.full_name,
                      [
                        arrivalMode === 'flight' ? t.byFlight : arrivalMode === 'train' ? t.byTrain : arrivalMode === 'road' ? t.byRoad : '',
                        fields.arrival_time === OTHER_TIME ? fields.arrival_other.trim() : `${fields.arrival_date}${fields.arrival_time ? ` · ${fields.arrival_time}` : ''}`,
                      ].filter(Boolean).join(' · '),
                    ].filter(Boolean)}
                    note={t.travelSuccessNote}
                    links={[
                      { href: AUDIENCE_CONFIG.groom.faqRoute, label: t.faqTeaserCTA },
                      { href: AUDIENCE_CONFIG.groom.themesRoute, label: t.wardrobeExploreCTA },
                    ]}
                  />
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
                  <p className="font-sans leading-[1.85] text-stone mb-10"
                    style={{ fontSize: '1.1rem' }}>
                    {t.travelConfirmIntro}
                  </p>

                  <form onSubmit={handleSubmit} noValidate className="space-y-10">

                    {/* Suggested train for Mumbai guests — always visible at the top of the
                        form (not hidden behind the "By Train" tap), with a one-tap fill. */}
                    <div className="relative overflow-hidden rounded-2xl border-2 border-gold/60 bg-gradient-to-br from-gold/10 to-blush/25 px-5 py-5 shadow-sm">
                      <div className="flex items-start gap-3.5">
                        <span className="flex-shrink-0 w-11 h-11 rounded-full bg-burgundy text-paper-light flex items-center justify-center">
                          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3" /><path d="M5 11h14M9 21l2-4M15 21l-2-4" /><circle cx="9" cy="14" r="0.8" fill="currentColor" /><circle cx="15" cy="14" r="0.8" fill="currentColor" /></svg>
                        </span>
                        <div className="min-w-0 space-y-2">
                          <p className="font-sans uppercase text-gold" style={{ fontSize: '0.7rem', letterSpacing: '0.16em' }}>&#10022; {t.trainTipTitle}</p>
                          <p className="font-serif text-ink leading-tight" style={{ fontSize: '1.3rem' }}>{t.tlR0T}</p>
                          <p className="font-sans leading-[1.65] text-stone" style={{ fontSize: '0.92rem' }}>{t.trainTipBody}</p>
                        </div>
                      </div>
                      {trainTipApplied ? (
                        <p className="font-sans text-emerald flex items-start gap-2 mt-4" style={{ fontSize: '0.92rem' }}>
                          <span aria-hidden="true">&#10003;</span> <span>{t.trainTipDone}</span>
                        </p>
                      ) : (
                        <button type="button" onClick={applyTrainTip}
                          className="shimmer-btn mt-4 w-full px-5 py-3.5 bg-burgundy text-paper-light font-sans hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm"
                          style={{ fontSize: '0.92rem' }}>
                          {t.trainTipBtn}
                        </button>
                      )}
                    </div>

                    {/* ── About you ── */}
                    <div className="space-y-7">
                      <p className={sectionLabelCls} style={sectionLabelStyle}>{t.stepAboutTitle}</p>

                      <div className="space-y-2">
                        <label htmlFor="field-name" className={labelCls} style={labelStyle}>{t.fullName}</label>
                        <input id="field-name" type="text" value={fields.full_name} onChange={setField('full_name')} required
                          autoComplete="name" maxLength={100} aria-invalid={!!errors.name}
                          placeholder={t.namePlaceholder} className={`${inputCls} ${errors.name ? errorBorderCls : ''}`} style={inputStyle} />
                        {errors.name && <p className="font-sans text-rose-700" style={{ fontSize: '0.9rem' }}>{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="field-mobile" className={labelCls} style={labelStyle}>{t.mobile}</label>
                        <input id="field-mobile" type="tel" inputMode="tel" value={fields.mobile_number} onChange={setField('mobile_number')} required
                          autoComplete="tel" maxLength={20} aria-invalid={!!errors.mobile}
                          placeholder={t.mobilePlaceholder} className={`${inputCls} ${errors.mobile ? errorBorderCls : ''}`} style={inputStyle} />
                        {errors.mobile && <p className="font-sans text-rose-700" style={{ fontSize: '0.9rem' }}>{errors.mobile}</p>}
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
                                key={mode} type="button" aria-pressed={active}
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
                    </div>

                    {/* ── Your arrival ── */}
                    <div className="space-y-7 pt-2 border-t border-thread-border/50">
                      <p className={sectionLabelCls} style={{ ...sectionLabelStyle, display: 'block', marginTop: '1.5rem' }}>{t.stepArrivalTitle}</p>

                      <div className="space-y-2">
                        <label className={labelCls} style={labelStyle}>{t.arrivalDate}</label>
                        <p className="font-sans text-charcoal" style={{ fontSize: '1.05rem' }}>{t.arrivalDateFixed}</p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="field-time" className={labelCls} style={labelStyle}>
                          {t.arrivalTime}
                        </label>
                        <select id="field-time" value={fields.arrival_time} onChange={setField('arrival_time')} required
                          aria-invalid={!!errors.time}
                          className={`${inputCls} ${errors.time ? errorBorderCls : ''}`} style={inputStyle}>
                          <option value="" disabled>—</option>
                          {ARRIVAL_TIME_VALUES.map((value, i) => (
                            <option key={value} value={value}>{t.arrivalTimeSlots[i]}</option>
                          ))}
                          <option value={OTHER_TIME}>{t.arrivalTimeOther}</option>
                        </select>
                        {errors.time && <p className="font-sans text-rose-700" style={{ fontSize: '0.9rem' }}>{errors.time}</p>}
                        <p className="font-sans text-stone/60" style={{ fontSize: '0.78rem' }}>{t.arrivalTimeHint}</p>
                        {!trainTipApplied && (
                          <p className="font-sans leading-[1.55] text-burgundy flex flex-wrap items-center gap-x-2 gap-y-0.5" style={{ fontSize: '0.85rem' }}>
                            <span className="text-gold"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3" /><path d="M5 11h14M9 21l2-4M15 21l-2-4" /><circle cx="9" cy="14" r="0.8" fill="currentColor" /><circle cx="15" cy="14" r="0.8" fill="currentColor" /></svg></span>
                            <span>{t.trainInlineHint}</span>
                            <button type="button" onClick={applyTrainTip}
                              className="underline underline-offset-4 decoration-gold font-medium min-h-[44px] px-1">
                              {t.trainInlineBtn}
                            </button>
                          </p>
                        )}
                        <p className="font-sans leading-[1.6] text-stone" style={{ fontSize: '0.85rem' }}>{t.arrivalTimeEstimateHint}</p>
                      </div>

                      {fields.arrival_time === OTHER_TIME && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}
                          className="space-y-2 rounded-2xl border-2 border-gold/45 bg-paper-light px-5 py-5"
                        >
                          <label htmlFor="field-other" className={labelCls} style={labelStyle}>{t.arrivalOtherLabel}</label>
                          <p className="font-sans leading-[1.6] text-stone" style={{ fontSize: '0.88rem' }}>{t.arrivalOtherHint}</p>
                          <input id="field-other" type="text" value={fields.arrival_other} onChange={setField('arrival_other')}
                            autoComplete="off" maxLength={120} aria-invalid={!!errors.other}
                            placeholder={t.arrivalOtherPlaceholder}
                            className={`${inputCls} ${errors.other ? errorBorderCls : ''}`} style={inputStyle} />
                          {errors.other && <p className="font-sans text-rose-700" style={{ fontSize: '0.9rem' }}>{errors.other}</p>}
                        </motion.div>
                      )}

                      <p className="font-sans leading-[1.6] text-stone" style={{ fontSize: '0.88rem' }}>
                        {t.arrivalTimeReminder}
                      </p>

                      {/* Kept, but deliberately quieter than the Mehndi reminder
                          above — a footnote-style aside, not a directive. */}
                      <p className="font-sans italic leading-[1.6] text-stone/60" style={{ fontSize: '0.8rem' }}>
                        {t.checkoutTimeReminder}
                      </p>

                      <div className="space-y-2">
                        <label className={labelCls} style={labelStyle}>
                          {t.notesLabel} <span className="normal-case tracking-normal">{t.optionalTag}</span>
                        </label>
                        <p className="font-sans text-stone leading-[1.6]" style={{ fontSize: '0.88rem' }}>
                          {t.notesHint}
                        </p>
                        <textarea value={fields.notes} onChange={setField('notes')} rows={3} maxLength={600} autoComplete="off"
                          className={inputCls} style={inputStyle} />
                      </div>

                      <div className="space-y-2">
                        <label className={labelCls} style={labelStyle}>
                          {travelNumberLabel} <span className="normal-case tracking-normal">{t.optionalTag}</span>
                        </label>
                        <p className="font-sans leading-[1.6] text-stone" style={{ fontSize: '0.85rem' }}>{t.travelNumberHint}</p>
                        {arrivalMode === 'train' && !trainTipApplied && (
                          <p className="font-sans leading-[1.55] text-burgundy flex flex-wrap items-center gap-x-2 gap-y-0.5" style={{ fontSize: '0.85rem' }}>
                            <span className="text-gold"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3" /><path d="M5 11h14M9 21l2-4M15 21l-2-4" /><circle cx="9" cy="14" r="0.8" fill="currentColor" /><circle cx="15" cy="14" r="0.8" fill="currentColor" /></svg></span>
                            <span>{t.trainInlineHint}</span>
                            <button type="button" onClick={applyTrainTip}
                              className="underline underline-offset-4 decoration-gold font-medium min-h-[44px] px-1">
                              {t.trainInlineBtn}
                            </button>
                          </p>
                        )}
                        <input type="text" value={fields.travel_number} onChange={setField('travel_number')} maxLength={80} autoComplete="off"
                          placeholder="e.g. AI-2401" className={inputCls} style={inputStyle} />
                      </div>

                      <div className="space-y-2">
                        <label className={labelCls} style={labelStyle}>
                          {t.guestNamesLabel} <span className="normal-case tracking-normal">{t.optionalTag}</span>
                        </label>
                        <input type="text" value={fields.guest_names} onChange={setField('guest_names')} maxLength={300} autoComplete="off"
                          className={inputCls} style={inputStyle} />
                      </div>
                    </div>

                    {/* ── ID & notes ── */}
                    <div className="space-y-7 pt-2 border-t border-thread-border/50">
                      <p className={sectionLabelCls} style={{ ...sectionLabelStyle, display: 'block', marginTop: '1.5rem' }}>{t.stepFinalTitle}</p>

                      <div id="id-upload-group" className="space-y-3 scroll-mt-24">
                        <label className={labelCls} style={labelStyle}>{t.idUploadLabel}</label>
                        <p className="font-sans text-stone leading-[1.6]" style={{ fontSize: '0.88rem' }}>
                          {t.idUploadHint}
                        </p>

                        <div className="space-y-2">
                          {files.map((f, i) => (
                            <div key={`${f.name}-${i}`}
                              className="flex items-center gap-3 bg-white/70 border border-thread-border/50 pl-3 pr-1 py-2 rounded-xl">
                              {previews[i] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={previews[i] as string} alt="" className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-thread-border/50" />
                              ) : (
                                <span className="w-11 h-11 rounded-lg bg-blush/30 flex items-center justify-center flex-shrink-0 font-sans text-burgundy" style={{ fontSize: '0.7rem' }}>PDF</span>
                              )}
                              <span className="min-w-0 flex-1">
                                <span className="block font-sans text-charcoal truncate" style={{ fontSize: '0.9rem' }}>{f.name}</span>
                                <span className="block font-sans text-stone/60" style={{ fontSize: '0.75rem' }}>{Math.max(1, Math.round(f.size / 1024))} KB</span>
                              </span>
                              <button type="button" onClick={() => removeFile(i)}
                                className="font-sans text-charcoal/50 hover:text-burgundy flex-shrink-0 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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

                        {processing && (
                          <p className="font-sans text-stone" style={{ fontSize: '0.9rem' }}>{t.preparingPhoto}</p>
                        )}
                        {fileError && (
                          <p className="font-sans text-rose-700" style={{ fontSize: '0.9rem' }}>{fileError}</p>
                        )}
                        {errors.id && (
                          <p className="font-sans text-rose-700" style={{ fontSize: '0.9rem' }}>{errors.id}</p>
                        )}
                      </div>
                    </div>

                    {attempted && Object.keys(errors).length > 0 && (
                      <div ref={bannerRef} role="alert" aria-live="assertive"
                        className="scroll-mt-28 rounded-2xl border-2 border-rose-400 bg-rose-50 px-5 py-5">
                        <p className="font-sans font-semibold text-rose-800 mb-1" style={{ fontSize: '1.02rem' }}>{t.formFixTitle}</p>
                        <p className="font-sans text-rose-700/80 mb-3" style={{ fontSize: '0.85rem' }}>{t.formFixTap}</p>
                        <ul className="space-y-2">
                          {FIELD_ORDER.filter((k) => errors[k]).map((k) => (
                            <li key={k}>
                              <button type="button" onClick={() => jumpTo(k)}
                                className="w-full text-left rounded-xl bg-white/80 border border-rose-300 px-4 py-3 font-sans text-rose-900 underline decoration-rose-300 underline-offset-4"
                                style={{ fontSize: '0.95rem' }}>
                                {k === 'name' ? t.fullName : k === 'mobile' ? t.mobile : k === 'time' ? t.arrivalTime : k === 'other' ? t.arrivalOtherLabel : t.idUploadLabel} →
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {formState === 'error' && errorMsg && (
                      <p className="font-sans text-rose-700" style={{ fontSize: '1rem' }}>{errorMsg}</p>
                    )}
                    {steps.length > 0 && (formState === 'submitting' || formState === 'error') && (() => {
                      const done = steps.filter((x) => x.status === 'done').length
                      return (
                        <div ref={progressRef} role="status" aria-live="polite"
                          className="scroll-mt-28 rounded-2xl border-2 border-gold/45 bg-paper-light px-5 py-5 space-y-4">
                          {formState === 'submitting' && (
                            <p className="font-sans font-semibold text-charcoal" style={{ fontSize: '1rem' }}>{t.submitTitle}</p>
                          )}
                          <div>
                            <div className="h-2.5 rounded-full bg-thread-border/40 overflow-hidden">
                              <motion.div className="h-full rounded-full bg-burgundy"
                                initial={false}
                                animate={{ width: `${Math.max(done / steps.length, formState === 'submitting' ? 0.06 : 0) * 100}%` }}
                                transition={{ duration: 0.5, ease: EASE }} />
                            </div>
                            <p className="font-sans text-stone/70 mt-2" style={{ fontSize: '0.8rem' }}>
                              {t.doneOf.replace('{done}', String(done)).replace('{total}', String(steps.length))}
                            </p>
                          </div>
                          <ul className="space-y-2.5">
                            {steps.map((st) => (
                              <li key={st.key} className="flex items-center gap-3 font-sans" style={{ fontSize: '0.92rem' }}>
                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center" aria-label={st.status === 'done' ? t.stepDone : st.status === 'error' ? t.stepFailed : undefined}>
                                  {st.status === 'done' ? (
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" strokeWidth="1.6" /><path d="M7.5 12.5l3 3 6-6.5" /></svg>
                                  ) : st.status === 'error' ? (
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="10" strokeWidth="1.6" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
                                  ) : (
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-burgundy animate-spin motion-reduce:animate-none" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><circle cx="12" cy="12" r="9" strokeOpacity="0.2" /><path d="M21 12a9 9 0 00-9-9" /></svg>
                                  )}
                                </span>
                                <span className={`min-w-0 truncate ${st.status === 'error' ? 'text-rose-700' : 'text-charcoal'}`}>{st.label}</span>
                              </li>
                            ))}
                          </ul>
                          {slow && formState === 'submitting' && (
                            <p className="font-sans leading-[1.6] text-stone" style={{ fontSize: '0.85rem' }}>{t.submitSlow}</p>
                          )}
                        </div>
                      )
                    })()}

                    <button type="submit" disabled={formState === 'submitting'}
                      className="shimmer-btn w-full py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 rounded-sm"
                      style={{ fontSize: '0.9rem', letterSpacing: '0.24em' }}>
                      {formState === 'submitting' ? t.sending : formState === 'error' && steps.some((x) => x.status === 'error') ? t.tryAgainBtn : t.travelConfirmBtn}
                    </button>
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

'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/Language'

type Status = 'joining' | 'unable' | 'not_sure'
type Hand = 'one_hand' | 'both_hands'
type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface Guest {
  id: string
  name: string
  status: Status | null
  hand: Hand | null
}

const EASE = [0.25, 0.1, 0.25, 1] as const

const labelCls = 'block font-sans uppercase text-charcoal/70'
const labelStyle = { fontSize: '0.85rem', letterSpacing: '0.12em' }
const inputCls = 'w-full bg-white/70 border-2 border-thread-border/50 focus:border-burgundy outline-none rounded-xl px-4 py-4 font-sans text-charcoal placeholder:text-stone/40 transition-colors duration-200 min-h-[52px]'
const inputStyle = { fontSize: '1.05rem' }

function newGuest(): Guest {
  return { id: crypto.randomUUID(), name: '', status: null, hand: null }
}

// Segmented pill control shared by the status and hand-preference pickers —
// same visual language as TravelDetailsSection's arrival-mode selector.
function SegmentedControl<T extends string>({
  options, value, onChange, layoutId,
}: { options: { value: T; label: string }[]; value: T | null; onChange: (v: T) => void; layoutId: string }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value} type="button"
            onClick={() => onChange(opt.value)}
            className="relative flex items-center justify-center rounded-xl py-3 px-2 border-2 transition-colors duration-200 overflow-hidden"
            style={{ borderColor: active ? '#760D25' : 'rgba(216,198,173,0.6)' }}
          >
            {active && (
              <motion.div layoutId={layoutId} className="absolute inset-0 bg-burgundy" transition={{ duration: 0.3, ease: EASE }} />
            )}
            <span className="relative z-10 font-sans text-center" style={{ fontSize: '0.85rem', color: active ? '#FFF9F1' : '#303632' }}>
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function MehndiRSVPSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { t } = useLang()

  const [submittedByName, setSubmittedByName] = useState('')
  const [submittedByMobile, setSubmittedByMobile] = useState('')
  const [guests, setGuests] = useState<Guest[]>([newGuest()])
  const [reviewing, setReviewing] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const isSubmittingRef = useRef(false)

  function updateGuest(id: string, patch: Partial<Guest>) {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)))
  }
  function addGuest() {
    setGuests((prev) => [...prev, newGuest()])
  }
  function removeGuest(id: string) {
    setGuests((prev) => (prev.length > 1 ? prev.filter((g) => g.id !== id) : prev))
  }

  function goToReview(e: React.FormEvent) {
    e.preventDefault()
    if (!submittedByName.trim() || !submittedByMobile.trim()) {
      setErrorMsg(t.mehndiMissingNameError)
      return
    }
    for (const g of guests) {
      if (!g.name.trim() || !g.status || (g.status === 'joining' && !g.hand)) {
        setErrorMsg(t.mehndiErrorGeneric)
        return
      }
    }
    setErrorMsg('')
    setReviewing(true)
  }

  async function handleSubmit() {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setFormState('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/mehndi-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submitted_by_name: submittedByName,
          submitted_by_mobile: submittedByMobile,
          guests: guests.map((g) => ({ name: g.name, status: g.status, hand_preference: g.hand })),
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setErrorMsg(json.error ?? t.mehndiErrorGeneric)
        setFormState('error')
        return
      }
      setFormState('success')
    } catch {
      setErrorMsg(t.mehndiErrorGeneric)
      setFormState('error')
    } finally {
      isSubmittingRef.current = false
    }
  }

  const statusOptions: { value: Status; label: string }[] = [
    { value: 'joining', label: t.mehndiStatusJoining },
    { value: 'unable', label: t.mehndiStatusUnable },
    { value: 'not_sure', label: t.mehndiStatusNotSure },
  ]
  const handOptions: { value: Hand; label: string }[] = [
    { value: 'one_hand', label: t.mehndiHandOne },
    { value: 'both_hands', label: t.mehndiHandBoth },
  ]

  return (
    <section id="mehndi-rsvp" ref={ref} className="bg-blush/15 relative overflow-hidden scroll-mt-20">
      <div className="relative px-7 md:px-14 py-14 md:py-16">
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
                  <div className="w-12 h-[2px] bg-gold mx-auto mb-8" />
                  <h2 className="font-serif italic leading-[1.2] text-charcoal mb-5"
                    style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>
                    {t.mehndiSuccessHeading}
                  </h2>
                  <p className="font-sans leading-[1.9] text-stone" style={{ fontSize: '1.1rem' }}>
                    {t.mehndiSuccessBody.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <p className="font-sans uppercase text-burgundy mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.16em' }}>
                    {t.mehndiEyebrow}
                  </p>
                  <div className="w-12 h-[2px] bg-gold mb-7" />
                  <p className="font-sans leading-[1.85] text-stone mb-10" style={{ fontSize: '1.05rem' }}>
                    {t.mehndiIntro}
                  </p>

                  {!reviewing ? (
                    <form onSubmit={goToReview} className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className={labelCls} style={labelStyle}>{t.mehndiYourName}</label>
                          <input type="text" value={submittedByName} onChange={(e) => setSubmittedByName(e.target.value)}
                            required placeholder="Your name" className={inputCls} style={inputStyle} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelCls} style={labelStyle}>{t.mehndiYourMobile}</label>
                          <input type="tel" value={submittedByMobile} onChange={(e) => setSubmittedByMobile(e.target.value)}
                            required placeholder="10-digit mobile number" className={inputCls} style={inputStyle} />
                        </div>
                      </div>

                      <div className="space-y-6">
                        {guests.map((g, idx) => (
                          <div key={g.id} className="rounded-2xl border-2 border-thread-border/50 bg-white/50 p-5 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="font-sans uppercase text-burgundy" style={{ fontSize: '0.72rem', letterSpacing: '0.16em' }}>
                                {t.mehndiGuestNameLabel} {idx + 1}
                              </span>
                              {guests.length > 1 && (
                                <button type="button" onClick={() => removeGuest(g.id)}
                                  className="font-sans text-charcoal/50 hover:text-burgundy transition-colors" style={{ fontSize: '0.85rem' }}>
                                  {t.mehndiRemoveGuest} ✕
                                </button>
                              )}
                            </div>

                            <input type="text" value={g.name} onChange={(e) => updateGuest(g.id, { name: e.target.value })}
                              required placeholder={t.mehndiGuestNameLabel} className={inputCls} style={inputStyle} />

                            <div className="space-y-2">
                              <label className={labelCls} style={labelStyle}>{t.mehndiStatusLabel}</label>
                              <SegmentedControl
                                options={statusOptions}
                                value={g.status}
                                onChange={(v) => updateGuest(g.id, { status: v, hand: v === 'joining' ? g.hand : null })}
                                layoutId={`status-${g.id}`}
                              />
                            </div>

                            {g.status === 'joining' && (
                              <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>{t.mehndiHandLabel}</label>
                                <SegmentedControl
                                  options={handOptions}
                                  value={g.hand}
                                  onChange={(v) => updateGuest(g.id, { hand: v })}
                                  layoutId={`hand-${g.id}`}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <button type="button" onClick={addGuest}
                        className="font-sans uppercase text-burgundy underline decoration-gold/60 underline-offset-4 hover:text-[#5c0a1c] transition-colors"
                        style={{ fontSize: '0.82rem', letterSpacing: '0.14em' }}>
                        {t.mehndiAddGuest}
                      </button>

                      {errorMsg && <p className="font-sans text-rose-700" style={{ fontSize: '0.95rem' }}>{errorMsg}</p>}

                      <button type="submit"
                        className="shimmer-btn w-full py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] transition-colors duration-300 rounded-sm"
                        style={{ fontSize: '0.9rem', letterSpacing: '0.24em' }}>
                        {t.mehndiReviewBtn}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-8">
                      <p className="font-serif italic text-charcoal" style={{ fontSize: '1.2rem' }}>
                        {t.mehndiReviewHeading}
                      </p>
                      <p className="font-sans text-stone" style={{ fontSize: '0.95rem' }}>{t.mehndiReviewIntro}</p>

                      <div className="rounded-2xl border-2 border-thread-border/50 bg-white/60 p-5 space-y-1">
                        <p className="font-sans text-charcoal" style={{ fontSize: '1rem' }}>{submittedByName}</p>
                        <p className="font-sans text-stone" style={{ fontSize: '0.9rem' }}>{submittedByMobile}</p>
                      </div>

                      <div className="space-y-3">
                        {guests.map((g) => (
                          <div key={g.id} className="flex items-center justify-between rounded-xl border border-thread-border/50 bg-white/60 px-4 py-3">
                            <div>
                              <p className="font-sans text-charcoal" style={{ fontSize: '0.98rem' }}>{g.name}</p>
                              <p className="font-sans text-stone" style={{ fontSize: '0.85rem' }}>
                                {statusOptions.find((o) => o.value === g.status)?.label}
                                {g.status === 'joining' && g.hand && ` · ${handOptions.find((o) => o.value === g.hand)?.label}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-3">
                        {errorMsg && formState === 'error' && (
                          <p className="font-sans text-rose-700" style={{ fontSize: '0.95rem' }}>{errorMsg}</p>
                        )}
                        <button type="button" onClick={handleSubmit} disabled={formState === 'submitting'}
                          className="shimmer-btn w-full py-4 bg-burgundy text-paper-light font-sans uppercase hover:bg-[#5c0a1c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 rounded-sm"
                          style={{ fontSize: '0.9rem', letterSpacing: '0.24em' }}>
                          {formState === 'submitting' ? t.mehndiSending : t.mehndiSubmitBtn}
                        </button>
                        <button type="button" onClick={() => setReviewing(false)}
                          className="font-sans uppercase text-charcoal/60 hover:text-burgundy transition-colors" style={{ fontSize: '0.8rem', letterSpacing: '0.14em' }}>
                          {t.mehndiEditBtn}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

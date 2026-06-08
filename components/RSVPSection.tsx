'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/Language'

type FormState = 'idle' | 'submitting' | 'success' | 'error' | 'duplicate'
type TravelMode = 'flight' | 'train' | 'road'

const EASE = [0.25, 0.1, 0.25, 1] as const

const labelCls = 'block font-sans uppercase text-warm-gray'
const labelStyle = { fontSize: '0.72rem', letterSpacing: '0.35em' }
const inputCls = 'w-full bg-transparent border-b border-parchment focus:border-charcoal outline-none py-3 font-sans text-charcoal placeholder:text-parchment transition-colors duration-200'
const inputStyle = { fontSize: '1rem' }

export default function RSVPSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { t } = useLang()

  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null)
  const [guestCountStr, setGuestCountStr] = useState('')
  const [guestNames, setGuestNames] = useState<string[]>([])
  const [travelMode, setTravelMode] = useState<TravelMode | null>(null)

  useEffect(() => {
    const n = parseInt(guestCountStr) || 0
    const clamped = Math.min(Math.max(n, 0), 10)
    setGuestNames((prev) => {
      if (clamped === prev.length) return prev
      if (clamped > prev.length) return [...prev, ...Array(clamped - prev.length).fill('')]
      return prev.slice(0, clamped)
    })
  }, [guestCountStr])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('submitting')
    setErrorMsg('')

    const fd = new FormData(e.currentTarget)
    const full_name = fd.get('full_name') as string
    const mobile_number = fd.get('mobile_number') as string
    const attendingVal = fd.get('attending') as string

    if (!attendingVal) {
      setErrorMsg('Please let us know if you will be attending.')
      setFormState('error')
      return
    }

    const isAttending = attendingVal === 'yes'
    const guestCount = parseInt(guestCountStr) || 0

    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name, mobile_number, attending: isAttending,
        guest_count: isAttending ? guestCount : 0,
        guest_names: isAttending ? guestNames.filter((n) => n.trim()) : [],
        travel_mode: isAttending ? travelMode : undefined,
      }),
    })

    const json = await res.json()
    if (res.status === 409) { setFormState('duplicate'); return }
    if (!res.ok) {
      setErrorMsg(json.error ?? 'Something went wrong. Please try again.')
      setFormState('error')
      return
    }
    setFormState('success')
  }

  return (
    <section id="rsvp" ref={ref} className="bg-ivory relative overflow-hidden">
      <div className="absolute left-[-2%] top-1/2 -translate-y-1/2 pointer-events-none select-none" aria-hidden>
        <span className="font-serif italic leading-none text-charcoal/[0.03]"
          style={{ fontSize: 'clamp(120px, 16vw, 240px)' }}>
          RSVP
        </span>
      </div>

      <div className="relative px-7 md:px-14 py-16 md:py-24">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <AnimatePresence mode="wait">
              {/* Success */}
              {formState === 'success' ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="py-14 text-center">
                  <div className="w-10 h-px bg-blush mx-auto mb-10" />
                  <p className="font-sans uppercase text-warm-gray mb-6"
                    style={{ fontSize: '0.75rem', letterSpacing: '0.4em' }}>
                    {t.responseReceived}
                  </p>
                  <h2 className="font-serif italic leading-[1.2] text-charcoal mb-6"
                    style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>
                    {t.thankYou}
                  </h2>
                  <p className="font-sans font-light leading-[1.9] text-stone mb-8"
                    style={{ fontSize: '1.05rem' }}>
                    {t.thankYouBody.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
                  </p>
                  <p className="font-serif text-charcoal mb-3" style={{ fontSize: '1.15rem' }}>
                    {t.withLove}
                  </p>
                  <p className="font-display text-blush" style={{ fontSize: '1.8rem' }}>
                    #SakshiKoMilaKinara
                  </p>
                </motion.div>

              ) : formState === 'duplicate' ? (
                <motion.div key="duplicate" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }} className="py-14 text-center">
                  <div className="w-10 h-px bg-blush mx-auto mb-10" />
                  <h2 className="font-serif italic text-charcoal mb-5" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)' }}>
                    {t.alreadyReceived}
                  </h2>
                  <p className="font-sans font-light leading-[1.9] text-stone" style={{ fontSize: '1.05rem' }}>
                    {t.alreadyBody.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
                  </p>
                </motion.div>

              ) : (
                /* Form */
                <motion.div key="form">
                  <div className="w-10 h-px bg-blush mb-9" />
                  <p className="font-sans uppercase text-warm-gray mb-2"
                    style={{ fontSize: '0.72rem', letterSpacing: '0.45em' }}>
                    {t.rsvpDeadlineLabel}
                  </p>
                  {/* Deadline date — visually prominent */}
                  <p className="font-serif italic mb-4"
                    style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', color: '#6E1A28' }}>
                    {t.deadline}
                  </p>
                  <p className="font-sans font-light leading-[1.85] text-stone mb-9"
                    style={{ fontSize: '1.05rem' }}>
                    {t.arrangementNote}
                  </p>
                  <h2 className="font-serif leading-[1.15] text-charcoal mb-10"
                    style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', whiteSpace: 'pre-line' }}>
                    {t.confirmPresence}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className={labelCls} style={labelStyle}>{t.fullName}</label>
                      <input type="text" name="full_name" required
                        placeholder="Your name" className={inputCls} style={inputStyle} />
                    </div>

                    {/* Mobile */}
                    <div className="space-y-2">
                      <label className={labelCls} style={labelStyle}>{t.mobile}</label>
                      <input type="tel" name="mobile_number" required
                        placeholder="10-digit mobile number" className={inputCls} style={inputStyle} />
                    </div>

                    {/* Attendance */}
                    <div className="space-y-4">
                      <label className={labelCls} style={labelStyle}>{t.attending}</label>
                      <div className="flex gap-8">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="radio" name="attending" value="yes" required onChange={() => setAttending('yes')} />
                          <span className="font-sans text-stone group-hover:text-charcoal transition-colors"
                            style={{ fontSize: '1rem' }}>
                            {t.yesAttend}
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="radio" name="attending" value="no" onChange={() => setAttending('no')} />
                          <span className="font-sans text-stone group-hover:text-charcoal transition-colors"
                            style={{ fontSize: '1rem' }}>
                            {t.noAttend}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Conditional fields — NO height animation, NO overflow-hidden (blocks inputs on mobile) */}
                    <AnimatePresence>
                      {attending === 'yes' && (
                        <motion.div key="yes-fields"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                          className="space-y-8">

                          {/* Guest count */}
                          <div className="space-y-2">
                            <label className={labelCls} style={labelStyle}>{t.guestCount}</label>
                            <p className="font-sans text-warm-gray/70" style={{ fontSize: '0.85rem' }}>
                              {t.guestCountNote}
                            </p>
                            <input type="number" min="0" max="10"
                              value={guestCountStr}
                              onChange={(e) => setGuestCountStr(e.target.value)}
                              placeholder="0"
                              className="w-24 bg-transparent border-b border-parchment focus:border-charcoal outline-none py-3 font-sans text-charcoal placeholder:text-parchment transition-colors duration-200"
                              style={inputStyle}
                            />
                          </div>

                          {/* Dynamic guest names — plain divs, no overflow:hidden (breaks input focus) */}
                          {guestNames.length > 0 && (
                            <div className="space-y-6">
                              <p className={labelCls} style={labelStyle}>{t.guestNames}</p>
                              {guestNames.map((name, i) => (
                                <div key={i} className="space-y-1">
                                  <label className="block font-sans uppercase text-warm-gray/70"
                                    style={{ fontSize: '0.68rem', letterSpacing: '0.3em' }}>
                                    {t.guestLabel} {i + 1}
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    value={name}
                                    onChange={(e) => {
                                      const u = [...guestNames]
                                      u[i] = e.target.value
                                      setGuestNames(u)
                                    }}
                                    placeholder={`${t.guestLabel} ${i + 1} full name`}
                                    className="w-full bg-transparent border-b border-parchment focus:border-charcoal outline-none py-2.5 font-sans text-charcoal placeholder:text-parchment transition-colors duration-200"
                                    style={{ fontSize: '0.95rem' }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Travel mode */}
                          <div className="space-y-4">
                            <label className={labelCls} style={labelStyle}>{t.travelMode}</label>
                            <div className="flex flex-wrap gap-x-7 gap-y-3">
                              {([
                                { value: 'flight' as TravelMode, label: t.byFlight },
                                { value: 'train' as TravelMode, label: t.byTrain },
                                { value: 'road' as TravelMode, label: t.byRoad },
                              ]).map(({ value, label }) => (
                                <label key={value} className="flex items-center gap-3 cursor-pointer group">
                                  <input type="radio" name="travel_mode" value={value}
                                    onChange={() => setTravelMode(value)} />
                                  <span className="font-sans text-stone group-hover:text-charcoal transition-colors"
                                    style={{ fontSize: '1rem' }}>
                                    {label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {formState === 'error' && errorMsg && (
                      <p className="font-sans text-rose-700" style={{ fontSize: '0.9rem' }}>{errorMsg}</p>
                    )}

                    <div className="pt-2">
                      <button type="submit" disabled={formState === 'submitting'}
                        className="w-full py-4 bg-charcoal text-cream font-sans uppercase hover:bg-stone disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                        style={{ fontSize: '0.85rem', letterSpacing: '0.35em' }}>
                        {formState === 'submitting' ? t.sending : t.confirmBtn}
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

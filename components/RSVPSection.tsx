'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

type FormState = 'idle' | 'submitting' | 'success' | 'error' | 'duplicate'
type TravelMode = 'flight' | 'train' | 'road'

const EASE = [0.25, 0.1, 0.25, 1] as const

export default function RSVPSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null)
  const [guestCountStr, setGuestCountStr] = useState('')
  const [guestNames, setGuestNames] = useState<string[]>([])
  const [travelMode, setTravelMode] = useState<TravelMode | null>(null)

  // Sync guestNames array length when count changes
  useEffect(() => {
    const n = parseInt(guestCountStr) || 0
    const clamped = Math.min(Math.max(n, 0), 10)
    setGuestNames((prev) => {
      if (clamped === prev.length) return prev
      if (clamped > prev.length) {
        return [...prev, ...Array(clamped - prev.length).fill('')]
      }
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
        full_name,
        mobile_number,
        attending: isAttending,
        guest_count: isAttending ? guestCount : 0,
        guest_names: isAttending ? guestNames.filter((n) => n.trim()) : [],
        travel_mode: isAttending ? travelMode : undefined,
      }),
    })

    const json = await res.json()

    if (res.status === 409) {
      setFormState('duplicate')
      return
    }

    if (!res.ok) {
      setErrorMsg(json.error ?? 'Something went wrong. Please try again.')
      setFormState('error')
      return
    }

    setFormState('success')
  }

  return (
    <section id="rsvp" ref={ref} className="bg-ivory relative overflow-hidden">
      {/* Background RSVP lettering */}
      <div
        className="absolute left-[-2%] top-1/2 -translate-y-1/2 pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="font-serif italic leading-none text-charcoal/[0.03]"
          style={{ fontSize: 'clamp(120px, 16vw, 240px)' }}
        >
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
              {/* ── Success state ── */}
              {formState === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="py-14 text-center"
                >
                  <div className="w-10 h-px bg-blush mx-auto mb-10" />
                  <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-warm-gray mb-6">
                    Response Received
                  </p>
                  <h2 className="font-serif text-[2.2rem] md:text-[2.8rem] italic leading-[1.2] text-charcoal mb-6">
                    Thank you.
                  </h2>
                  <p className="font-sans font-light text-[0.9rem] leading-[1.9] text-stone mb-8">
                    Your response has been received.
                    <br />
                    We&apos;re looking forward to celebrating together.
                  </p>
                  <p className="font-serif text-[1.1rem] text-charcoal mb-3">
                    With love, Sakshi &amp; Sahil
                  </p>
                  <p className="font-display text-[1.6rem] text-blush">
                    #SakshiKoMilaKinara
                  </p>
                </motion.div>

              ) : formState === 'duplicate' ? (
                <motion.div
                  key="duplicate"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="py-14 text-center"
                >
                  <div className="w-10 h-px bg-blush mx-auto mb-10" />
                  <h2 className="font-serif text-[2rem] italic text-charcoal mb-5">
                    Already received.
                  </h2>
                  <p className="font-sans font-light text-[0.9rem] leading-[1.9] text-stone">
                    We already have your response on file.
                    <br />
                    Thank you — see you in Pitampura, Delhi.
                  </p>
                </motion.div>

              ) : (
                /* ── Form ── */
                <motion.div key="form">
                  <div className="w-10 h-px bg-blush mb-9" />

                  <p className="font-sans text-[9px] tracking-[0.45em] uppercase text-warm-gray mb-3">
                    Kindly respond by 18 June 2026
                  </p>
                  <h2 className="font-serif text-[1.9rem] md:text-[2.5rem] leading-[1.15] text-charcoal mb-10">
                    Confirm Your
                    <br />
                    Presence
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="block font-sans text-[9px] tracking-[0.35em] uppercase text-warm-gray">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        required
                        placeholder="Your name"
                        className="w-full bg-transparent border-b border-parchment focus:border-charcoal outline-none py-3 font-sans text-[0.95rem] text-charcoal placeholder:text-parchment transition-colors duration-200"
                      />
                    </div>

                    {/* Mobile */}
                    <div className="space-y-2">
                      <label className="block font-sans text-[9px] tracking-[0.35em] uppercase text-warm-gray">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="mobile_number"
                        required
                        placeholder="10-digit mobile number"
                        className="w-full bg-transparent border-b border-parchment focus:border-charcoal outline-none py-3 font-sans text-[0.95rem] text-charcoal placeholder:text-parchment transition-colors duration-200"
                      />
                    </div>

                    {/* Attendance */}
                    <div className="space-y-4">
                      <label className="block font-sans text-[9px] tracking-[0.35em] uppercase text-warm-gray">
                        Will you be attending?
                      </label>
                      <div className="flex gap-8">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="attending"
                            value="yes"
                            required
                            onChange={() => setAttending('yes')}
                          />
                          <span className="font-sans text-[0.9rem] text-stone group-hover:text-charcoal transition-colors">
                            Yes, I&apos;ll be there
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="attending"
                            value="no"
                            onChange={() => setAttending('no')}
                          />
                          <span className="font-sans text-[0.9rem] text-stone group-hover:text-charcoal transition-colors">
                            Unable to attend
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Conditional attending fields */}
                    <AnimatePresence>
                      {attending === 'yes' && (
                        <motion.div
                          key="attending-fields"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="overflow-hidden space-y-8"
                        >
                          {/* Number of additional guests */}
                          <div className="space-y-2">
                            <label className="block font-sans text-[9px] tracking-[0.35em] uppercase text-warm-gray">
                              How many guests are you bringing?
                            </label>
                            <p className="font-sans text-[11px] text-warm-gray/70">
                              Enter 0 if you&apos;re attending alone
                            </p>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={guestCountStr}
                              onChange={(e) => setGuestCountStr(e.target.value)}
                              placeholder="0"
                              className="w-24 bg-transparent border-b border-parchment focus:border-charcoal outline-none py-3 font-sans text-[0.95rem] text-charcoal placeholder:text-parchment transition-colors duration-200"
                            />
                          </div>

                          {/* Dynamic guest name fields */}
                          <AnimatePresence>
                            {guestNames.length > 0 && (
                              <motion.div
                                key="guest-names"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className="overflow-hidden space-y-6"
                              >
                                <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-warm-gray">
                                  Guest Names
                                </p>
                                {guestNames.map((name, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: i * 0.06 }}
                                    className="space-y-1"
                                  >
                                    <label className="block font-sans text-[8px] tracking-[0.3em] uppercase text-warm-gray/70">
                                      Guest {i + 1}
                                    </label>
                                    <input
                                      type="text"
                                      value={name}
                                      onChange={(e) => {
                                        const updated = [...guestNames]
                                        updated[i] = e.target.value
                                        setGuestNames(updated)
                                      }}
                                      placeholder={`Guest ${i + 1} full name`}
                                      className="w-full bg-transparent border-b border-parchment focus:border-charcoal outline-none py-2.5 font-sans text-[0.9rem] text-charcoal placeholder:text-parchment transition-colors duration-200"
                                    />
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Travel mode */}
                          <div className="space-y-4">
                            <label className="block font-sans text-[9px] tracking-[0.35em] uppercase text-warm-gray">
                              How are you planning to travel to Delhi?
                            </label>
                            <div className="flex flex-wrap gap-x-7 gap-y-3">
                              {(
                                [
                                  { value: 'flight', label: 'By Flight' },
                                  { value: 'train', label: 'By Train' },
                                  { value: 'road', label: 'By Road' },
                                ] as { value: TravelMode; label: string }[]
                              ).map(({ value, label }) => (
                                <label key={value} className="flex items-center gap-3 cursor-pointer group">
                                  <input
                                    type="radio"
                                    name="travel_mode"
                                    value={value}
                                    onChange={() => setTravelMode(value)}
                                  />
                                  <span className="font-sans text-[0.9rem] text-stone group-hover:text-charcoal transition-colors">
                                    {label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Error */}
                    {formState === 'error' && errorMsg && (
                      <p className="font-sans text-[0.8rem] text-rose-700">{errorMsg}</p>
                    )}

                    {/* Submit */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={formState === 'submitting'}
                        className="w-full py-4 bg-charcoal text-cream font-sans text-[10px] tracking-[0.35em] uppercase hover:bg-stone disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                      >
                        {formState === 'submitting' ? 'Sending…' : 'Confirm Attendance'}
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

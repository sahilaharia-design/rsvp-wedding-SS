'use client'

// "Are you excited?" — the playful countdown hub. Three ideas in one section:
//   1. a tap-to-cheer excitement meter (levels, confetti on level-up)
//   2. "Road to the wedding": four stages that unlock on set dates, so the
//      guest sees what's coming and when (locked stages show a countdown)
//   3. a "wedding-ready" ring that fills as they finish real tasks
//      (confirm travel, RSVP, explore looks…) — which also nudges the actions
//      the hosts actually need.
// Everything is client-side (localStorage), decorative motion respects
// reduced-motion, and every string is in EN/HI/GU.
import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/Language'
import { AUDIENCE_CONFIG, type Audience } from '@/lib/audience'
import { addTap, markTask, readGame, subscribeGame, type GameState } from '@/lib/gameStore'
import Confetti from '@/components/Confetti'

const EASE = [0.25, 0.1, 0.25, 1] as const
const WEDDING = '2027-01-20'
const LEVELS = [0, 1, 5, 15, 30, 50] // taps needed for each level

interface StageDef { id: 'plan' | 'pack' | 'arrive' | 'live'; start: string | null }
const STAGES: StageDef[] = [
  { id: 'plan', start: null },
  { id: 'pack', start: '2027-01-01' },
  { id: 'arrive', start: '2027-01-13' },
  { id: 'live', start: '2027-01-20' },
]

const todayIST = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
const dayDiff = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000)

interface Task { id: string; label: string; href: string; external?: boolean }

export default function ExcitementHub({ audience }: { audience: Audience }) {
  const { t } = useLang()
  const cfg = AUDIENCE_CONFIG[audience]
  const isGroom = audience === 'groom'
  const [game, setGame] = useState<GameState>({ taps: 0, done: {} })
  const [today, setToday] = useState<string | null>(null)
  const [burst, setBurst] = useState(0)
  const [pop, setPop] = useState(0)

  useEffect(() => {
    setGame(readGame())
    setToday(todayIST())
    return subscribeGame(() => setGame(readGame()))
  }, [])

  const level = LEVELS.reduce((l, need, i) => (game.taps >= need ? i : l), 0)
  const nextNeed = LEVELS[level + 1]
  const levelProgress = nextNeed === undefined ? 1 : (game.taps - LEVELS[level]) / (nextNeed - LEVELS[level])
  const levelLabels = [t.exL0, t.exL1, t.exL2, t.exL3, t.exL4, t.exL5]

  const cheer = useCallback(() => {
    const before = readGame().taps
    const next = addTap()
    setPop((p) => p + 1)
    try { navigator.vibrate?.(12) } catch { /* not supported */ }
    const lvl = (n: number) => LEVELS.reduce((l, need, i) => (n >= need ? i : l), 0)
    if (lvl(next.taps) > lvl(before) && lvl(next.taps) > 0) setBurst((b) => b + 1)
  }, [])

  const daysToGo = today ? dayDiff(today, WEDDING) : null
  const daysLabel = daysToGo === null ? '' : daysToGo > 1 ? t.exDaysToGo.replace('{n}', String(daysToGo)) : daysToGo === 1 ? t.exOneDay : t.exToday

  // Tasks per stage — links point at pages that already exist.
  const tasksByStage: Record<StageDef['id'], Task[]> = useMemo(() => ({
    plan: [
      ...(isGroom ? [{ id: 'travel', label: t.exTaskTravel, href: '/groom/travel' }] : []),
      { id: 'mehndi', label: t.exTaskMehndi, href: `${cfg.route}#mehndi-rsvp`, external: true },
      { id: 'looks', label: t.exTaskLooks, href: cfg.themesRoute },
      { id: 'faq', label: t.exTaskFaq, href: cfg.faqRoute },
    ],
    pack: [{ id: 'weather', label: t.exTaskWeather, href: `${cfg.faqRoute}#weather` }],
    arrive: [{ id: 'arrival', label: t.exTaskArrival, href: `${cfg.faqRoute}#${isGroom ? 'travel' : 'save-the-date'}` }],
    live: [],
  }), [t, cfg, isGroom])

  const stageState = (s: StageDef) => {
    if (!today) return { open: s.id === 'plan', days: 0 }
    if (!s.start) return { open: true, days: 0 }
    const d = dayDiff(today, s.start)
    return { open: d <= 0, days: d }
  }
  const stageText: Record<StageDef['id'], { title: string; body: string; date: string }> = {
    plan: { title: t.exStage1T, body: t.exStage1B, date: '' },
    pack: { title: t.exStage2T, body: t.exStage2B, date: t.exStage2Date },
    arrive: { title: t.exStage3T, body: t.exStage3B, date: t.exStage3Date },
    live: { title: t.exStage4T, body: t.exStage4B, date: t.exStage4Date },
  }

  const openTasks = STAGES.flatMap((s) => (stageState(s).open ? tasksByStage[s.id] : []))
  const doneCount = openTasks.filter((k) => game.done[k.id]).length
  const pct = openTasks.length ? Math.round((doneCount / openTasks.length) * 100) : 0
  const ready = openTasks.length > 0 && doneCount === openTasks.length

  // Celebrate finishing everything that's currently open (once per completion).
  const [celebrated, setCelebrated] = useState(false)
  useEffect(() => {
    if (ready && !celebrated) { setCelebrated(true); setBurst((b) => b + 1) }
    if (!ready && celebrated) setCelebrated(false)
  }, [ready, celebrated])

  const events = [
    { name: t.exEvMehndi, when: t.exEvMehndiWhen, date: '2027-01-20' },
    { name: t.exEvEngage, when: t.exEvEngageWhen, date: '2027-01-20' },
    { name: t.exEvHaldi, when: t.exEvHaldiWhen, date: '2027-01-21' },
    { name: t.exEvWedding, when: t.exEvWeddingWhen, date: '2027-01-21' },
  ]
  const RING = 2 * Math.PI * 26

  return (
    <section id="excited" className="bg-paper px-6 md:px-14 py-14 md:py-20 scroll-mt-20 relative overflow-hidden">
      {burst > 0 && <Confetti key={burst} />}
      <div className="max-w-xl mx-auto">
        {/* ── Are you excited? ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE }} className="text-center"
        >
          <p className="font-sans uppercase text-gold mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.3em' }}>{t.exEyebrow}</p>
          <h2 className="font-serif italic text-ink leading-[1.1] mb-3" style={{ fontSize: 'clamp(2rem, 7vw, 3rem)' }}>{t.exHeading}</h2>
          <p className="font-sans text-stone leading-[1.6] mb-7" style={{ fontSize: '1rem' }}>{t.exSub}</p>

          {/* Tap-to-cheer */}
          <div className="relative mx-auto mb-6 flex items-center justify-center" style={{ width: 156, height: 156 }}>
            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-burgundy/15 animate-ping motion-reduce:animate-none" style={{ animationDuration: '2.6s' }} />
            <span aria-hidden="true" className="absolute inset-2 rounded-full bg-gold/15" />
            <motion.button
              key={pop}
              type="button" onClick={cheer}
              initial={{ scale: pop ? 0.88 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 14 }}
              aria-label={t.exTapBtn}
              className="relative w-[124px] h-[124px] rounded-full bg-burgundy text-paper-light shadow-xl flex flex-col items-center justify-center gap-1 select-none touch-manipulation"
            >
              <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor" aria-hidden="true">
                <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2 0 3.5 1 4.6 2.6C12.1 6 13.6 5 15.6 5 19 5 21.1 8.4 19.6 11.8 17.5 16.4 12 21 12 21z" />
              </svg>
              <span className="font-sans uppercase" style={{ fontSize: '0.62rem', letterSpacing: '0.16em' }}>{t.exTapBtn}</span>
            </motion.button>
          </div>

          {/* Meter */}
          <div aria-live="polite">
            <p className="font-serif text-ink" style={{ fontSize: '1.35rem' }}>{levelLabels[level]}</p>
            <div className="mx-auto mt-3 flex gap-1.5 max-w-xs" aria-hidden="true">
              {LEVELS.slice(1).map((_, i) => (
                <span key={i} className="relative h-2.5 flex-1 rounded-full bg-thread-border/50 overflow-hidden">
                  <motion.span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold to-burgundy"
                    initial={false}
                    animate={{ width: `${level > i + 0 ? 100 : level === i ? Math.max(0, levelProgress) * 100 : 0}%` }}
                    transition={{ duration: 0.4, ease: EASE }} />
                </span>
              ))}
            </div>
            <p className="font-sans text-stone/70 mt-2" style={{ fontSize: '0.8rem' }}>
              {game.taps === 1 ? t.exTaps1 : t.exTaps.replace('{n}', String(game.taps))}{daysLabel ? ` · ${daysLabel}` : ''}
            </p>
          </div>
        </motion.div>

        {/* ── Celebrations countdown chips ── */}
        <div className="mt-10">
          <p className="font-sans uppercase text-burgundy mb-3 text-center" style={{ fontSize: '0.74rem', letterSpacing: '0.2em' }}>{t.exEventsTitle}</p>
          <div className="grid grid-cols-2 gap-2.5">
            {events.map((e) => {
              const d = today ? dayDiff(today, e.date) : null
              return (
                <div key={e.name} className="rounded-xl border border-thread-border/60 bg-paper-light px-3 py-3 text-center">
                  <p className="font-serif text-ink leading-tight" style={{ fontSize: '1.02rem' }}>{e.name}</p>
                  <p className="font-sans text-stone/70 mt-0.5" style={{ fontSize: '0.72rem' }}>{e.when}</p>
                  {d !== null && (
                    <p className="font-sans text-burgundy font-medium mt-1.5" style={{ fontSize: '0.8rem' }}>
                      {d > 1 ? t.exInDays.replace('{n}', String(d)) : d === 1 ? t.exTomorrow : d === 0 ? t.exToday : ''}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Road to the wedding ── */}
        <div className="mt-12">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="font-serif text-ink leading-tight" style={{ fontSize: '1.6rem' }}>{t.exRoadTitle}</h3>
              <p className="font-sans text-stone/80 mt-1" style={{ fontSize: '0.88rem' }}>{t.exRoadSub}</p>
            </div>
            <div className="relative flex-shrink-0" style={{ width: 64, height: 64 }} role="img" aria-label={`${t.exProgress} ${pct}%`}>
              <svg viewBox="0 0 64 64" width="64" height="64" className="-rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(216,198,173,0.6)" strokeWidth="6" />
                <motion.circle cx="32" cy="32" r="26" fill="none" stroke="#760D25" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={RING} initial={false} animate={{ strokeDashoffset: RING * (1 - pct / 100) }} transition={{ duration: 0.7, ease: EASE }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-sans font-semibold text-burgundy" style={{ fontSize: '0.85rem' }}>{pct}%</span>
            </div>
          </div>
          {ready && (
            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl bg-emerald/10 border border-emerald/30 px-4 py-2.5 font-sans text-emerald text-center" style={{ fontSize: '0.92rem' }}>
              {t.exReady}
            </motion.p>
          )}

          <ol className="space-y-3">
            {STAGES.map((s, i) => {
              const st = stageState(s)
              const txt = stageText[s.id]
              const tasks = tasksByStage[s.id]
              return (
                <li key={s.id} className={`relative rounded-2xl border-2 px-4 py-4 transition-colors ${st.open ? 'border-gold/60 bg-paper-light' : 'border-dashed border-thread-border/70 bg-paper/60'}`}>
                  <div className="flex items-start gap-3.5">
                    <span className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-sans font-medium ${st.open ? 'bg-burgundy text-paper-light' : 'bg-thread-border/50 text-stone/70'}`} style={{ fontSize: '0.95rem' }}>
                      {st.open ? i + 1 : (
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <p className={`font-serif leading-tight ${st.open ? 'text-ink' : 'text-ink/70'}`} style={{ fontSize: '1.15rem' }}>{txt.title}</p>
                        <span className={`rounded-full px-2.5 py-0.5 font-sans ${st.open ? 'bg-emerald/12 text-emerald' : 'bg-gold/15 text-gold'}`} style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}>
                          {st.open ? t.exOpenNow : (st.days === 1 ? t.exOpensTomorrow : t.exOpensIn.replace('{n}', String(st.days))) + ' · ' + txt.date}
                        </span>
                      </div>
                      <p className="font-sans text-stone mt-1" style={{ fontSize: '0.88rem' }}>{txt.body}</p>

                      {st.open && tasks.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {tasks.map((k) => {
                            const done = !!game.done[k.id]
                            const Wrapper = k.external ? 'a' : Link
                            return (
                              <li key={k.id} className="flex items-center gap-2.5">
                                <button type="button" role="checkbox" aria-checked={done} aria-label={k.label}
                                  onClick={() => markTask(k.id, !done)}
                                  className={`flex-shrink-0 w-11 h-11 -ml-1.5 flex items-center justify-center`}>
                                  <span className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${done ? 'bg-emerald border-emerald text-paper-light' : 'border-thread-border bg-white/70'}`}>
                                    {done && <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>}
                                  </span>
                                </button>
                                <Wrapper href={k.href} onClick={() => markTask(k.id, true)}
                                  className={`font-sans underline decoration-gold/50 underline-offset-4 min-h-[44px] flex items-center ${done ? 'text-stone/60 line-through decoration-stone/40' : 'text-burgundy'}`}
                                  style={{ fontSize: '0.95rem' }}>
                                  {k.label} &rarr;
                                </Wrapper>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

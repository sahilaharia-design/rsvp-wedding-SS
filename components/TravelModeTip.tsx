'use client'

// Context-aware tip panel that sits under the Flight / Train / Road buttons.
// It morphs with the guest's choice, so each mode gets only the advice that
// applies to it (no wall of text for everyone):
//   none   → a gentle "tap one" prompt
//   train  → both Mumbai Rajdhanis as ticket-style cards (tap "Use this" to
//            fill the arrival slot + train), the 6–11 am pickup note, fog
//   flight → Delhi airport / pickup-window note, fog
//   road   → straight to the hotel / check-in note, fog
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/Language'

type Mode = 'flight' | 'train' | 'road' | null
export type TrainPick = '12953' | '12951'

const EASE = [0.25, 0.1, 0.25, 1] as const

const TrainIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="3" width="14" height="14" rx="3" /><path d="M5 11h14M9 21l2-4M15 21l-2-4" /><circle cx="9" cy="14" r="0.8" fill="currentColor" /><circle cx="15" cy="14" r="0.8" fill="currentColor" />
  </svg>
)
const PlaneIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.5 13.5L3 11l1.5-1.5 8-.5L17 4.5a1.8 1.8 0 012.5 2.5L15 11.5l-.5 8L13 21l-2.5-7.5z" />
  </svg>
)
const CarIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 16V11l2-5h10l2 5v5M3 16h18M7 19v-3M17 19v-3" /><circle cx="8" cy="13" r="0.8" fill="currentColor" /><circle cx="16" cy="13" r="0.8" fill="currentColor" />
  </svg>
)
const FogIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 14a4 4 0 010-8 5 5 0 019.6 1.4A3.3 3.3 0 0116.5 14H7z" /><path d="M5 18h14M8 21h8" />
  </svg>
)

function Fog({ text }: { text: string }) {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-[#F3B64A]/15 border border-[#E2971F]/30 px-2.5 py-2 font-sans leading-[1.45] text-ink" style={{ fontSize: '0.8rem' }}>
      <span className="flex-shrink-0 mt-px text-[#B97914]"><FogIcon /></span>
      <span>{text}</span>
    </p>
  )
}

function TrainCard({
  name, route, dep, arr, pick, selected, onUse, usedLabel, useLabel, pickLabel,
}: { name: string; route: string; dep: string; arr: string; pick?: boolean; selected: boolean; onUse: () => void; usedLabel: string; useLabel: string; pickLabel: string }) {
  return (
    <div className={`relative rounded-xl border bg-white/75 px-3 py-2.5 transition-colors duration-300 ${selected ? 'border-emerald/60 ring-1 ring-emerald/30' : pick ? 'border-gold/60' : 'border-thread-border/60'}`}>
      {pick && (
        <span className="absolute -top-2.5 right-3 rounded-full bg-gold text-paper-light px-2.5 py-0.5 font-sans uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.12em' }}>
          &#9733; {pickLabel}
        </span>
      )}
      <div className="flex items-center gap-2.5 text-ink">
        <span className="font-serif whitespace-nowrap" style={{ fontSize: '1.02rem' }}>{dep}</span>
        <span className="route-line flex-1 min-w-[24px]" aria-hidden="true"><i className="route-dot" /></span>
        <span className="font-serif whitespace-nowrap font-semibold" style={{ fontSize: '1.02rem' }}>{arr}</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2.5">
        <div className="min-w-0">
          <p className="font-sans text-ink font-medium leading-snug" style={{ fontSize: '0.84rem' }}>{name}</p>
          <p className="font-sans text-stone/70 leading-snug" style={{ fontSize: '0.74rem' }}>{route}</p>
        </div>
        <button type="button" onClick={onUse} aria-pressed={selected}
          className={`flex-shrink-0 min-h-[44px] min-w-[88px] px-3.5 rounded-full font-sans transition-colors duration-300 ${selected ? 'bg-emerald/15 text-emerald border border-emerald/40' : 'bg-burgundy text-paper-light hover:bg-[#5c0a1c]'}`}
          style={{ fontSize: '0.82rem' }}>
          {selected ? usedLabel : useLabel}
        </button>
      </div>
    </div>
  )
}

export default function TravelModeTip({
  mode, selectedTrain, onPickTrain,
}: { mode: Mode; selectedTrain: TrainPick | null; onPickTrain: (p: TrainPick) => void }) {
  const { t } = useLang()
  const key = mode ?? 'none'

  return (
    <div aria-live="polite">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}
        >
          {key === 'none' && (
            <div className="flex items-center justify-center gap-2.5 rounded-xl border border-dashed border-gold/60 bg-gold/5 px-3 py-3 text-center">
              <span className="flex items-center gap-1.5 text-gold" aria-hidden="true"><PlaneIcon size={16} /><TrainIcon size={16} /><CarIcon size={16} /></span>
              <span className="font-sans text-stone leading-snug" style={{ fontSize: '0.84rem' }}>{t.tipPrompt}</span>
            </div>
          )}

          {key === 'train' && (
            <div className="space-y-3 rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-paper-light to-gold/10 px-3 pt-3.5 pb-3">
              <p className="font-serif text-ink flex items-center gap-2 leading-tight" style={{ fontSize: '1rem' }}>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-burgundy text-paper-light flex items-center justify-center"><TrainIcon /></span>
                {t.tipTrainHeading}
              </p>
              <div className="space-y-3 pt-1">
                <TrainCard name={t.tipT1Name} route={t.tipT1Route} dep={t.tipT1Dep} arr={t.tipT1Arr} pick
                  selected={selectedTrain === '12953'} onUse={() => onPickTrain('12953')} usedLabel={t.tipUsed} useLabel={t.tipUse} pickLabel={t.tipPick} />
                <TrainCard name={t.tipT2Name} route={t.tipT2Route} dep={t.tipT2Dep} arr={t.tipT2Arr}
                  selected={selectedTrain === '12951'} onUse={() => onPickTrain('12951')} usedLabel={t.tipUsed} useLabel={t.tipUse} pickLabel={t.tipPick} />
              </div>
              <p className="font-sans text-stone leading-[1.55]" style={{ fontSize: '0.8rem' }}>{t.tipTrainNote}</p>
              <Fog text={t.tipFogTravel} />
            </div>
          )}

          {key === 'flight' && (
            <div className="space-y-3 rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-paper-light to-gold/10 px-3.5 py-4">
              <p className="font-serif text-ink flex items-center gap-2 leading-tight" style={{ fontSize: '1.08rem' }}>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-burgundy text-paper-light flex items-center justify-center"><PlaneIcon /></span>
                {t.tipFlightHeading}
              </p>
              <p className="font-sans text-stone leading-[1.6]" style={{ fontSize: '0.86rem' }}>{t.tipFlightBody}</p>
              <Fog text={t.tipFogTravel} />
            </div>
          )}

          {key === 'road' && (
            <div className="space-y-3 rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-paper-light to-gold/10 px-3.5 py-4">
              <p className="font-serif text-ink flex items-center gap-2 leading-tight" style={{ fontSize: '1.08rem' }}>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-burgundy text-paper-light flex items-center justify-center"><CarIcon /></span>
                {t.tipRoadHeading}
              </p>
              <p className="font-sans text-stone leading-[1.6]" style={{ fontSize: '0.86rem' }}>{t.tipRoadBody}</p>
              <Fog text={t.tipFogRoad} />
            </div>
          )}
        </motion.div>

    </div>
  )
}

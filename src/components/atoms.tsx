import type { ReactNode } from 'react'

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" className="shrink-0">
        <rect width="32" height="32" rx="8" fill="#0B0F11" stroke="#1C2528" />
        <path d="M7 11h18M16 11v13" stroke="#00E5A0" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M9.5 23l5-5M22.5 23l-5-5" stroke="#36E0FF" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
      <div className="leading-none">
        <div className="font-semibold tracking-tight text-[17px] text-ink">
          TxFlow<span className="text-mint">Scan</span>
        </div>
      </div>
    </div>
  )
}

export function StatusDot({ ok = true, label }: { ok?: boolean; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${
            ok ? 'bg-mint animate-ping' : 'bg-down'
          }`}
        />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${ok ? 'bg-mint' : 'bg-down'}`} />
      </span>
      {label && <span className="label !tracking-[0.18em] text-mint">{label}</span>}
    </span>
  )
}

export function SectionTitle({
  kicker,
  title,
  right,
}: {
  kicker?: string
  title: string
  right?: ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-3.5">
      <div>
        {kicker && <div className="label mb-1.5">{kicker}</div>}
        <h2 className="mono text-[15px] font-semibold tracking-wide text-ink">{title}</h2>
      </div>
      {right}
    </div>
  )
}

export function Delta({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const up = value >= 0
  return (
    <span className={`mono text-[12.5px] font-medium ${up ? 'text-up' : 'text-down'}`}>
      {up ? '▲' : '▼'} {Math.abs(value).toFixed(2)}
      {suffix}
    </span>
  )
}

export function Pill({ children, tone = 'mint' }: { children: ReactNode; tone?: 'mint' | 'cyan' | 'mute' }) {
  const tones = {
    mint: 'border-mint/30 text-mint bg-mint/[0.06]',
    cyan: 'border-cyan/30 text-cyan bg-cyan/[0.06]',
    mute: 'border-line text-ink-soft bg-white/[0.02]',
  }
  return (
    <span className={`mono text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded border ${tones[tone]}`}>
      {children}
    </span>
  )
}

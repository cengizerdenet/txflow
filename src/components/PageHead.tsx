import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function PageHead({
  kicker,
  title,
  sub,
  right,
}: {
  kicker: string
  title: string
  sub?: string
  right?: ReactNode
}) {
  return (
    <div className="border-b border-line">
      <div className="mx-auto max-w-[1320px] px-4 lg:px-6 py-8">
        <nav className="mono text-[11px] text-ink-mute mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-mint">
            home
          </Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink-soft">{kicker.toLowerCase()}</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="label mb-1.5">{kicker}</div>
            <h1 className="text-[28px] font-bold tracking-tight text-ink">{title}</h1>
            {sub && <p className="mt-1.5 text-[13px] text-ink-soft max-w-xl">{sub}</p>}
          </div>
          {right}
        </div>
      </div>
    </div>
  )
}

export function StatCard({ label, value, tint }: { label: string; value: string; tint?: string }) {
  return (
    <div className="card px-4 py-3.5">
      <div className="label mb-1.5">{label}</div>
      <div className={`mono text-[18px] font-semibold tabular-nums ${tint ?? 'text-ink'}`}>{value}</div>
    </div>
  )
}

export function DataRow({ k, v, mono = true }: { k: string; v: ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-line-soft">
      <div className="label sm:w-44 shrink-0">{k}</div>
      <div className={`${mono ? 'mono' : ''} text-[13px] text-ink break-all`}>{v}</div>
    </div>
  )
}

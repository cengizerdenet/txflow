import type { Trader } from '../lib/mock'
import { fmtNum, fmtUsd, shortHash } from '../lib/format'
import { SectionTitle } from './atoms'

function rankTone(i: number) {
  if (i === 0) return 'text-warn border-warn/40 bg-warn/[0.08]'
  if (i === 1) return 'text-ink border-line bg-white/[0.04]'
  if (i === 2) return 'text-cyan border-cyan/30 bg-cyan/[0.06]'
  return 'text-ink-mute border-line'
}

export function TopTraders({ traders }: { traders: Trader[] }) {
  return (
    <div className="card p-5 h-full">
      <SectionTitle kicker="Leaderboard" title="TOP TRADERS · 24H" right={<span className="label">by realized PnL</span>} />
      <div className="space-y-1">
        {traders.slice(0, 10).map((t, i) => (
          <div key={t.address} className="row-hover flex items-center gap-3 rounded-lg px-2 py-2">
            <div className={`mono flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-[12px] font-semibold ${rankTone(i)}`}>
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mono text-[13px] text-ink truncate">{t.alias ?? shortHash(t.address)}</div>
              <div className="mono text-[11px] text-ink-mute">
                {fmtNum(t.trades)} trades · {t.win.toFixed(0)}% win
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="label">vol</div>
              <div className="mono text-[12px] text-ink-soft">{fmtUsd(t.volume, { compact: true })}</div>
            </div>
            <div className="text-right w-24">
              <div className="label">pnl</div>
              <div className={`mono text-[13px] font-medium ${t.pnl >= 0 ? 'text-up' : 'text-down'}`}>
                {t.pnl >= 0 ? '+' : '-'}
                {fmtUsd(Math.abs(t.pnl), { compact: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

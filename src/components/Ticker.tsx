import type { Market } from '../lib/mock'
import { fmtPct, fmtUsd } from '../lib/format'

function priceDp(p: number) {
  if (p >= 1000) return 2
  if (p >= 1) return 3
  return 4
}

export function Ticker({ markets }: { markets: Market[] }) {
  const row = [...markets, ...markets]
  return (
    <div className="border-b border-line bg-surface/60 overflow-hidden">
      <div className="mx-auto max-w-[1320px] relative">
        <div className="flex gap-8 py-2 whitespace-nowrap animate-[scrollx_42s_linear_infinite] hover:[animation-play-state:paused]">
          {row.map((m, i) => {
            const up = m.change24h >= 0
            return (
              <span key={i} className="inline-flex items-center gap-2 shrink-0">
                <span className="mono text-[11.5px] text-ink-soft font-medium">{m.symbol}</span>
                <span className="mono text-[11.5px] text-ink tabular-nums">{fmtUsd(m.price, { dp: priceDp(m.price) })}</span>
                <span className={`mono text-[11px] ${up ? 'text-up' : 'text-down'}`}>{fmtPct(m.change24h)}</span>
              </span>
            )
          })}
        </div>
      </div>
      <style>{`@keyframes scrollx { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  )
}

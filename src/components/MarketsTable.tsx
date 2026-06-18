import type { Market } from '../lib/mock'
import { fmtPct, fmtUsd } from '../lib/format'
import { SectionTitle } from './atoms'

function priceDp(p: number) {
  if (p >= 1000) return 2
  if (p >= 1) return 3
  return 4
}

function MarketRow({ m }: { m: Market }) {
  const up = m.change24h >= 0
  const tickUp = m.price >= m.prev
  return (
    <tr className="row-hover border-b border-line-soft">
      <td className="py-2.5 pl-4 pr-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-elevated border border-line mono text-[10px] font-semibold text-mint">
            {m.symbol.slice(0, 2)}
          </div>
          <div className="leading-tight">
            <div className="mono text-[13px] text-ink font-medium">{m.symbol}-PERP</div>
            <div className="text-[11px] text-ink-mute">{m.name}</div>
          </div>
        </div>
      </td>
      <td className="px-2 text-right">
        <span className={`mono text-[13px] tabular-nums transition-colors ${tickUp ? 'text-up' : 'text-down'}`}>
          {fmtUsd(m.price, { dp: priceDp(m.price) })}
        </span>
      </td>
      <td className="px-2 text-right">
        <span className={`mono text-[12.5px] ${up ? 'text-up' : 'text-down'}`}>{fmtPct(m.change24h)}</span>
      </td>
      <td className="px-2 text-right hidden sm:table-cell">
        <span className="mono text-[12.5px] text-ink-soft">{fmtUsd(m.volume24h, { compact: true })}</span>
      </td>
      <td className="px-2 text-right hidden md:table-cell">
        <span className="mono text-[12.5px] text-ink-soft">{fmtUsd(m.openInterest, { compact: true })}</span>
      </td>
      <td className="px-2 text-right hidden lg:table-cell">
        <span className={`mono text-[12px] ${m.funding >= 0 ? 'text-up' : 'text-down'}`}>
          {(m.funding >= 0 ? '+' : '') + m.funding.toFixed(4)}%
        </span>
      </td>
      <td className="px-2 pr-4 text-right">
        <span className="mono text-[11px] text-ink-mute border border-line rounded px-1.5 py-0.5">{m.leverage}x</span>
      </td>
    </tr>
  )
}

export function MarketsTable({ markets }: { markets: Market[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 pt-5">
        <SectionTitle kicker="Perpetual markets" title="MARKETS" right={<span className="label">{markets.length} live</span>} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-line-soft text-left">
              {['Market', 'Price', '24h', 'Volume', 'OI', 'Funding', 'Lev'].map((h, i) => (
                <th
                  key={h}
                  className={`label py-2 px-2 ${i === 0 ? 'pl-4 text-left' : 'text-right'} ${
                    h === 'Volume' ? 'hidden sm:table-cell' : ''
                  } ${h === 'OI' ? 'hidden md:table-cell' : ''} ${h === 'Funding' ? 'hidden lg:table-cell' : ''} ${
                    h === 'Lev' ? 'pr-4' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {markets.map((m) => (
              <MarketRow key={m.symbol} m={m} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

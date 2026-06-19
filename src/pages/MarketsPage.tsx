import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLive } from '../lib/LiveContext'
import { PageHead, StatCard } from '../components/PageHead'
import { fmtPct, fmtUsd } from '../lib/format'

type SortKey = 'volume24h' | 'change24h' | 'openInterest' | 'price'

function priceDp(p: number) {
  return p >= 1000 ? 2 : p >= 1 ? 3 : 4
}

export default function MarketsPage() {
  const { markets } = useLive()
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState<SortKey>('volume24h')
  const q = params.get('q') ?? ''

  const filtered = useMemo(() => {
    const list = q
      ? markets.filter((m) => m.symbol.includes(q.toUpperCase()) || m.name.toLowerCase().includes(q.toLowerCase()))
      : markets
    return [...list].sort((a, b) => (b[sort] as number) - (a[sort] as number))
  }, [markets, q, sort])

  const totalVol = markets.reduce((a, m) => a + m.volume24h, 0)
  const totalOi = markets.reduce((a, m) => a + m.openInterest, 0)

  return (
    <>
      <PageHead
        kicker="Perpetual markets"
        title="Markets"
        sub="Fully on-chain CLOB perpetuals on TxFlow L1. Prices update live."
        right={
          <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
            <StatCard label="Markets" value={String(markets.length)} tint="text-mint" />
            <StatCard label="24h Volume" value={fmtUsd(totalVol, { compact: true })} tint="text-cyan" />
            <StatCard label="Open Interest" value={fmtUsd(totalOi, { compact: true })} />
          </div>
        }
      />

      <div className="mx-auto max-w-[1320px] px-4 lg:px-6 py-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            value={q}
            onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})}
            placeholder="Filter markets…"
            className="mono text-[12.5px] bg-surface border border-line rounded-lg h-9 px-3 w-full sm:w-64 outline-none focus:border-mint/40 text-ink placeholder:text-ink-faint"
          />
          <div className="flex items-center gap-1">
            <span className="label mr-1">sort</span>
            {(
              [
                ['volume24h', 'Volume'],
                ['change24h', '24h'],
                ['openInterest', 'OI'],
                ['price', 'Price'],
              ] as Array<[SortKey, string]>
            ).map(([key, lbl]) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`mono text-[11px] uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-md transition-colors ${
                  sort === key ? 'text-mint bg-mint/[0.07]' : 'text-ink-mute hover:text-ink-soft'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line-soft text-left">
                {['#', 'Market', 'Price', '24h', 'Volume', 'Open Interest', 'Funding', 'Lev'].map((h, i) => (
                  <th
                    key={h}
                    className={`label py-2.5 px-3 ${i <= 1 ? 'text-left' : 'text-right'} ${
                      h === 'Open Interest' ? 'hidden md:table-cell' : ''
                    } ${h === 'Funding' ? 'hidden lg:table-cell' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const up = m.change24h >= 0
                const tickUp = m.price >= m.prev
                return (
                  <tr key={m.symbol} className="row-hover border-b border-line-soft">
                    <td className="py-3 px-3 mono text-[12px] text-ink-mute">{i + 1}</td>
                    <td className="px-3">
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
                    <td className={`px-3 text-right mono text-[13px] tabular-nums ${tickUp ? 'text-up' : 'text-down'}`}>
                      {fmtUsd(m.price, { dp: priceDp(m.price) })}
                    </td>
                    <td className={`px-3 text-right mono text-[12.5px] ${up ? 'text-up' : 'text-down'}`}>
                      {fmtPct(m.change24h)}
                    </td>
                    <td className="px-3 text-right mono text-[12.5px] text-ink-soft">
                      {fmtUsd(m.volume24h, { compact: true })}
                    </td>
                    <td className="px-3 text-right mono text-[12.5px] text-ink-soft hidden md:table-cell">
                      {fmtUsd(m.openInterest, { compact: true })}
                    </td>
                    <td className={`px-3 text-right mono text-[12px] hidden lg:table-cell ${m.funding >= 0 ? 'text-up' : 'text-down'}`}>
                      {(m.funding >= 0 ? '+' : '') + m.funding.toFixed(4)}%
                    </td>
                    <td className="px-3 text-right">
                      <span className="mono text-[11px] text-ink-mute border border-line rounded px-1.5 py-0.5">{m.leverage}x</span>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center mono text-[12px] text-ink-mute">
                    no markets match “{q}”
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

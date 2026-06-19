import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLive } from '../lib/LiveContext'
import { PageHead, StatCard } from '../components/PageHead'
import { buildTraders } from '../lib/mock'
import { fmtNum, fmtUsd, shortHash } from '../lib/format'

function rankTone(i: number) {
  if (i === 0) return 'text-warn border-warn/40 bg-warn/[0.08]'
  if (i === 1) return 'text-ink border-line bg-white/[0.04]'
  if (i === 2) return 'text-cyan border-cyan/30 bg-cyan/[0.06]'
  return 'text-ink-mute border-line'
}

export default function TradersPage() {
  useLive() // keep ticker/feed alive across the app
  const traders = useMemo(buildTraders, [])
  const totalPnl = traders.reduce((a, t) => a + Math.max(0, t.pnl), 0)
  const totalVol = traders.reduce((a, t) => a + t.volume, 0)

  return (
    <>
      <PageHead
        kicker="Leaderboard"
        title="Top Traders"
        sub="Ranked by realized 24h PnL across all TxFlow perpetual markets."
        right={
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <StatCard label="Traders ranked" value={String(traders.length)} tint="text-mint" />
            <StatCard label="Aggregate volume" value={fmtUsd(totalVol, { compact: true })} tint="text-cyan" />
          </div>
        }
      />

      <div className="mx-auto max-w-[1320px] px-4 lg:px-6 py-6">
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line-soft text-left">
                {['Rank', 'Trader', 'Trades', 'Win', 'Volume', 'Realized PnL'].map((h, i) => (
                  <th key={h} className={`label py-2.5 px-3 ${i <= 1 ? 'text-left' : 'text-right'} ${h === 'Trades' || h === 'Win' ? 'hidden sm:table-cell' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {traders.map((t, i) => (
                <tr key={t.address} className="row-hover border-b border-line-soft">
                  <td className="py-3 px-3">
                    <span className={`mono inline-flex h-7 w-7 items-center justify-center rounded-md border text-[12px] font-semibold ${rankTone(i)}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-3">
                    <Link to={`/account/${t.address}`} className="group">
                      <div className="mono text-[13px] text-ink group-hover:text-mint transition-colors">
                        {t.alias ?? shortHash(t.address)}
                      </div>
                      {t.alias && <div className="mono text-[11px] text-ink-mute">{shortHash(t.address)}</div>}
                    </Link>
                  </td>
                  <td className="px-3 text-right mono text-[12.5px] text-ink-soft hidden sm:table-cell">{fmtNum(t.trades)}</td>
                  <td className="px-3 text-right mono text-[12.5px] text-ink-soft hidden sm:table-cell">{t.win.toFixed(0)}%</td>
                  <td className="px-3 text-right mono text-[12.5px] text-ink-soft">{fmtUsd(t.volume, { compact: true })}</td>
                  <td className={`px-3 text-right mono text-[13px] font-medium ${t.pnl >= 0 ? 'text-up' : 'text-down'}`}>
                    {t.pnl >= 0 ? '+' : '-'}
                    {fmtUsd(Math.abs(t.pnl), { compact: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mono text-[11px] text-ink-faint mt-3">
          PnL figures are estimates. Total positive PnL on this board: {fmtUsd(totalPnl, { compact: true })}.
        </p>
      </div>
    </>
  )
}

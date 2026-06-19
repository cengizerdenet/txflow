import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLive } from '../lib/LiveContext'
import { PageHead, StatCard } from '../components/PageHead'
import { getAccount, METHOD_TINT } from '../lib/mock'
import { fmtNum, fmtPct, fmtUsd, shortHash, timeAgo } from '../lib/format'

function priceDp(p: number) {
  return p >= 1000 ? 2 : p >= 1 ? 3 : 4
}

function SearchBox() {
  const [v, setV] = useState('')
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-[1320px] px-4 lg:px-6 py-16">
      <div className="card max-w-xl mx-auto p-8 text-center">
        <div className="label mb-3">Account explorer</div>
        <h2 className="text-[20px] font-semibold text-ink mb-2">Look up any TxFlow account</h2>
        <p className="text-[13px] text-ink-soft mb-6">
          Enter a wallet address to view equity, open positions and recent on-chain activity.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (v.trim()) navigate(`/account/${v.trim().toLowerCase()}`)
          }}
          className="flex gap-2"
        >
          <input
            value={v}
            onChange={(e) => setV(e.target.value)}
            placeholder="0x…"
            className="mono flex-1 bg-surface border border-line rounded-lg h-10 px-3 text-[12.5px] outline-none focus:border-mint/40 text-ink placeholder:text-ink-faint"
          />
          <button className="mono text-[12px] font-semibold uppercase tracking-[0.1em] text-base bg-mint hover:bg-mint-glow rounded-lg px-4 h-10">
            Search
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AccountPage() {
  const { address } = useParams()
  const { stats } = useLive()
  const acct = useMemo(() => (address ? getAccount(address) : null), [address])

  if (!address || !acct) return <SearchBox />

  return (
    <>
      <PageHead
        kicker="Account"
        title={shortHash(address, 10, 8)}
        sub={`First seen ${timeAgo(acct.firstSeen)} · ${fmtNum(acct.trades)} lifetime trades · ${acct.win.toFixed(0)}% win rate`}
        right={
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <StatCard label="Equity" value={fmtUsd(acct.equity, { compact: true })} tint="text-mint" />
            <StatCard label="30d PnL" value={`${acct.pnl30d >= 0 ? '+' : '-'}${fmtUsd(Math.abs(acct.pnl30d), { compact: true })}`} tint={acct.pnl30d >= 0 ? 'text-up' : 'text-down'} />
          </div>
        }
      />

      <div className="mx-auto max-w-[1320px] px-4 lg:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Available margin" value={fmtUsd(acct.available, { compact: true })} />
          <StatCard label="Margin used" value={fmtUsd(acct.marginUsed, { compact: true })} tint="text-warn" />
          <StatCard label="30d volume" value={fmtUsd(acct.volume30d, { compact: true })} tint="text-cyan" />
          <StatCard label="Open positions" value={String(acct.positions.length)} />
        </div>

        {/* positions */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-line label">Open positions</div>
          {acct.positions.length === 0 ? (
            <div className="py-10 text-center mono text-[12px] text-ink-mute">no open positions</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line-soft text-left">
                    {['Market', 'Side', 'Size', 'Entry', 'Mark', 'Lev', 'PnL'].map((h, i) => (
                      <th key={h} className={`label py-2.5 px-3 ${i === 0 ? 'text-left' : 'text-right'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {acct.positions.map((p, i) => (
                    <tr key={i} className="row-hover border-b border-line-soft">
                      <td className="py-3 px-3 mono text-[13px] text-ink">{p.market}-PERP</td>
                      <td className={`px-3 text-right mono text-[12px] font-medium ${p.side === 'LONG' ? 'text-up' : 'text-down'}`}>{p.side}</td>
                      <td className="px-3 text-right mono text-[12.5px] text-ink-soft">{p.size.toFixed(3)}</td>
                      <td className="px-3 text-right mono text-[12.5px] text-ink-soft">{fmtUsd(p.entry, { dp: priceDp(p.entry) })}</td>
                      <td className="px-3 text-right mono text-[12.5px] text-ink-soft">{fmtUsd(p.mark, { dp: priceDp(p.mark) })}</td>
                      <td className="px-3 text-right"><span className="mono text-[11px] text-ink-mute border border-line rounded px-1.5 py-0.5">{p.leverage}x</span></td>
                      <td className={`px-3 text-right mono text-[12.5px] font-medium ${p.pnl >= 0 ? 'text-up' : 'text-down'}`}>
                        {p.pnl >= 0 ? '+' : '-'}{fmtUsd(Math.abs(p.pnl), { compact: true })}
                        <span className="text-ink-mute"> ({fmtPct(p.pnlPct)})</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* recent txns */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-line label">Recent transactions</div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line-soft text-left">
                  {['Txn Hash', 'Method', 'Market', 'Value', 'Age'].map((h, i) => (
                    <th key={h} className={`label py-2.5 px-3 ${i === 0 ? 'text-left' : 'text-right'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {acct.txns.map((t) => (
                  <tr key={t.hash} className="row-hover border-b border-line-soft">
                    <td className="py-3 px-3">
                      <Link to={`/tx/${t.hash}`} className="mono text-[12.5px] text-cyan hover:text-mint transition-colors">
                        {shortHash(t.hash)}
                      </Link>
                    </td>
                    <td className={`px-3 text-right mono text-[12px] ${METHOD_TINT[t.method] ?? 'text-ink-soft'}`}>{t.method}</td>
                    <td className="px-3 text-right mono text-[12px] text-ink-mute">{t.market ? `${t.market}-PERP` : '—'}</td>
                    <td className="px-3 text-right mono text-[12.5px] text-ink-soft">{fmtUsd(t.value, { compact: true })}</td>
                    <td className="px-3 text-right mono text-[12px] text-ink-mute">{timeAgo(t.ts)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mono text-[11px] text-ink-faint">
          Read-only view · current block #{fmtNum(stats.blockHeight)} · figures are estimates.
        </p>
      </div>
    </>
  )
}

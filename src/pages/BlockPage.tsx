import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLive } from '../lib/LiveContext'
import { PageHead, StatCard, DataRow } from '../components/PageHead'
import { getBlock, METHOD_TINT } from '../lib/mock'
import { fmtNum, fmtUsd, shortHash, timeAgo } from '../lib/format'

export default function BlockPage() {
  const { height } = useParams()
  const { stats } = useLive()
  const h = Number(height)
  const block = useMemo(() => (Number.isFinite(h) ? getBlock(h) : null), [h])
  const navigate = useNavigate()

  if (!block) return null
  const confirmations = Math.max(0, stats.blockHeight - h)

  return (
    <>
      <PageHead
        kicker="Block"
        title={`#${fmtNum(h)}`}
        sub={`${timeAgo(block.ts)} · ${fmtNum(block.txns)} transactions · proposed by ${block.proposer}`}
        right={
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(`/block/${h - 1}`)} className="mono text-[12px] text-ink-soft hover:text-mint border border-line rounded-lg h-9 px-3">
              ← prev
            </button>
            <button onClick={() => navigate(`/block/${h + 1}`)} className="mono text-[12px] text-ink-soft hover:text-mint border border-line rounded-lg h-9 px-3">
              next →
            </button>
          </div>
        }
      />

      <div className="mx-auto max-w-[1320px] px-4 lg:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Transactions" value={fmtNum(block.txns)} tint="text-mint" />
          <StatCard label="Gas used" value={`${(block.gasUsed * 100).toFixed(1)}%`} tint="text-cyan" />
          <StatCard label="Size" value={`${block.size.toFixed(0)} KB`} />
          <StatCard label="Confirmations" value={fmtNum(confirmations)} />
        </div>

        <div className="card p-5">
          <div className="label mb-2">Block details</div>
          <DataRow k="Height" v={`#${fmtNum(h)}`} />
          <DataRow k="Timestamp" v={`${timeAgo(block.ts)} · ${new Date(block.ts).toISOString()}`} />
          <DataRow k="Proposer" v={block.proposer} />
          <DataRow k="Block hash" v={block.hash} />
          <DataRow k="Parent hash" v={<Link to={`/block/${h - 1}`} className="text-cyan hover:text-mint">{block.parentHash}</Link>} />
          <DataRow k="State root" v={block.stateRoot} />
          <DataRow k="Gas used / limit" v={`${fmtNum(Math.floor(block.gasUsed * block.gasLimit))} / ${fmtNum(block.gasLimit)}`} />
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-line label">
            Transactions in this block <span className="text-ink-faint">(showing {block.txList.length} of {fmtNum(block.txns)})</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line-soft text-left">
                  {['Txn Hash', 'Method', 'From', 'To', 'Value'].map((hh, i) => (
                    <th key={hh} className={`label py-2.5 px-3 ${i >= 4 ? 'text-right' : 'text-left'}`}>{hh}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.txList.map((t) => (
                  <tr key={t.hash} className="row-hover border-b border-line-soft">
                    <td className="py-3 px-3">
                      <Link to={`/tx/${t.hash}`} className="mono text-[12.5px] text-cyan hover:text-mint transition-colors">{shortHash(t.hash)}</Link>
                    </td>
                    <td className={`px-3 mono text-[12px] ${METHOD_TINT[t.method] ?? 'text-ink-soft'}`}>{t.method}</td>
                    <td className="px-3"><Link to={`/account/${t.from}`} className="mono text-[12px] text-ink-soft hover:text-mint">{shortHash(t.from, 6, 4)}</Link></td>
                    <td className="px-3"><Link to={`/account/${t.to}`} className="mono text-[12px] text-ink-soft hover:text-mint">{shortHash(t.to, 6, 4)}</Link></td>
                    <td className="px-3 text-right mono text-[12.5px] text-ink-soft">{fmtUsd(t.value, { compact: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

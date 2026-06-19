import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLive } from '../lib/LiveContext'
import { PageHead, DataRow } from '../components/PageHead'
import { getTx } from '../lib/mock'
import { fmtNum, fmtUsd, shortHash, timeAgo } from '../lib/format'

export default function TxPage() {
  const { hash } = useParams()
  const { stats } = useLive()
  const tx = useMemo(() => (hash ? getTx(hash, stats.blockHeight) : null), [hash, stats.blockHeight])

  if (!tx) return null
  const ok = tx.status === 'Success'

  return (
    <>
      <PageHead
        kicker="Transaction"
        title={shortHash(tx.hash, 10, 8)}
        sub={`${timeAgo(tx.ts)} · ${tx.method}`}
        right={
          <span
            className={`mono text-[12px] font-semibold uppercase tracking-[0.12em] px-3 py-1.5 rounded-lg border ${
              ok ? 'text-mint border-mint/30 bg-mint/[0.07]' : 'text-down border-down/30 bg-down/[0.07]'
            }`}
          >
            {ok ? '● Success' : '✕ Reverted'}
          </span>
        }
      />

      <div className="mx-auto max-w-[1320px] px-4 lg:px-6 py-6">
        <div className="card p-5">
          <div className="label mb-2">Transaction details</div>
          <DataRow k="Txn hash" v={tx.hash} />
          <DataRow k="Status" v={<span className={ok ? 'text-mint' : 'text-down'}>{tx.status}</span>} />
          <DataRow k="Method" v={tx.method} />
          <DataRow k="Block" v={<Link to={`/block/${tx.block}`} className="text-cyan hover:text-mint">#{fmtNum(tx.block)}</Link>} />
          <DataRow k="Confirmations" v={fmtNum(tx.confirmations)} />
          <DataRow k="Timestamp" v={`${timeAgo(tx.ts)} · ${new Date(tx.ts).toISOString()}`} />
          <DataRow k="From" v={<Link to={`/account/${tx.from}`} className="text-cyan hover:text-mint">{tx.from}</Link>} />
          <DataRow k="To" v={<Link to={`/account/${tx.to}`} className="text-cyan hover:text-mint">{tx.to}</Link>} />
          {tx.market && <DataRow k="Market" v={`${tx.market}-PERP`} />}
          <DataRow k="Value" v={fmtUsd(tx.value)} />
          <DataRow k="Nonce" v={String(tx.nonce)} />
          <DataRow k="Gas used" v={fmtNum(tx.gasUsed)} />
          <DataRow k="Txn fee" v={`${tx.fee.toFixed(6)} TXF`} />
        </div>
        <p className="mono text-[11px] text-ink-faint mt-3">Read-only view · figures are estimates.</p>
      </div>
    </>
  )
}

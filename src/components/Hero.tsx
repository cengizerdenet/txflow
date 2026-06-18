import type { NetStats } from '../lib/mock'
import { fmtNum, fmtUsd } from '../lib/format'
import { Pill } from './atoms'

function StatCell({
  label,
  value,
  accent,
  pulse,
}: {
  label: string
  value: string
  accent?: 'mint' | 'cyan' | 'warn' | 'down'
  pulse?: boolean
}) {
  const tint =
    accent === 'mint'
      ? 'text-mint'
      : accent === 'cyan'
      ? 'text-cyan'
      : accent === 'warn'
      ? 'text-warn'
      : accent === 'down'
      ? 'text-down'
      : 'text-ink'
  return (
    <div className="relative px-4 py-3.5 border-l border-line-soft first:border-l-0">
      <div className="label mb-1.5">{label}</div>
      <div className={`mono text-[18px] font-semibold tabular-nums ${tint} ${pulse ? 'transition-colors' : ''}`}>
        {value}
      </div>
    </div>
  )
}

export function Hero({ stats }: { stats: NetStats }) {
  return (
    <section className="relative overflow-hidden">
      {/* scanline accent */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.5]">
        <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-mint/[0.06] to-transparent animate-scan" />
      </div>

      <div className="mx-auto max-w-[1320px] px-4 lg:px-6 pt-10 pb-6 relative">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <Pill tone="mint">Protocol Live</Pill>
          <Pill tone="cyan">TIP Liquidity Standards</Pill>
          <Pill tone="mute">Fully On-Chain CLOB</Pill>
        </div>

        <h1 className="text-[clamp(28px,5vw,46px)] font-bold leading-[1.05] tracking-tight max-w-3xl">
          The explorer for <span className="text-mint">TxFlow L1</span>
          <br />
          <span className="text-ink-soft font-semibold text-[clamp(20px,3vw,30px)]">
            where all on-chain finance happens.
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-[14px] text-ink-soft leading-relaxed">
          Live blocks, transactions, perpetual markets, vaults and channel settlement — streamed straight from the
          network. Public, read-only, real-time.
        </p>

        {/* primary stats strip */}
        <div className="mt-7 card overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y divide-line-soft lg:divide-y-0">
            <StatCell label="TPS" value={fmtNum(stats.tps)} accent="mint" pulse />
            <StatCell label="Block Time" value={`${stats.blockTime.toFixed(2)}s`} />
            <StatCell label="Finality" value={`${stats.finality}ms`} accent="cyan" />
            <StatCell label="Gas (gwei)" value={stats.gas.toFixed(3)} />
            <StatCell label="Block Height" value={fmtNum(stats.blockHeight)} pulse />
            <StatCell label="Network Load" value={`${(stats.networkLoad * 100).toFixed(0)}%`} accent="warn" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y divide-line-soft lg:divide-y-0 border-t border-line-soft">
            <StatCell label="Total Txns" value={fmtNum(stats.totalTxns, { compact: true })} />
            <StatCell label="Accounts" value={fmtNum(stats.accounts, { compact: true })} />
            <StatCell label="TVL" value={fmtUsd(stats.tvl, { compact: true })} accent="mint" />
            <StatCell label="24h Volume" value={fmtUsd(stats.volume24h, { compact: true })} accent="cyan" />
            <StatCell label="Open Interest" value={fmtUsd(stats.openInterest, { compact: true })} />
            <StatCell label="Taker Fee" value={`${stats.takerFee.toFixed(3)}%`} />
          </div>
        </div>
      </div>
    </section>
  )
}

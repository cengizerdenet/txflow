import { VAULTS } from '../lib/mock'
import { fmtNum, fmtPct, fmtUsd } from '../lib/format'
import { Pill, SectionTitle } from './atoms'

export function Vaults() {
  return (
    <div className="card p-5">
      <SectionTitle
        kicker="Liquidity provisioning"
        title="VAULTS"
        right={<span className="label">{VAULTS.length} active</span>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {VAULTS.map((v) => (
          <div key={v.name} className="rounded-lg border border-line bg-surface/60 p-4 hover:border-mint/30 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <div className="text-[13.5px] font-medium text-ink truncate">{v.name}</div>
                <div className="mt-1">
                  <Pill tone={v.kind === 'Protocol' ? 'mint' : 'cyan'}>{v.kind} Vault</Pill>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="label">APY</div>
                <div className="mono text-[16px] font-semibold text-mint tabular-nums">{v.apy.toFixed(1)}%</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="label mb-1">TVL</div>
                <div className="mono text-[12.5px] text-ink">{fmtUsd(v.tvl, { compact: true })}</div>
              </div>
              <div>
                <div className="label mb-1">30d PnL</div>
                <div className={`mono text-[12.5px] ${v.pnl30d >= 0 ? 'text-up' : 'text-down'}`}>{fmtPct(v.pnl30d)}</div>
              </div>
              <div>
                <div className="label mb-1">LPs</div>
                <div className="mono text-[12.5px] text-ink">{fmtNum(v.depositors, { compact: true })}</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between label mb-1.5">
                <span>capacity</span>
                <span className="text-ink-soft">{(v.capacity * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-mint-dim to-mint"
                  style={{ width: `${v.capacity * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

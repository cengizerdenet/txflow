import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SeriesPoint } from '../lib/mock'
import { fmtNum } from '../lib/format'
import { SectionTitle } from './atoms'

function TipBox({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="card !rounded-lg px-3 py-2 !bg-elevated">
      <div className="label mb-1">{label}</div>
      <div className="mono text-[13px] font-semibold text-ink">
        {fmtNum(payload[0].value)} <span className="text-ink-mute text-[11px]">{unit}</span>
      </div>
    </div>
  )
}

export function ThroughputChart({ data }: { data: SeriesPoint[] }) {
  const latest = data[data.length - 1]?.tps ?? 0
  const peak = Math.max(...data.map((d) => d.tps))
  return (
    <div className="card p-5 h-full">
      <SectionTitle
        kicker="Network throughput"
        title="TRANSACTIONS / SECOND"
        right={
          <div className="text-right">
            <div className="mono text-[20px] font-semibold text-mint tabular-nums">{fmtNum(latest)}</div>
            <div className="label">peak {fmtNum(peak, { compact: true })}</div>
          </div>
        }
      />
      <div className="h-[180px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tpsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5A0" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#00E5A0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#161D20" vertical={false} />
            <XAxis dataKey="t" tick={{ fill: '#5E706C', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} minTickGap={40} />
            <YAxis tick={{ fill: '#5E706C', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} width={42} tickFormatter={(v) => fmtNum(v, { compact: true })} />
            <Tooltip content={<TipBox unit="tps" />} cursor={{ stroke: '#00E5A0', strokeOpacity: 0.3 }} />
            <Area type="monotone" dataKey="tps" stroke="#00E5A0" strokeWidth={2} fill="url(#tpsFill)" isAnimationActive={false} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function VolumeChart({ data }: { data: SeriesPoint[] }) {
  const total = data.reduce((a, b) => a + b.volume, 0)
  return (
    <div className="card p-5 h-full">
      <SectionTitle
        kicker="Settlement volume"
        title="VOLUME / 30M ($M)"
        right={
          <div className="text-right">
            <div className="mono text-[20px] font-semibold text-cyan tabular-nums">{fmtNum(total, { compact: true })}M</div>
            <div className="label">cumulative</div>
          </div>
        }
      />
      <div className="h-[180px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#36E0FF" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#36E0FF" stopOpacity={0.18} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#161D20" vertical={false} />
            <XAxis dataKey="t" tick={{ fill: '#5E706C', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} minTickGap={40} />
            <YAxis tick={{ fill: '#5E706C', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} width={42} />
            <Tooltip content={<TipBox unit="$M" />} cursor={{ fill: 'rgba(54,224,255,0.06)' }} />
            <Bar dataKey="volume" fill="url(#volFill)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

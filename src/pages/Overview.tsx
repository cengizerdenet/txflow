import { useMemo } from 'react'
import { Hero } from '../components/Hero'
import { ThroughputChart, VolumeChart } from '../components/Charts'
import { LiveFeed } from '../components/LiveFeed'
import { MarketsTable } from '../components/MarketsTable'
import { Vaults } from '../components/Vaults'
import { TopTraders } from '../components/TopTraders'
import { SectionTitle } from '../components/atoms'
import { useLive } from '../lib/LiveContext'
import { buildTraders } from '../lib/mock'

export default function Overview() {
  const { stats, markets, blocks, txns, series, paused, setPaused, live, lastUpdated } = useLive()
  const traders = useMemo(buildTraders, [])

  return (
    <>
      <Hero stats={stats} live={live} lastUpdated={lastUpdated} />

      <div className="mx-auto max-w-[1320px] px-4 lg:px-6 space-y-6 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThroughputChart data={series} />
          <VolumeChart data={series} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <SectionTitle kicker="Real-time" title="LIVE NETWORK ACTIVITY" />
            <LiveFeed blocks={blocks} txns={txns} paused={paused} setPaused={setPaused} />
          </div>
          <div>
            <TopTraders traders={traders} />
          </div>
        </div>

        <MarketsTable markets={markets} />
        <Vaults />
      </div>
    </>
  )
}

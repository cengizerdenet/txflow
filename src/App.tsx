import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { Ticker } from './components/Ticker'
import { Hero } from './components/Hero'
import { ThroughputChart, VolumeChart } from './components/Charts'
import { LiveFeed } from './components/LiveFeed'
import { MarketsTable } from './components/MarketsTable'
import { Vaults } from './components/Vaults'
import { TopTraders } from './components/TopTraders'
import { Footer } from './components/Footer'
import { SectionTitle } from './components/atoms'
import { useLiveData } from './lib/useLiveData'
import { buildTraders, VAULTS } from './lib/mock'

export default function App() {
  const [active, setActive] = useState('Overview')
  const { stats, markets, blocks, txns, series, paused, setPaused } = useLiveData()
  const traders = useMemo(buildTraders, [])

  // Derive headline aggregates from the underlying data so every number
  // is consistent across the hero, markets table and vaults sections.
  const heroStats = useMemo(() => {
    const volume24h = markets.reduce((a, m) => a + m.volume24h, 0)
    const openInterest = markets.reduce((a, m) => a + m.openInterest, 0)
    const tvl = VAULTS.reduce((a, v) => a + v.tvl, 0)
    return { ...stats, volume24h, openInterest, tvl, markets: markets.length }
  }, [stats, markets])

  function handleNav(s: string) {
    setActive(s)
    const map: Record<string, string> = {
      Markets: 'markets',
      Blocks: 'feed',
      Transactions: 'feed',
      Vaults: 'vaults',
      Traders: 'traders',
      Overview: 'top',
    }
    const id = map[s]
    if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' })
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header active={active} onNav={handleNav} />
      <Ticker markets={markets} />

      <main className="flex-1">
        <Hero stats={heroStats} />

        <div className="mx-auto max-w-[1320px] px-4 lg:px-6 space-y-6 pb-4">
          {/* charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ThroughputChart data={series} />
            <VolumeChart data={series} />
          </div>

          {/* feed + traders */}
          <div id="feed" className="grid grid-cols-1 xl:grid-cols-3 gap-6 scroll-mt-20">
            <div className="xl:col-span-2">
              <SectionTitle kicker="Real-time" title="LIVE NETWORK ACTIVITY" />
              <LiveFeed blocks={blocks} txns={txns} paused={paused} setPaused={setPaused} />
            </div>
            <div id="traders" className="scroll-mt-20">
              <TopTraders traders={traders} />
            </div>
          </div>

          {/* markets */}
          <div id="markets" className="scroll-mt-20">
            <MarketsTable markets={markets} />
          </div>

          {/* vaults */}
          <div id="vaults" className="scroll-mt-20">
            <Vaults />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

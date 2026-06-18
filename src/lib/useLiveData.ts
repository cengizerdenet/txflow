import { useEffect, useRef, useState } from 'react'
import {
  type Block,
  type Market,
  type NetStats,
  type SeriesPoint,
  type Txn,
  buildMarkets,
  buildSeries,
  initialStats,
  makeBlock,
  makeTxn,
  tickMarket,
} from './mock'

export interface LiveState {
  stats: NetStats
  markets: Market[]
  blocks: Block[]
  txns: Txn[]
  series: SeriesPoint[]
  paused: boolean
  setPaused: (p: boolean) => void
}

const MAX_BLOCKS = 14
const MAX_TXNS = 18

export function useLiveData(): LiveState {
  const [stats, setStats] = useState<NetStats>(initialStats)
  const [markets, setMarkets] = useState<Market[]>(buildMarkets)
  const [blocks, setBlocks] = useState<Block[]>(() => {
    const start = initialStats().blockHeight
    return Array.from({ length: MAX_BLOCKS }, (_, i) => makeBlock(start - i))
  })
  const [txns, setTxns] = useState<Txn[]>(() => Array.from({ length: MAX_TXNS }, makeTxn))
  const [series, setSeries] = useState<SeriesPoint[]>(buildSeries)
  const [paused, setPaused] = useState(false)

  const pausedRef = useRef(paused)
  pausedRef.current = paused

  // New block roughly every 1s (display cadence)
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return
      setStats((s) => {
        const nextHeight = s.blockHeight + 1
        const newTps = Math.max(48_000, Math.min(250_000, s.tps + (Math.random() - 0.5) * 18_000))
        const block = makeBlock(nextHeight)
        setBlocks((b) => [block, ...b].slice(0, MAX_BLOCKS))
        return {
          ...s,
          blockHeight: nextHeight,
          tps: Math.round(newTps),
          totalTxns: s.totalTxns + block.txns,
          networkLoad: Math.max(0.05, Math.min(0.97, s.networkLoad + (Math.random() - 0.5) * 0.04)),
          gas: Math.max(0.001, s.gas + (Math.random() - 0.5) * 0.001),
          accounts: s.accounts + Math.floor(Math.random() * 6),
          volume24h: s.volume24h * (1 + (Math.random() - 0.5) * 0.002),
        }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Transactions stream faster
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return
      const batch = Array.from({ length: 1 + Math.floor(Math.random() * 2) }, makeTxn)
      setTxns((t) => [...batch, ...t].slice(0, MAX_TXNS))
    }, 650)
    return () => clearInterval(id)
  }, [])

  // Market prices tick
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return
      setMarkets((ms) => ms.map(tickMarket))
    }, 1400)
    return () => clearInterval(id)
  }, [])

  // Chart series advance
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return
      setSeries((s) => {
        const last = s[s.length - 1]
        const tps = Math.max(40_000, Math.min(250_000, last.tps + (Math.random() - 0.5) * 22_000))
        const volume = Math.max(400, last.volume + (Math.random() - 0.48) * 420)
        const d = new Date()
        const point: SeriesPoint = {
          t: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
          tps: Math.round(tps),
          volume: Math.round(volume),
          txns: Math.round(tps * (1.6 + Math.random())),
        }
        return [...s.slice(1), point]
      })
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return { stats, markets, blocks, txns, series, paused, setPaused }
}

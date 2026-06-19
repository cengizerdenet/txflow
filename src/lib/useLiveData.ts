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
import { fetchMarketPrices, fetchTvl, type PriceQuote } from './api'

export interface LiveState {
  stats: NetStats
  markets: Market[]
  blocks: Block[]
  txns: Txn[]
  series: SeriesPoint[]
  paused: boolean
  setPaused: (p: boolean) => void
  /** true once real Binance/DefiLlama data has been merged in */
  live: boolean
  /** epoch ms of the last successful market refresh, 0 if none yet */
  lastUpdated: number
}

const MAX_BLOCKS = 14
const MAX_TXNS = 18
const REFRESH_MS = 30_000

/** Merge a real Binance quote onto a simulated market, keeping derived fields. */
function applyQuote(m: Market, q: PriceQuote): Market {
  return {
    ...m,
    price: q.price,
    prev: q.price,
    change24h: q.change24h,
    volume24h: q.volume24h,
    // Spot APIs expose no open interest — estimate from real 24h volume.
    openInterest: q.volume24h * 0.16,
  }
}

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
  const [live, setLive] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(0)

  const pausedRef = useRef(paused)
  pausedRef.current = paused

  // Symbols that carry a real (Binance) quote — their change24h/volume must
  // not be mutated by the local price jitter below.
  const realSymbols = useRef<Set<string>>(new Set())

  /* ---- real market prices + TVL ------------------------------------ */
  useEffect(() => {
    const ac = new AbortController()
    let timer: ReturnType<typeof setInterval>

    async function refresh() {
      try {
        const [quotes, tvl] = await Promise.allSettled([
          fetchMarketPrices(ac.signal),
          fetchTvl(ac.signal),
        ])

        if (quotes.status === 'fulfilled') {
          const q = quotes.value
          realSymbols.current = new Set(Object.keys(q))
          setMarkets((ms) => ms.map((m) => (q[m.symbol] ? applyQuote(m, q[m.symbol]) : m)))
          setLive(true)
          setLastUpdated(Date.now())
        }

        setStats((s) => {
          const next = { ...s }
          if (tvl.status === 'fulfilled') next.tvl = tvl.value
          return next
        })
      } catch {
        /* keep last-known / simulated values on failure */
      }
    }

    refresh()
    timer = setInterval(refresh, REFRESH_MS)
    return () => {
      ac.abort()
      clearInterval(timer)
    }
  }, [])

  // Keep aggregate stats (24h volume, open interest, market count) in sync
  // with whatever the markets currently hold (real once loaded).
  useEffect(() => {
    setStats((s) => ({
      ...s,
      volume24h: markets.reduce((a, m) => a + m.volume24h, 0),
      openInterest: markets.reduce((a, m) => a + m.openInterest, 0),
      markets: markets.length,
    }))
  }, [markets])

  // New block roughly every 1s (display cadence) — SIMULATED chain data.
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
        }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Transactions stream faster — SIMULATED.
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return
      const batch = Array.from({ length: 1 + Math.floor(Math.random() * 2) }, makeTxn)
      setTxns((t) => [...batch, ...t].slice(0, MAX_TXNS))
    }, 650)
    return () => clearInterval(id)
  }, [])

  // Market price micro-ticks for a "live" feel between real refreshes.
  // Real symbols only jitter price slightly; their change24h / volume stay
  // anchored to the last real value. Non-Binance symbols (e.g. TXF) keep the
  // full simulated tick.
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return
      setMarkets((ms) =>
        ms.map((m) => {
          if (!realSymbols.current.has(m.symbol)) return tickMarket(m)
          const drift = (Math.random() - 0.5) * 0.0008
          return { ...m, prev: m.price, price: Math.max(0.0001, m.price * (1 + drift)) }
        }),
      )
    }, 1400)
    return () => clearInterval(id)
  }, [])

  // Chart series advance — SIMULATED throughput/volume shape.
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

  return { stats, markets, blocks, txns, series, paused, setPaused, live, lastUpdated }
}

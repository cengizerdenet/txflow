import { randAddr, randHash } from './format'

/* ------------------------------------------------------------------ *
 *  Static reference data — TxFlow L1 network                          *
 * ------------------------------------------------------------------ */

export const TX_METHODS = [
  'PlaceOrder',
  'CancelOrder',
  'MarketMatch',
  'Liquidation',
  'Deposit',
  'Withdraw',
  'VaultStake',
  'VaultRedeem',
  'Transfer',
  'ChannelSettle',
  'FundingPayment',
  'OracleUpdate',
] as const

export type TxMethod = (typeof TX_METHODS)[number]

export const METHOD_TINT: Record<string, string> = {
  PlaceOrder: 'text-mint',
  CancelOrder: 'text-ink-soft',
  MarketMatch: 'text-cyan',
  Liquidation: 'text-down',
  Deposit: 'text-mint',
  Withdraw: 'text-warn',
  VaultStake: 'text-mint',
  VaultRedeem: 'text-warn',
  Transfer: 'text-ink-soft',
  ChannelSettle: 'text-cyan',
  FundingPayment: 'text-ink-soft',
  OracleUpdate: 'text-cyan',
}

export interface Market {
  symbol: string
  name: string
  price: number
  prev: number
  change24h: number
  volume24h: number
  openInterest: number
  funding: number
  leverage: number
}

export interface Vault {
  name: string
  kind: 'Protocol' | 'User'
  tvl: number
  apy: number
  depositors: number
  pnl30d: number
  capacity: number
}

export interface Trader {
  address: string
  alias?: string
  pnl: number
  volume: number
  win: number
  trades: number
}

export interface Block {
  height: number
  hash: string
  ts: number
  txns: number
  proposer: string
  gasUsed: number
}

export interface Txn {
  hash: string
  ts: number
  method: TxMethod
  from: string
  to: string
  value: number
  market?: string
}

/* ------------------------------------------------------------------ *
 *  Markets                                                            *
 * ------------------------------------------------------------------ */

const MARKET_SEED: Array<[string, string, number, number]> = [
  ['BTC', 'Bitcoin', 71820, 1_240_000_000],
  ['ETH', 'Ethereum', 3842, 880_000_000],
  ['SOL', 'Solana', 188.4, 410_000_000],
  ['TXF', 'TxFlow', 4.62, 96_000_000],
  ['HYPE', 'Hyperliquid', 27.9, 71_000_000],
  ['SUI', 'Sui', 3.18, 44_000_000],
  ['AVAX', 'Avalanche', 41.7, 38_000_000],
  ['LINK', 'Chainlink', 17.4, 33_000_000],
  ['DOGE', 'Dogecoin', 0.162, 29_000_000],
  ['ARB', 'Arbitrum', 0.88, 18_000_000],
  ['APT', 'Aptos', 9.34, 15_000_000],
  ['TIA', 'Celestia', 6.71, 12_000_000],
  ['SEI', 'Sei', 0.51, 9_400_000],
  ['INJ', 'Injective', 24.8, 8_100_000],
]

export function buildMarkets(): Market[] {
  return MARKET_SEED.map(([symbol, name, price, vol]) => {
    const change = (Math.random() - 0.45) * 9
    return {
      symbol,
      name,
      price,
      prev: price,
      change24h: change,
      volume24h: vol * (0.8 + Math.random() * 0.5),
      openInterest: vol * (0.18 + Math.random() * 0.25),
      funding: (Math.random() - 0.5) * 0.05,
      leverage: [20, 25, 40, 50][Math.floor(Math.random() * 4)],
    }
  })
}

export function tickMarket(m: Market): Market {
  const drift = (Math.random() - 0.5) * 0.0016
  const price = Math.max(0.0001, m.price * (1 + drift))
  return {
    ...m,
    prev: m.price,
    price,
    change24h: m.change24h + drift * 100 * 0.4,
    funding: Math.max(-0.08, Math.min(0.08, m.funding + (Math.random() - 0.5) * 0.002)),
  }
}

/* ------------------------------------------------------------------ *
 *  Vaults                                                             *
 * ------------------------------------------------------------------ */

export const VAULTS: Vault[] = [
  { name: 'TxFlow Liquidity Engine', kind: 'Protocol', tvl: 184_200_000, apy: 18.4, depositors: 9120, pnl30d: 6.2, capacity: 0.74 },
  { name: 'TIP Market Maker Vault', kind: 'Protocol', tvl: 96_400_000, apy: 22.7, depositors: 5340, pnl30d: 9.1, capacity: 0.61 },
  { name: 'Delta-Neutral Channel', kind: 'Protocol', tvl: 57_800_000, apy: 14.1, depositors: 3870, pnl30d: 3.8, capacity: 0.88 },
  { name: 'Apex Alpha Vault', kind: 'User', tvl: 23_900_000, apy: 41.3, depositors: 1420, pnl30d: 17.4, capacity: 0.52 },
  { name: 'Stoic Yield', kind: 'User', tvl: 12_600_000, apy: 9.8, depositors: 980, pnl30d: 2.1, capacity: 0.43 },
  { name: 'Volt Perp Strategy', kind: 'User', tvl: 8_300_000, apy: 33.6, depositors: 612, pnl30d: -4.2, capacity: 0.39 },
]

/* ------------------------------------------------------------------ *
 *  Traders leaderboard                                                *
 * ------------------------------------------------------------------ */

const ALIASES = [
  'sniper.tx',
  'whale_0x',
  'liquidator',
  'mm_prime',
  'degen.eth',
  'cold_arb',
  'flowstate',
  'block_ninja',
  undefined,
  undefined,
  'tide_maker',
  undefined,
]

export function buildTraders(): Trader[] {
  return Array.from({ length: 12 }, (_, i) => {
    const pnl = (12 - i) * (40000 + Math.random() * 90000) - (i > 8 ? 60000 : 0)
    return {
      address: randAddr(),
      alias: ALIASES[i],
      pnl,
      volume: (12 - i) * 4_200_000 * (0.7 + Math.random()),
      win: 44 + Math.random() * 38,
      trades: Math.floor(400 + Math.random() * 6000),
    }
  }).sort((a, b) => b.pnl - a.pnl)
}

/* ------------------------------------------------------------------ *
 *  Blocks & transactions (live feed)                                  *
 * ------------------------------------------------------------------ */

const PROPOSERS = ['Validator-07', 'Validator-12', 'Validator-03', 'Validator-21', 'Validator-15', 'Validator-09']

export function makeBlock(height: number): Block {
  return {
    height,
    hash: randHash(64),
    ts: Date.now(),
    txns: Math.floor(180 + Math.random() * 2200),
    proposer: PROPOSERS[Math.floor(Math.random() * PROPOSERS.length)],
    gasUsed: Math.random() * 0.9,
  }
}

const MARKET_SYMBOLS = MARKET_SEED.map((m) => m[0])

export function makeTxn(): Txn {
  const method = TX_METHODS[Math.floor(Math.random() * TX_METHODS.length)]
  const usesMarket = ['PlaceOrder', 'CancelOrder', 'MarketMatch', 'Liquidation', 'FundingPayment'].includes(method)
  return {
    hash: randHash(64),
    ts: Date.now(),
    method,
    from: randAddr(),
    to: randAddr(),
    value: Math.random() < 0.5 ? Math.random() * 250000 : Math.random() * 4000,
    market: usesMarket ? MARKET_SYMBOLS[Math.floor(Math.random() * MARKET_SYMBOLS.length)] : undefined,
  }
}

/* ------------------------------------------------------------------ *
 *  Time-series for charts                                             *
 * ------------------------------------------------------------------ */

export interface SeriesPoint {
  t: string
  tps: number
  volume: number
  txns: number
}

export function buildSeries(points = 48): SeriesPoint[] {
  const out: SeriesPoint[] = []
  let tps = 110_000
  let vol = 2_100
  for (let i = points; i > 0; i--) {
    tps = Math.max(40_000, Math.min(250_000, tps + (Math.random() - 0.5) * 26_000))
    vol = Math.max(400, vol + (Math.random() - 0.48) * 480)
    const d = new Date(Date.now() - i * 30 * 60 * 1000)
    out.push({
      t: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
      tps: Math.round(tps),
      volume: Math.round(vol),
      txns: Math.round(tps * (1.6 + Math.random())),
    })
  }
  return out
}

/* ------------------------------------------------------------------ *
 *  Network headline stats                                             *
 * ------------------------------------------------------------------ */

export interface NetStats {
  tps: number
  blockTime: number
  finality: number
  gas: number
  blockHeight: number
  totalTxns: number
  accounts: number
  networkLoad: number
  tvl: number
  takerFee: number
  markets: number
  volume24h: number
  openInterest: number
  uptime: number
}

export function initialStats(): NetStats {
  return {
    tps: 142_380,
    blockTime: 0.2,
    finality: 200,
    gas: 0.008,
    blockHeight: 28_412_905,
    totalTxns: 3_104_882_551,
    accounts: 1_284_390,
    networkLoad: 0.34,
    tvl: 1_842_000_000,
    takerFee: 0.025,
    markets: MARKET_SEED.length,
    volume24h: 4_120_000_000,
    openInterest: 612_000_000,
    uptime: 99.99,
  }
}

/* ------------------------------------------------------------------ *
 *  Deterministic detail-page data (account / block / tx)              *
 * ------------------------------------------------------------------ */
import { pick, range, rngFrom, seededHex } from './seed'

const MARKET_SYMS = MARKET_SEED.map((m) => m[0])
const MARKET_PRICES: Record<string, number> = Object.fromEntries(
  MARKET_SEED.map((m) => [m[0], m[2]]),
)

export interface Position {
  market: string
  side: 'LONG' | 'SHORT'
  size: number
  entry: number
  mark: number
  leverage: number
  pnl: number
  pnlPct: number
}

export interface AccountInfo {
  address: string
  equity: number
  available: number
  marginUsed: number
  positions: Position[]
  txns: Txn[]
  pnl30d: number
  volume30d: number
  trades: number
  win: number
  firstSeen: number
}

export function getAccount(address: string): AccountInfo {
  const rng = rngFrom(address.toLowerCase())
  const posCount = Math.floor(range(rng, 0, 5))
  const positions: Position[] = Array.from({ length: posCount }, () => {
    const market = pick(rng, MARKET_SYMS)
    const mark = MARKET_PRICES[market]
    const entry = mark * (1 + range(rng, -0.12, 0.12))
    const side: 'LONG' | 'SHORT' = rng() > 0.5 ? 'LONG' : 'SHORT'
    const size = range(rng, 0.2, 40) * (mark > 1000 ? 0.05 : 1)
    const notional = size * mark
    const dir = side === 'LONG' ? 1 : -1
    const pnlPct = ((mark - entry) / entry) * 100 * dir
    return {
      market,
      side,
      size,
      entry,
      mark,
      leverage: pick(rng, [5, 10, 20, 25, 40, 50]),
      pnl: (notional * pnlPct) / 100,
      pnlPct,
    }
  })

  const txns: Txn[] = Array.from({ length: Math.floor(range(rng, 6, 16)) }, () => {
    const method = pick(rng, TX_METHODS)
    const usesMarket = ['PlaceOrder', 'CancelOrder', 'MarketMatch', 'Liquidation', 'FundingPayment'].includes(method)
    return {
      hash: seededHex(rng, 64),
      ts: Date.now() - Math.floor(range(rng, 30, 86_400 * 12) * 1000),
      method,
      from: address,
      to: seededHex(rng, 40),
      value: range(rng, 50, 180_000),
      market: usesMarket ? pick(rng, MARKET_SYMS) : undefined,
    }
  }).sort((a, b) => b.ts - a.ts)

  const equity = range(rng, 1_200, 4_800_000)
  const marginUsed = equity * range(rng, 0.05, 0.7)
  return {
    address,
    equity,
    available: equity - marginUsed,
    marginUsed,
    positions,
    txns,
    pnl30d: range(rng, -180_000, 920_000),
    volume30d: range(rng, 50_000, 64_000_000),
    trades: Math.floor(range(rng, 12, 8400)),
    win: range(rng, 38, 79),
    firstSeen: Date.now() - Math.floor(range(rng, 5, 320) * 86_400 * 1000),
  }
}

export interface BlockDetail extends Block {
  parentHash: string
  stateRoot: string
  size: number
  gasLimit: number
  txList: Txn[]
}

export function getBlock(height: number): BlockDetail {
  const rng = rngFrom('block:' + height)
  const txCount = Math.floor(range(rng, 40, 600))
  const txList: Txn[] = Array.from({ length: Math.min(txCount, 40) }, () => {
    const method = pick(rng, TX_METHODS)
    const usesMarket = ['PlaceOrder', 'CancelOrder', 'MarketMatch', 'Liquidation', 'FundingPayment'].includes(method)
    return {
      hash: seededHex(rng, 64),
      ts: Date.now(),
      method,
      from: seededHex(rng, 40),
      to: seededHex(rng, 40),
      value: range(rng, 10, 220_000),
      market: usesMarket ? pick(rng, MARKET_SYMS) : undefined,
    }
  })
  return {
    height,
    hash: seededHex(rng, 64),
    parentHash: seededHex(rng, 64),
    stateRoot: seededHex(rng, 64),
    ts: Date.now() - Math.floor(range(rng, 0, 600) * 1000),
    txns: txCount,
    proposer: pick(rng, PROPOSERS),
    gasUsed: rng(),
    size: range(rng, 12, 480),
    gasLimit: 30_000_000,
    txList,
  }
}

export interface TxDetail extends Txn {
  block: number
  status: 'Success' | 'Reverted'
  fee: number
  nonce: number
  gasUsed: number
  confirmations: number
}

export function getTx(hash: string, currentHeight: number): TxDetail {
  const rng = rngFrom(hash.toLowerCase())
  const method = pick(rng, TX_METHODS)
  const usesMarket = ['PlaceOrder', 'CancelOrder', 'MarketMatch', 'Liquidation', 'FundingPayment'].includes(method)
  const block = currentHeight - Math.floor(range(rng, 1, 40_000))
  return {
    hash,
    ts: Date.now() - Math.floor(range(rng, 5, 86_400 * 6) * 1000),
    method,
    from: seededHex(rng, 40),
    to: seededHex(rng, 40),
    value: range(rng, 10, 240_000),
    market: usesMarket ? pick(rng, MARKET_SYMS) : undefined,
    block,
    status: rng() > 0.06 ? 'Success' : 'Reverted',
    fee: range(rng, 0.0001, 0.02),
    nonce: Math.floor(range(rng, 1, 5000)),
    gasUsed: Math.floor(range(rng, 21_000, 240_000)),
    confirmations: currentHeight - block,
  }
}

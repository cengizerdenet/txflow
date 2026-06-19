/**
 * Data adapter layer
 * ------------------
 * Market prices & TVL are pulled from public, CORS-open APIs so the dashboard
 * shows real, consistent numbers:
 *   - Binance spot 24h ticker  -> live price / 24h change / 24h volume
 *   - DefiLlama protocol TVL    -> real TxFlow TVL
 *
 * TxFlow L1 has no public RPC yet, so chain-level metrics (blocks, txns, TPS,
 * block height) stay locally simulated and are clearly labelled "SIMULATED"
 * in the UI. When a real endpoint ships, set it in a `.env` file:
 *   VITE_TXFLOW_RPC=https://rpc.txflow.com
 * and implement `rpc()` below.
 */

export const TXFLOW_RPC = import.meta.env.VITE_TXFLOW_RPC ?? ''
export const TXFLOW_API = import.meta.env.VITE_TXFLOW_API ?? ''
export const USE_LIVE_API = Boolean(TXFLOW_RPC || TXFLOW_API)

/* ------------------------------------------------------------------ *
 *  Binance — live spot prices                                         *
 * ------------------------------------------------------------------ */

/** Map our market symbol -> Binance spot pair. Symbols not on Binance
 *  (TxFlow's own token) are intentionally omitted and stay simulated. */
export const BINANCE_PAIRS: Record<string, string> = {
  BTC: 'BTCUSDT',
  ETH: 'ETHUSDT',
  SOL: 'SOLUSDT',
  HYPE: 'HYPEUSDT',
  SUI: 'SUIUSDT',
  AVAX: 'AVAXUSDT',
  LINK: 'LINKUSDT',
  DOGE: 'DOGEUSDT',
  ARB: 'ARBUSDT',
  APT: 'APTUSDT',
  TIA: 'TIAUSDT',
  SEI: 'SEIUSDT',
  INJ: 'INJUSDT',
}

export interface PriceQuote {
  price: number
  change24h: number
  volume24h: number
}

interface BinanceTicker {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  quoteVolume: string
}

/**
 * Fetch live 24h tickers from Binance for all mapped symbols in a single
 * request. Returns a map keyed by our internal symbol (BTC, ETH, …).
 */
export async function fetchMarketPrices(signal?: AbortSignal): Promise<Record<string, PriceQuote>> {
  const pairs = Object.values(BINANCE_PAIRS)
  const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(pairs))}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Binance ticker failed: ${res.status}`)
  const data = (await res.json()) as BinanceTicker[]

  const pairToSymbol: Record<string, string> = {}
  for (const [sym, pair] of Object.entries(BINANCE_PAIRS)) pairToSymbol[pair] = sym

  const out: Record<string, PriceQuote> = {}
  for (const t of data) {
    const sym = pairToSymbol[t.symbol]
    if (!sym) continue
    const price = parseFloat(t.lastPrice)
    if (!Number.isFinite(price) || price <= 0) continue
    out[sym] = {
      price,
      change24h: parseFloat(t.priceChangePercent),
      volume24h: parseFloat(t.quoteVolume),
    }
  }
  return out
}

/* ------------------------------------------------------------------ *
 *  DefiLlama — real protocol TVL                                      *
 * ------------------------------------------------------------------ */

interface LlamaProtocol {
  tvl?: Array<{ date: number; totalLiquidityUSD: number }>
  currentChainTvls?: Record<string, number>
}

/** Fetch the current TxFlow TVL (USD) from DefiLlama. */
export async function fetchTvl(signal?: AbortSignal): Promise<number> {
  const res = await fetch('https://api.llama.fi/protocol/txflow', { signal })
  if (!res.ok) throw new Error(`DefiLlama TVL failed: ${res.status}`)
  const data = (await res.json()) as LlamaProtocol

  // Prefer the sum of current chain TVLs; fall back to the latest series point.
  if (data.currentChainTvls) {
    const sum = Object.entries(data.currentChainTvls)
      .filter(([k]) => !/-(borrowed|staking|pool2|treasury)$/i.test(k))
      .reduce((a, [, v]) => a + (Number(v) || 0), 0)
    if (sum > 0) return sum
  }
  if (data.tvl?.length) {
    const last = data.tvl[data.tvl.length - 1]
    if (last?.totalLiquidityUSD) return last.totalLiquidityUSD
  }
  throw new Error('DefiLlama TVL: no usable value in response')
}

/**
 * Real TxFlow L1 JSON-RPC integration point (unused while chain data is
 * simulated). Implement once VITE_TXFLOW_RPC is configured.
 */
export async function rpc<T>(method: string, params: unknown[] = []): Promise<T> {
  if (!TXFLOW_RPC) throw new Error('VITE_TXFLOW_RPC is not configured')
  const res = await fetch(TXFLOW_RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params }),
  })
  if (!res.ok) throw new Error(`RPC ${method} failed: ${res.status}`)
  const json = await res.json()
  if (json.error) throw new Error(json.error.message ?? 'RPC error')
  return json.result as T
}

# TxFlowScan

A modern, real-time explorer-style dashboard for **TxFlow L1** — the open Layer 1 where on-chain finance happens (fully on-chain CLOB perps, TIP Liquidity Standards, Channels & Vaults).

Inspired by the layout of RiseScan, rebranded with TxFlow's terminal / system-monitor aesthetic and signature mint-green palette.

## Features

- **Live network header** — TPS, block time, finality, gas, block height, total txns, accounts, network load, TVL, 24h volume, open interest, taker fee. Values update every second.
- **Scrolling market ticker** — live perp prices and 24h change.
- **Throughput & volume charts** — animated TPS area chart and settlement-volume bars (Recharts), advancing in real time.
- **Live activity feed** — streaming transactions and blocks with pause/resume, method tags, gas usage and timestamps.
- **Perpetual markets table** — 14 markets with price (live ticking), 24h change, volume, open interest, funding and leverage.
- **Vaults** — Protocol & User vaults with APY, TVL, 30d PnL, depositors and capacity bars.
- **Top traders leaderboard** — ranked by realized PnL with volume, win rate and trade count.
- Fully responsive, dark, terminal-styled UI.

> All data is simulated client-side for demonstration. Swap the generators in `src/lib/mock.ts` / `src/lib/useLiveData.ts` with a real TxFlow RPC / API to make it live.

## Tech

- React 18 + TypeScript + Vite
- Tailwind CSS (custom TxFlow theme in `tailwind.config.js`)
- Recharts

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview
```

## Deploy (Vercel)

The repo includes `vercel.json`. Push to a Git provider and import into Vercel, or:

```bash
npx vercel
```

## Project structure

```
src/
  App.tsx                 # page composition
  index.css               # theme base + backdrop grid/glow
  lib/
    format.ts             # number / hash / time helpers
    mock.ts               # static + generated TxFlow data
    useLiveData.ts        # live simulation hook (streams blocks/txns/prices)
  components/
    atoms.tsx             # Logo, StatusDot, SectionTitle, Pill, Delta
    Header.tsx  Ticker.tsx  Hero.tsx
    Charts.tsx  LiveFeed.tsx  MarketsTable.tsx
    Vaults.tsx  TopTraders.tsx  Footer.tsx
```

Not affiliated with TxFlow. Read-only, unofficial demo.

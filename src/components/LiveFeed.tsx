import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Block, Txn } from '../lib/mock'
import { METHOD_TINT } from '../lib/mock'
import { fmtNum, fmtUsd, shortHash, timeAgo } from '../lib/format'
import { StatusDot } from './atoms'

function BlockRow({ b }: { b: Block }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/block/${b.height}`)}
      className="row-hover flex items-center gap-3 px-4 py-2.5 border-b border-line-soft animate-fade-slide cursor-pointer"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-mint/[0.06]">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-mint">
          <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mono text-[13px] text-mint font-medium">#{fmtNum(b.height)}</div>
        <div className="mono text-[11px] text-ink-mute truncate">{b.proposer}</div>
      </div>
      <div className="text-right">
        <div className="mono text-[12.5px] text-ink">{fmtNum(b.txns)} txns</div>
        <div className="mono text-[11px] text-ink-mute">{timeAgo(b.ts)}</div>
      </div>
      <div className="w-14 text-right">
        <div className="mono text-[11px] text-ink-soft">{(b.gasUsed * 100).toFixed(0)}%</div>
        <div className="h-1 mt-1 rounded-full bg-line overflow-hidden">
          <div className="h-full bg-cyan" style={{ width: `${b.gasUsed * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

function TxnRow({ t }: { t: Txn }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/tx/${t.hash}`)}
      className="row-hover flex items-center gap-3 px-4 py-2.5 border-b border-line-soft animate-fade-slide cursor-pointer"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-white/[0.02]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-ink-soft">
          <path d="M4 12h16M14 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="mono text-[12.5px] text-cyan truncate">{shortHash(t.hash)}</span>
          {t.market && <span className="mono text-[10px] text-ink-mute">{t.market}-PERP</span>}
        </div>
        <div className="mono text-[11px] text-ink-mute truncate">
          {shortHash(t.from, 6, 4)} → {shortHash(t.to, 6, 4)}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className={`mono text-[11.5px] font-medium ${METHOD_TINT[t.method] ?? 'text-ink-soft'}`}>{t.method}</div>
        <div className="mono text-[11px] text-ink-mute">{fmtUsd(t.value, { compact: true })}</div>
      </div>
    </div>
  )
}

export function LiveFeed({
  blocks,
  txns,
  paused,
  setPaused,
}: {
  blocks: Block[]
  txns: Txn[]
  paused: boolean
  setPaused: (p: boolean) => void
}) {
  const [tab, setTab] = useState<'blocks' | 'txns'>('txns')

  return (
    <div className="card overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 px-4 h-12 border-b border-line">
        <div className="flex items-center gap-1">
          {(['txns', 'blocks'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`mono text-[12px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-md transition-colors ${
                tab === t ? 'text-mint bg-mint/[0.07]' : 'text-ink-mute hover:text-ink-soft'
              }`}
            >
              {t === 'txns' ? 'Transactions' : 'Blocks'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <StatusDot ok={!paused} label={paused ? 'Paused' : 'Streaming'} />
          <button
            onClick={() => setPaused(!paused)}
            className="mono text-[11px] uppercase tracking-[0.1em] text-ink-mute hover:text-ink border border-line rounded-md px-2 py-1 transition-colors"
          >
            {paused ? '▶ resume' : '⏸ pause'}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[560px]">
        {tab === 'txns'
          ? txns.map((t) => <TxnRow key={t.hash} t={t} />)
          : blocks.map((b) => <BlockRow key={b.height} b={b} />)}
      </div>
    </div>
  )
}

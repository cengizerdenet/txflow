export function fmtNum(n: number, opts: { dp?: number; compact?: boolean } = {}): string {
  const { dp, compact } = opts
  if (compact) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: dp ?? 2,
    }).format(n)
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: dp ?? 0,
    maximumFractionDigits: dp ?? 0,
  }).format(n)
}

export function fmtUsd(n: number, opts: { dp?: number; compact?: boolean } = {}): string {
  const { dp, compact } = opts
  if (compact) {
    return (
      '$' +
      new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: dp ?? 2,
      }).format(n)
    )
  }
  return (
    '$' +
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: dp ?? 2,
      maximumFractionDigits: dp ?? 2,
    }).format(n)
  )
}

export function fmtPct(n: number, dp = 2): string {
  const s = n.toFixed(dp)
  return `${n > 0 ? '+' : ''}${s}%`
}

export function shortHash(h: string, lead = 6, tail = 4): string {
  if (h.length <= lead + tail + 2) return h
  return `${h.slice(0, lead)}…${h.slice(-tail)}`
}

export function timeAgo(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (s < 1) return 'now'
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const HEX = '0123456789abcdef'
export function randHash(len = 64): string {
  let out = '0x'
  for (let i = 0; i < len; i++) out += HEX[Math.floor(Math.random() * 16)]
  return out
}

export function randAddr(): string {
  return randHash(40)
}

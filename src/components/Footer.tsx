import { Link } from 'react-router-dom'
import { Logo, StatusDot } from './atoms'

const COLS: Array<[string, Array<[string, string]>]> = [
  [
    'Explore',
    [
      ['Overview', '/'],
      ['Markets', '/markets'],
      ['Traders', '/traders'],
      ['Account', '/account'],
    ],
  ],
  [
    'Protocol',
    [
      ['Trade ↗', 'https://app.txflow.com/r/TXCANAVAR'],
      ['Documentation ↗', 'https://docs.txflow.com/'],
      ['Channels ↗', 'https://docs.txflow.com/'],
      ['Download App ↗', 'https://app.txflow.com/download'],
    ],
  ],
  [
    'Community',
    [
      ['X ↗', 'https://x.com/TxFlow_L1'],
      ['Discord ↗', 'https://discord.gg/txflow'],
      ['Status', '/'],
      ['API', '/'],
    ],
  ],
]

function FootLink({ label, href }: { label: string; href: string }) {
  const cls = 'mono text-[12px] text-ink-soft hover:text-mint transition-colors'
  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {label}
      </a>
    )
  }
  return (
    <Link to={href} className={cls}>
      {label}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line mt-12">
      <div className="mx-auto max-w-[1320px] px-4 lg:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-sm">
            <Logo />
            <p className="text-[12.5px] text-ink-mute leading-relaxed">
              An independent, read-only explorer for TxFlow L1 — live blocks, transactions, perpetual markets and
              vaults. Unofficial. Not affiliated with TxFlow. Figures are estimates.
            </p>
            <StatusDot label="System status: green" />
          </div>

          <div className="grid grid-cols-3 gap-x-10 gap-y-2">
            {COLS.map(([title, items]) => (
              <div key={title}>
                <div className="label mb-3">{title}</div>
                <ul className="space-y-2">
                  {items.map(([label, href]) => (
                    <li key={label}>
                      <FootLink label={label} href={href} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-line-soft flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="mono text-[11px] text-ink-faint">© 2026 TxFlowScan · Built on TxFlow L1</span>
          <span className="mono text-[11px] text-ink-faint">Data: TxFlow public RPC · refreshed live</span>
        </div>
      </div>
    </footer>
  )
}

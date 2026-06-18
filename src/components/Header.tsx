import { useState } from 'react'
import { Logo, StatusDot } from './atoms'

const NAV = ['Overview', 'Markets', 'Blocks', 'Transactions', 'Vaults', 'Traders']

export function Header({ active, onNav }: { active: string; onNav: (s: string) => void }) {
  const [q, setQ] = useState('')

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1320px] px-4 lg:px-6">
        <div className="flex h-16 items-center gap-4">
          <button onClick={() => onNav('Overview')} className="shrink-0">
            <Logo />
          </button>

          <nav className="hidden lg:flex items-center gap-1 ml-3">
            {NAV.map((n) => (
              <button
                key={n}
                onClick={() => onNav(n)}
                className={`mono text-[12px] uppercase tracking-[0.12em] px-3 py-2 rounded-md transition-colors ${
                  active === n ? 'text-mint bg-mint/[0.07]' : 'text-ink-soft hover:text-ink hover:bg-white/[0.03]'
                }`}
              >
                {n}
              </button>
            ))}
          </nav>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="hidden md:flex flex-1 max-w-md ml-auto items-center gap-2 rounded-lg border border-line bg-surface/80 px-3 h-9 focus-within:border-mint/40 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-ink-mute">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search address / txn / block / market"
              className="mono flex-1 bg-transparent text-[12.5px] text-ink placeholder:text-ink-faint outline-none"
            />
            <kbd className="mono hidden lg:block text-[10px] text-ink-faint border border-line rounded px-1.5 py-0.5">↵</kbd>
          </form>

          <div className="ml-auto md:ml-0 flex items-center gap-3">
            <span className="hidden xl:inline-flex">
              <StatusDot label="Mainnet · Live" />
            </span>
            <a
              href="https://app.txflow.com/r/TXCANAVAR"
              target="_blank"
              rel="noreferrer"
              className="mono text-[12px] font-semibold uppercase tracking-[0.1em] text-base bg-mint hover:bg-mint-glow transition-colors rounded-lg px-3.5 h-9 inline-flex items-center gap-1.5 shadow-glow"
            >
              Trade ↗
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

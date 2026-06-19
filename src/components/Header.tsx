import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Logo, StatusDot } from './atoms'

const NAV: Array<[string, string]> = [
  ['Overview', '/'],
  ['Markets', '/markets'],
  ['Traders', '/traders'],
  ['Account', '/account'],
]

/** Route a raw search query to the most likely destination. */
function resolveQuery(raw: string): string | null {
  const q = raw.trim()
  if (!q) return null
  const hex = q.toLowerCase()
  if (/^0x[0-9a-f]{64}$/.test(hex)) return `/tx/${hex}`
  if (/^0x[0-9a-f]{40}$/.test(hex)) return `/account/${hex}`
  if (/^[0-9]{1,12}$/.test(q)) return `/block/${q}`
  if (/^[a-z]{2,8}$/i.test(q)) return `/markets?q=${encodeURIComponent(q.toUpperCase())}`
  // fallback: treat as account-ish lookup
  return `/account/${hex}`
}

export function Header() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const dest = resolveQuery(q)
    if (dest) {
      navigate(dest)
      setQ('')
    }
  }

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1320px] px-4 lg:px-6">
        <div className="flex h-16 items-center gap-4">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-3">
            {NAV.map(([n, path]) => (
              <Link
                key={n}
                to={path}
                className={`mono text-[12px] uppercase tracking-[0.12em] px-3 py-2 rounded-md transition-colors ${
                  isActive(path) ? 'text-mint bg-mint/[0.07]' : 'text-ink-soft hover:text-ink hover:bg-white/[0.03]'
                }`}
              >
                {n}
              </Link>
            ))}
          </nav>

          <form
            onSubmit={submit}
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

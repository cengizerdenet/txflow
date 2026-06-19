import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 lg:px-6 py-24 text-center">
      <div className="mono text-[64px] font-bold text-mint leading-none">404</div>
      <p className="mt-4 text-[14px] text-ink-soft">This route doesn’t exist on TxFlowScan.</p>
      <Link
        to="/"
        className="mono inline-flex mt-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-base bg-mint hover:bg-mint-glow rounded-lg px-4 h-10 items-center"
      >
        ← Back to overview
      </Link>
    </div>
  )
}

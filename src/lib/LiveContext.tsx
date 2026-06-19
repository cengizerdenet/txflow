import { createContext, useContext, type ReactNode } from 'react'
import { useLiveData, type LiveState } from './useLiveData'

const LiveCtx = createContext<LiveState | null>(null)

export function LiveProvider({ children }: { children: ReactNode }) {
  const value = useLiveData()
  return <LiveCtx.Provider value={value}>{children}</LiveCtx.Provider>
}

export function useLive(): LiveState {
  const ctx = useContext(LiveCtx)
  if (!ctx) throw new Error('useLive must be used within <LiveProvider>')
  return ctx
}

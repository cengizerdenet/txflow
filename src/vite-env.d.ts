/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TXFLOW_RPC?: string
  readonly VITE_TXFLOW_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

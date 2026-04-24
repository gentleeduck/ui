import type { UploadApi } from './backendApi'
import type { CursorMap } from './cursor.types'
import type { IntentMap } from './intent.types'
import type { UploadResultBase } from './result.types'
import type { UploadTransport } from './transport/transport.types'

export type StrategyCtx<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase,
  K extends keyof M & string,
> = {
  file: File
  intent: M[K]
  signal: AbortSignal
  transport: UploadTransport
  api: UploadApi<M, P, R>
  reportProgress: (p: { uploadedBytes: number; totalBytes: number }) => void
  readCursor: () => C[K] | undefined
  persistCursor: (cursor: C[K] | undefined) => void
}

export type UploadStrategy<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase,
  K extends keyof M & string,
> = {
  id: K
  resumable: boolean
  start(ctx: StrategyCtx<M, C, P, R, K>): Promise<void>
}

export interface StrategyRegistry<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string = string,
  R extends UploadResultBase = UploadResultBase,
> {
  get<K extends keyof M & string>(id: K): UploadStrategy<M, C, P, R, K> | undefined
  has(id: string): id is keyof M & string
  set<K extends keyof M & string>(strategy: UploadStrategy<M, C, P, R, K>): void
}

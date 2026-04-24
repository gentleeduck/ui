import type { CursorMap, IntentMap, UploadResultBase } from '../contracts'
import type { StoreOptions, UploadStore } from '../engine/store'
import { createUploadStore } from '../engine/store'

export type UploadClient<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
> = UploadStore<M, C, P, R>

export function createUploadClient<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
>(opts: StoreOptions<M, C, P, R>): UploadClient<M, C, P, R> {
  return createUploadStore(opts)
}

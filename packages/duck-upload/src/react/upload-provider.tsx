'use client'

import { createContext, type ReactNode, useContext } from 'react'
import { type CursorMap, type IntentMap, isRecord, type UploadResultBase } from '../core'
import type { UploadStore } from '../core/engine/store'

// React Context can't carry generics, so the runtime value is `unknown`; the
// hooks below re-narrow with `isUploadStore`.
const UploadContext = createContext<unknown | null>(null)

/** Provides an upload store to descendants. */
export function UploadProvider<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
>({ store, children }: { store: UploadStore<M, C, P, R>; children: ReactNode }): React.JSX.Element {
  return <UploadContext.Provider value={store}>{children}</UploadContext.Provider>
}

/**
 * Read the upload store from context if provided. Returns `null` outside a
 * provider so higher-level hooks can keep their context read unconditional
 * while still accepting an explicit store argument.
 */
export function useOptionalUploadStore<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
>(): UploadStore<M, C, P, R> | null {
  const store = useContext(UploadContext)
  if (store === null) {
    return null
  }

  if (!isUploadStore<M, C, P, R>(store)) {
    throw new Error('UploadProvider received an invalid store value')
  }

  return store
}

/** Read the upload store from context. Throws when called outside `UploadProvider`. */
export function useUploadStore<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
>(): UploadStore<M, C, P, R> {
  const store = useOptionalUploadStore<M, C, P, R>()
  if (!store) {
    throw new Error('useUploadStore must be used within UploadProvider')
  }
  return store
}

function isUploadStore<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  value: unknown,
): value is UploadStore<M, C, P, R> {
  if (!isRecord(value)) return false
  return (
    typeof value.getSnapshot === 'function' &&
    typeof value.subscribe === 'function' &&
    typeof value.dispatch === 'function' &&
    typeof value.on === 'function' &&
    typeof value.off === 'function' &&
    typeof value.waitFor === 'function'
  )
}

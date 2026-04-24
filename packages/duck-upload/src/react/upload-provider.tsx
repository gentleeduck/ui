'use client'

/**
 * @fileoverview React context provider for the upload store.
 *
 * Provides the upload store instance to all child components via React Context.
 * This allows components to access the store without prop drilling.
 *
 * @module upload-provider
 */

import { createContext, type ReactNode, useContext } from 'react'
import { type CursorMap, type IntentMap, isRecord, type UploadResultBase } from '../core'
import type { UploadStore } from '../core/engine/store'

/**
 * React context for the upload store.
 * Initialized as null and must be provided via UploadProvider.
 *
 * Note: Context cannot be generic at the type level in React, so we use a base type.
 * The useUploadStore hook provides type safety through type assertion which is safe
 * because the provider ensures the correct type is stored.
 */
const UploadContext = createContext<unknown | null>(null)

/**
 * Provider component that makes the upload store available to child components.
 *
 * @template M - Intent map type
 * @template C - Cursor map type
 * @template P - Purpose type
 *
 * @param props - Provider props
 * @param props.store - Upload store instance to provide
 * @param props.children - Child components that can access the store
 *
 * @returns {JSX.Element} Context provider wrapping children
 *
 * @example
 * ```tsx
 * <UploadProvider store={store}>
 *   <UploadDropzone purpose="avatar" />
 * </UploadProvider>
 * ```
 */
export function UploadProvider<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
>({ store, children }: { store: UploadStore<M, C, P, R>; children: ReactNode }): React.JSX.Element {
  return <UploadContext.Provider value={store}>{children}</UploadContext.Provider>
}

/**
 * Hook to access the upload store from React context when present.
 *
 * Some higher-level hooks support either an explicit store argument or context.
 * They use this helper so the context read stays unconditional without throwing
 * when a caller intentionally passes a store instance.
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

/**
 * Hook to access the upload store from React context.
 *
 * @template M - Intent map type
 * @template C - Cursor map type
 * @template P - Purpose type
 *
 * @returns {UploadStore<M, C, P>} The upload store instance
 * @throws {Error} If called outside of UploadProvider
 *
 * @example
 * ```tsx
 * const store = useUploadStore()
 * const snapshot = store.getSnapshot()
 * ```
 */
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

'use client'

import * as React from 'react'
import type {
  CursorMap,
  IntentMap,
  UploadCommand,
  UploadEventMap,
  UploadItem,
  UploadPhase,
  UploadResultBase,
} from '../core'
import type { UploadStore } from '../core/engine/store'
import { useOptionalUploadStore, useUploadStore } from './upload-provider'

export function createUploadFactory<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
>(store: UploadStore<M, C, P, R>) {
  return () => useUploader<M, C, P, R>(store)
}

export type PickItemsByPhase<Phase extends UploadPhase> = Extract<
  UploadItem<IntentMap, CursorMap<IntentMap>, string, UploadResultBase>,
  { phase: Phase }
>

type Uploader<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase> = {
  items: UploadItem<M, C, P, R>[]
  byPhase: Record<string, UploadItem<M, C, P, R>[]>
  dispatch: (cmd: UploadCommand<P>) => void
  on: <K extends keyof UploadEventMap<M, C, P, R> & string>(
    type: K,
    cb: (payload: UploadEventMap<M, C, P, R>[K]) => void,
  ) => () => void
  off: <K extends keyof UploadEventMap<M, C, P, R> & string>(
    type: K,
    cb: (payload: UploadEventMap<M, C, P, R>[K]) => void,
  ) => () => void
  uploading: UploadItem<M, C, P, R>[]
  paused: UploadItem<M, C, P, R>[]
  completed: UploadItem<M, C, P, R>[]
  failed: UploadItem<M, C, P, R>[]
  ready: UploadItem<M, C, P, R>[]
}

/**
 * Stable action surface for React consumers that need imperative store access.
 *
 * This is declared explicitly instead of relying on an inferred object return
 * type so the generated package declarations do not leak the internal generic
 * names created by `store.on.bind(store)`.
 */
export type UploaderActions<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
> = Pick<UploadStore<M, C, P, R>, 'dispatch' | 'on'> & {
  store: UploadStore<M, C, P, R>
}

export function useUploader<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
>(): Uploader<M, C, P, R>
export function useUploader<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
>(store: UploadStore<M, C, P, R>): Uploader<M, C, P, R>
export function useUploader<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
>(providedStore?: UploadStore<M, C, P, R> | undefined) {
  const contextStore = useOptionalUploadStore<M, C, P, R>()
  const store = providedStore ?? contextStore
  if (!store) {
    throw new Error('useUploader must be used within UploadProvider when no store argument is provided')
  }

  const snapshot = React.useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store),
    store.getSnapshot.bind(store),
  )

  const items = React.useMemo(() => {
    return Array.from(snapshot.items.values())
  }, [snapshot.items])

  const byPhase = React.useMemo(() => {
    const result: Record<string, UploadItem<M, C, P, R>[]> = {}
    items.forEach((item) => {
      if (!result[item.phase]) {
        result[item.phase] = []
      }
      result[item.phase].push(item)
    })
    return result
  }, [items])

  return {
    items,
    byPhase,
    dispatch: store.dispatch.bind(store),
    on: store.on.bind(store),
    off: store.off.bind(store),
    uploading: byPhase.uploading || [],
    paused: byPhase.paused || [],
    completed: byPhase.completed || [],
    failed: byPhase.error || [],
    ready: byPhase.ready || [],
  }
}

export function useUploaderActions<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
>(): UploaderActions<M, C, P, R> {
  const store = useUploadStore<M, C, P, R>()

  const dispatch = React.useMemo(() => store.dispatch.bind(store), [store])
  const on = React.useMemo(() => store.on.bind(store), [store])

  return { dispatch, on, store }
}

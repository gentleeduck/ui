import { resolveUploadConfig } from '../../client'
import type { CursorMap, IntentMap, UploadResultBase } from '../../contracts'
import { createXHRTransport } from '../../contracts/transport'
import { deserializeSnapshot, serializeSnapshot } from '../../persistence'
import { createTypedEmitter } from '../../utils/emitter'
import type { UploadCommand } from '../commands.types'
import type { UploadEventMap } from '../event-map.types'
import type { InternalEvent, UploadItem } from '../internal-events.types'
import { createReducer, type UploadState } from '../reducer'
import { cleanupOldItems } from './handlers/clean-up'
import { scheduleWork } from './store.schedule'
import type { InflightUpload, StoreOptions, StoreRuntime } from './store.types'

/**
 * Creates a new runtime instance with initial state, emitter, reducer, and effect queue.
 *
 * Notes:
 * - Reducers remain pure: all async work is enqueued through {@link StoreRuntime.enqueueEffect}.
 * - {@link StoreRuntime.applyInternal} invokes hooks, performs cleanup, and then schedules more work.
 * - {@link StoreRuntime.dispatch} is intentionally assigned later to break import cycles.
 *
 * @template M - Intent map type
 * @template C - Cursor map type
 * @template P - Purpose string union type
 *
 * @param opts - Construction options for the store.
 */
export function createStoreRuntime<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
>(opts: StoreOptions<M, C, P, R>): StoreRuntime<M, C, P, R> {
  const resolvedOpts = resolveStoreOptions(opts)
  const persistence = resolvedOpts.persistence

  // Debounced persistence flush. Persistence writes a single namespace `key`,
  // and the adapter can choose how to store multiple item records under it.
  let persistTimer: ReturnType<typeof setTimeout> | null = null
  const persistDebounceMs = Math.max(0, persistence?.debounceMs ?? 200)

  const flushPersistence = async () => {
    if (!persistence) return
    try {
      const snap = (persistence.serialize ?? serializeSnapshot)(rt.state, persistence.version)

      // If there's nothing to persist, clear the namespace to keep storage clean.
      if (!snap.items || Object.keys(snap.items).length === 0) {
        await persistence.adapter.clear(persistence.key)
        return
      }

      await persistence.adapter.save(persistence.key, snap)
    } catch (err) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.warn('[UploadEngine] persistence flush failed:', err)
      }
    }
  }

  const schedulePersistence = () => {
    if (!persistence) return
    if (persistDebounceMs === 0) {
      void flushPersistence()
      return
    }
    if (persistTimer) clearTimeout(persistTimer)
    persistTimer = setTimeout(() => void flushPersistence(), persistDebounceMs)
  }

  const initialState: UploadState<M, C, P, R> = resolvedOpts.initialState ?? {
    items: new Map<string, UploadItem<M, C, P, R>>(),
  }

  const effectQueue: Array<() => Promise<void>> = []

  const rt: StoreRuntime<M, C, P, R> = {
    opts: resolvedOpts,
    state: initialState,

    listeners: new Set<() => void>(),
    emitter: createTypedEmitter<UploadEventMap<M, C, P, R>>(),
    reduce: createReducer<M, C, P, R>(),

    inflightUploads: new Map<string, InflightUpload>(),
    inflightIntents: new Map<string, AbortController>(),
    inflightCompletes: new Map<string, AbortController>(),

    effectQueue,
    processingEffects: false,
    scheduling: false,

    notify() {
      rt.listeners.forEach((listener) => {
        listener()
      })
    },

    scheduleWork() {
      scheduleWork(rt)
    },

    applyInternal(event: InternalEvent<M, C, P, R>) {
      const prev = rt.state
      const next = rt.reduce(prev, event)
      rt.state = next
      rt.opts.hooks?.onInternalEvent?.(event, rt.state)

      emitInternalEvent(rt, event)

      const cleaned = cleanupOldItems(rt.opts, rt.state)
      if (cleaned) rt.state = cleaned

      schedulePersistence()
      rt.notify()
      rt.scheduleWork()
    },

    applyCommand(cmd: UploadCommand<P>) {
      const prev = rt.state
      const next = rt.reduce(prev, cmd)
      rt.state = next

      emitCommandEvents(rt, cmd, prev, next)

      const cleaned = cleanupOldItems(rt.opts, rt.state)
      if (cleaned) rt.state = cleaned

      schedulePersistence()
      rt.notify()
      rt.scheduleWork()
    },

    enqueueEffect(effect: () => Promise<void>) {
      rt.effectQueue.push(effect)
      if (!rt.processingEffects) void rt.processEffects()
    },

    async processEffects() {
      rt.processingEffects = true
      while (rt.effectQueue.length > 0) {
        const effect = rt.effectQueue.shift()
        if (!effect) continue
        try {
          await effect()
        } catch (err) {
          if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            const error = err instanceof Error ? err : new Error(String(err))
            const context = {
              queueLength: rt.effectQueue.length,
              processing: rt.processingEffects,
              timestamp: new Date().toISOString(),
            }
            console.error('[UploadEngine] Effect error:', error, context)
          }
        }
      }
      rt.processingEffects = false
    },

    // replaced by createUploadStore
    dispatch: () => {
      throw new Error('[UploadEngine] dispatch not initialized')
    },
  } satisfies StoreRuntime<M, C, P, R>

  // Hydrate from persistence when no initialState was provided.
  // For async adapters (IndexedDB), this happens after construction.
  if (persistence && !resolvedOpts.initialState && typeof window !== 'undefined') {
    try {
      const loaded = persistence.adapter.load(persistence.key)
      const applyLoaded = (raw: unknown | null) => {
        if (!raw) return
        const next = (persistence.deserialize ?? deserializeSnapshot)(raw, {
          isPurpose: persistence.isPurpose,
          isIntent: persistence.isIntent,
          hasStrategy: resolvedOpts.strategies.has,
        })
        if (!next) return

        // Only merge into an empty store to avoid clobbering user actions
        // that happened before the async load completed.
        if (rt.state.items.size === 0) {
          rt.state = next
        } else {
          const merged = new Map(rt.state.items)
          for (const [id, item] of next.items.entries()) {
            if (!merged.has(id)) merged.set(id, item)
          }
          rt.state = { ...rt.state, items: merged }
        }

        rt.notify()
        rt.scheduleWork()
      }

      void Promise.resolve(loaded)
        .then(applyLoaded)
        .catch(() => undefined)
    } catch {
      // ignore
    }
  }

  return rt
}

function resolveStoreOptions<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  opts: StoreOptions<M, C, P, R>,
): StoreRuntime<M, C, P, R>['opts'] {
  return {
    ...opts,
    config: resolveUploadConfig(opts.config),
    transport: opts.transport ?? createXHRTransport(),
  }
}

function emitInternalEvent<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  rt: StoreRuntime<M, C, P, R>,
  event: InternalEvent<M, C, P, R>,
) {
  switch (event.type) {
    case 'files.added': {
      for (const item of event.items) {
        rt.emitter.emit('file.added', {
          localId: item.localId,
          purpose: item.purpose,
          file: item.file,
          fingerprint: item.fingerprint,
        })
      }
      break
    }
    case 'validation.ok': {
      rt.emitter.emit('validation.ok', { localId: event.localId })
      rt.emitter.emit('intent.creating', { localId: event.localId })
      break
    }
    case 'validation.failed': {
      rt.emitter.emit('validation.failed', { localId: event.localId, reason: event.reason })
      break
    }
    case 'intent.ok': {
      rt.emitter.emit('intent.created', { localId: event.localId, intent: event.intent })
      break
    }
    case 'intent.failed': {
      rt.emitter.emit('intent.failed', { localId: event.localId, error: event.error, retryable: event.retryable })
      break
    }
    case 'upload.begin': {
      rt.emitter.emit('upload.started', { localId: event.localId })
      break
    }
    case 'upload.progress': {
      const pct = event.totalBytes > 0 ? Math.min(100, (event.uploadedBytes / event.totalBytes) * 100) : 0
      rt.emitter.emit('upload.progress', {
        localId: event.localId,
        pct,
        uploadedBytes: event.uploadedBytes,
        totalBytes: event.totalBytes,
      })
      break
    }
    case 'cursor.updated': {
      rt.emitter.emit('upload.cursor', { localId: event.localId, cursor: event.cursor })
      break
    }
    case 'upload.ok': {
      rt.emitter.emit('upload.completing', { localId: event.localId })
      break
    }
    case 'upload.failed': {
      rt.emitter.emit('upload.error', { localId: event.localId, error: event.error, retryable: event.retryable })
      break
    }
    case 'dedupe.ok': {
      rt.emitter.emit('upload.completed', {
        localId: event.localId,
        result: event.result,
        completedBy: 'dedupe',
      })
      break
    }
    case 'complete.ok': {
      rt.emitter.emit('upload.completed', {
        localId: event.localId,
        result: event.result,
        completedBy: 'upload',
      })
      break
    }
    case 'complete.failed': {
      rt.emitter.emit('upload.error', { localId: event.localId, error: event.error, retryable: event.retryable })
      break
    }
    case 'paused': {
      rt.emitter.emit('upload.paused', { localId: event.localId, cursor: event.cursor })
      break
    }
    case 'canceled': {
      rt.emitter.emit('upload.canceled', { localId: event.localId })
      break
    }
    case 'fingerprint.updated': {
      break
    }
  }
}

function emitCommandEvents<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  rt: StoreRuntime<M, C, P, R>,
  cmd: UploadCommand<P>,
  prev: UploadState<M, C, P, R>,
  next: UploadState<M, C, P, R>,
) {
  if (cmd.type === 'start' || cmd.type === 'resume') {
    const prevItem = prev.items.get(cmd.localId)
    const nextItem = next.items.get(cmd.localId)
    if (!prevItem || !nextItem) return
    if (nextItem.phase !== 'queued') return

    if (prevItem.phase === 'paused') {
      rt.emitter.emit('upload.resumed', { localId: cmd.localId })
    } else {
      rt.emitter.emit('upload.queued', { localId: cmd.localId })
    }
  }

  if (cmd.type === 'cancel') {
    const prevItem = prev.items.get(cmd.localId)
    const nextItem = next.items.get(cmd.localId)
    if (!prevItem || !nextItem) return
    if (nextItem.phase === 'canceled' && prevItem.phase !== 'canceled') {
      rt.emitter.emit('upload.canceled', { localId: cmd.localId })
    }
  }
}

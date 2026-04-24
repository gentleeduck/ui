import type { CursorMap, IntentMap, UploadResultBase } from '../../contracts'
import type { UploadItem } from '../internal-events.types'
import { createIntent } from './handlers/create-intent'
import { finalizeUpload } from './handlers/finalize'
import { runUpload } from './handlers/run-upload'
import { isAutoStart } from './store.libs'
import type { StoreRuntime } from './store.types'

/**
 * Central scheduler that ensures the system is always making progress towards a consistent state.
 * It checks for:
 * 1. Pending intent creations
 * 2. Available upload slots (concurrency limits)
 * 3. Pending completions
 *
 * This function is idempotent and safe to call multiple times.
 */
export function scheduleWork<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  rt: StoreRuntime<M, C, P, R>,
) {
  if (rt.scheduling) return
  rt.scheduling = true
  try {
    scheduleIntentCreations(rt)
    scheduleUploads(rt)
    scheduleCompletes(rt)
  } finally {
    rt.scheduling = false
  }
}

/**
 * Enqueues intent creation for items that are in the `creating_intent` phase.
 *
 * The intent creation itself runs as an async effect and is guarded by
 * {@link StoreRuntime.inflightIntents}.
 */
export function scheduleIntentCreations<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase,
>(rt: StoreRuntime<M, C, P, R>) {
  for (const item of rt.state.items.values()) {
    if (item.phase !== 'creating_intent') continue
    if (rt.inflightIntents.has(item.localId)) continue
    rt.enqueueEffect(() => createIntent(rt, item.localId))
  }
}

/**
 * Enqueues completion/finalization calls for items in the `completing` phase.
 *
 * Finalization runs as an async effect and is guarded by {@link StoreRuntime.inflightCompletes}.
 */
export function scheduleCompletes<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase,
>(rt: StoreRuntime<M, C, P, R>) {
  for (const item of rt.state.items.values()) {
    if (item.phase !== 'completing') continue
    if (rt.inflightCompletes.has(item.localId)) continue
    rt.enqueueEffect(() => finalizeUpload(rt, item.localId))
  }
}

/**
 * Manages upload concurrency and starts new uploads when slots are available.
 * Respects `maxConcurrentUploads` from config.
 */
export function scheduleUploads<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase,
>(rt: StoreRuntime<M, C, P, R>) {
  const maxConcurrent = Math.max(1, rt.opts.config.maxConcurrentUploads)
  const active = rt.inflightUploads.size

  // Auto-start items
  for (const item of rt.state.items.values()) {
    if (item.phase === 'ready' && isAutoStart(rt.opts, item.purpose)) {
      rt.applyCommand({ type: 'start', localId: item.localId })
    }
  }

  if (active >= maxConcurrent) return

  // Find queued items
  const candidates = Array.from(rt.state.items.values()).filter(isQueuedItem)
  if (candidates.length === 0) return

  const slots = Math.max(0, maxConcurrent - active)
  const toStart = candidates.slice(0, slots)

  for (const item of toStart) {
    // Guard against rare scheduling races.
    if (rt.inflightUploads.has(item.localId)) continue

    const controller = new AbortController()
    rt.inflightUploads.set(item.localId, { controller, mode: 'normal', started: false })

    rt.applyInternal({ type: 'upload.begin', localId: item.localId, startedAt: Date.now() })

    // Fire-and-forget: runUpload is responsible for updating state and cleaning inflight entries.
    void runUpload(rt, item.localId)
  }
}

function isQueuedItem<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  item: UploadItem<M, C, P, R>,
): item is Extract<UploadItem<M, C, P, R>, { phase: 'queued' }> {
  return item.phase === 'queued'
}

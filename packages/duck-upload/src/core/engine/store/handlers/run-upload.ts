import type { AnyCursor, CursorMap, IntentMap, UploadError, UploadResultBase } from '../../../contracts'
import { hasCursor, hasFile, hasIntent, normalizeError, retryDecision, sleep } from '../store.libs'
import type { StoreRuntime } from '../store.types'

export async function runUpload<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase,
>(rt: StoreRuntime<M, C, P, R>, localId: string) {
  const item = rt.state.items.get(localId)

  // If the state moved on (or we never had a valid upload), drop any inflight entry.
  if (!item || item.phase !== 'uploading' || !hasIntent(item)) {
    rt.inflightUploads.delete(localId)
    return
  }

  let inflight = rt.inflightUploads.get(localId)
  if (!inflight) {
    inflight = { controller: new AbortController(), mode: 'normal', started: false }
    rt.inflightUploads.set(localId, inflight)
  }

  if (inflight.started) return
  inflight.started = true

  const controller = inflight.controller

  const applyCanceled = () => {
    const current = rt.state.items.get(localId)
    if (!current || current.phase === 'canceled') return
    rt.applyInternal({ type: 'canceled', localId, canceledAt: Date.now() })
  }

  const applyPaused = (cursor: AnyCursor<C>) => {
    const current = rt.state.items.get(localId)
    if (!current || current.phase === 'paused') return
    rt.applyInternal({ type: 'paused', localId, cursor, pausedAt: Date.now() })
  }

  // If paused/canceled before the request begins, complete it immediately.
  if (controller.signal.aborted) {
    rt.inflightUploads.delete(localId)

    if (inflight.mode === 'pause') {
      const cur = rt.state.items.get(localId)
      let strategy: (keyof M & string) | undefined
      if (item && hasIntent(item)) {
        strategy = item.intent.strategy
      }

      const cursor =
        (cur && hasCursor(cur) ? cur.cursor : undefined) || (strategy ? { strategy, value: undefined } : undefined)

      if (cursor) applyPaused(cursor)
      return
    }

    if (inflight.mode === 'cancel') {
      applyCanceled()
      return
    }

    return
  }

  const strategyId = item.intent.strategy
  if (!rt.opts.strategies.has(strategyId)) {
    rt.inflightUploads.delete(localId)
    const error: UploadError = {
      code: 'strategy_missing',
      message: `Strategy not found: ${strategyId}`,
      strategy: String(strategyId),
      retryable: false,
    }
    rt.applyInternal({ type: 'upload.failed', localId, error, retryable: false })
    return
  }

  const strategy = rt.opts.strategies.get(strategyId)

  if (!strategy) {
    rt.inflightUploads.delete(localId)
    const error: UploadError = {
      code: 'strategy_missing',
      message: `Strategy not found: ${item.intent.strategy}`,
      strategy: String(item.intent.strategy),
      retryable: false,
    }
    rt.applyInternal({ type: 'upload.failed', localId, error, retryable: false })
    return
  }

  // Throttle progress events
  let lastEmit = 0
  const progressThrottle = rt.opts.config.progressThrottleMs

  try {
    await strategy.start({
      file: item.file,
      intent: item.intent,
      signal: controller.signal,
      transport: rt.opts.transport,
      api: rt.opts.api,

      readCursor: () => {
        const cur = rt.state.items.get(localId)
        if (!cur || !hasCursor(cur) || !cur.cursor) return undefined
        if (cur.cursor.strategy !== strategyId) return undefined
        return cur.cursor.value
      },

      persistCursor: (cursorValue) => {
        const tagged: AnyCursor<C> = { strategy: strategyId, value: cursorValue }
        rt.applyInternal({ type: 'cursor.updated', localId, cursor: tagged })
      },

      reportProgress: (p) => {
        const now = Date.now()
        if (now - lastEmit < progressThrottle) return

        rt.applyInternal({
          type: 'upload.progress',
          localId,
          uploadedBytes: p.uploadedBytes,
          totalBytes: p.totalBytes,
        })

        lastEmit = now
      },
    })

    rt.inflightUploads.delete(localId)

    if (inflight?.mode === 'cancel') {
      applyCanceled()
      return
    }
    if (controller.signal.aborted && inflight?.mode === 'pause') {
      // Paused at the end; reducer expects cursor - if not present, keep last-known or synthesize.
      const cur = rt.state.items.get(localId)
      const cursor = (cur && hasCursor(cur) ? cur.cursor : undefined) || { strategy: strategyId, value: undefined }
      applyPaused(cursor)
      return
    }

    // Normal completion -> completing
    rt.applyInternal({ type: 'upload.ok', localId })
    // finalizeUpload scheduled by scheduleWork() via completing phase
  } catch (err: unknown) {
    rt.inflightUploads.delete(localId)

    if (controller.signal.aborted) {
      if (inflight?.mode === 'pause') {
        const cur = rt.state.items.get(localId)
        const cursor = (cur && hasCursor(cur) ? cur.cursor : undefined) || { strategy: strategyId, value: undefined }
        applyPaused(cursor)
        return
      }

      if (inflight?.mode === 'cancel') {
        applyCanceled()
        return
      }

      // Unknown abort -> treat as cancel
      applyCanceled()
      return
    }

    const error = normalizeError(err, rt.opts.errorNormalizer)
    const itemForContext = rt.state.items.get(localId)
    const errorWithContext: UploadError = itemForContext
      ? {
          ...error,
          message: `${error.message} (file: ${itemForContext.fingerprint.name}, size: ${
            (hasFile(itemForContext) && itemForContext.file?.size) ?? 0
          } bytes, phase: ${itemForContext.phase})`,
        }
      : error
    const decision = retryDecision(rt.opts.config, { phase: 'upload', attempt: 1, error: errorWithContext })
    rt.applyInternal({ type: 'upload.failed', localId, error: errorWithContext, retryable: decision.retryable })

    if (decision.retryable && decision.delayMs !== undefined) {
      rt.enqueueEffect(async () => {
        await sleep(decision.delayMs)
        rt.dispatch({ type: 'retry', localId })
      })
    }
  }
}

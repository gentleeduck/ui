import type { Contracts } from '../../contracts'
import { fingerprintMatches, computeFingerprint as fp } from '../../utils/fingerprint'
import { generateId } from '../../utils/id'
import type { Engine } from '../engine.types'
import type { Reducer } from '../reducer'
import { validateFileList, validateIntent } from '../validation'
import {
  acquireSlot,
  attachSlot,
  calculateFileChecksum,
  computeFingerprint,
  getActiveCount,
  getAttempt,
  hasCursor,
  hasFile,
  hasIntent,
  isMultipartIntent,
  normalizeError,
  releaseAllSlots,
  retryDecision,
  scheduleRetry,
  withErrorContext,
} from './store.libs'
import type { Store } from './store.types'

// ============================================================================
// addFiles -- validate + queue per-file checksum + dedupe effect
// ============================================================================

/**
 * Handler for the `addFiles` command.
 *
 * Runs synchronous validation, inserts accepted items into state, then
 * enqueues an async effect per item that computes the checksum, performs
 * server dedupe, and transitions the item out of `validating`.
 *
 * @param rt Store runtime.
 * @param files Files passed to `dispatch({ type: 'addFiles' })`.
 * @param purpose Purpose key associated with the batch.
 * @template M Intent map keyed by strategy id.
 * @template C Cursor map keyed by strategy id.
 * @template P Purpose discriminator string.
 * @template R Backend result payload.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function handleAddFiles<
  M extends Contracts.IntentMap,
  C extends Contracts.CursorMap<M>,
  P extends string,
  R extends Contracts.IResultBase,
>(rt: Store.IRuntime<M, C, P, R>, files: File[], purpose: P) {
  // `maxFiles` baseline. `getActiveCount` memoizes per `state` ref so
  // calling `addFiles` N times stays O(N) instead of compounding to O(N²).
  const existingCount = getActiveCount(rt, purpose)

  const { valid, rejected } = validateFileList(files, purpose, rt.opts.config, existingCount)

  for (const { file, reason } of rejected) {
    rt.emitter.emit('file.rejected', { reason, file })
  }

  const now = Date.now()
  const toAdd: Array<{
    localId: string
    purpose: P
    file: File
    fingerprint: Contracts.IFileFingerprint
    createdAt: number
  }> = []

  for (const file of valid) {
    const localId = generateId()
    // Guard a user-supplied fingerprinter. A throw used to take down the
    // entire addFiles call and drop the remaining files; fall back to the
    // built-in fingerprint instead so one bad implementation does not
    // strand a multi-file selection.
    let fingerprint: Contracts.IFileFingerprint
    try {
      fingerprint = (rt.opts.fingerprint ?? computeFingerprint)(file)
    } catch (err) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.error('[UploadEngine] custom fingerprint threw; falling back to built-in:', err)
      }
      fingerprint = computeFingerprint(file)
    }

    toAdd.push({ localId, purpose, file, fingerprint, createdAt: now })

    // Allocate the controller sync so a cancel arriving before the effect
    // body runs can find and abort it via `pendingValidations`.
    const validationCtl = new AbortController()
    rt.pendingValidations.set(localId, validationCtl)

    rt.enqueueEffect(
      async (effectSignal) => {
        const release = attachSlot(rt.pendingValidations, localId, validationCtl, effectSignal)
        const signal = validationCtl.signal

        try {
          // Config-based rules already ran in `validateFileList` above.
          // Custom hook runs here so it can be async-aware via opts.validateFile.
          let customReason: Contracts.RejectReason | null | undefined
          try {
            customReason = rt.opts.validateFile?.(file, purpose)
          } catch (err) {
            // A throwing user predicate would otherwise strand the item in
            // `validating` (the effect's outer catch swallows). Treat it as
            // a `validation_failed` so the item moves to a terminal phase
            // and the consumer can surface the error.
            if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
              console.error('[UploadEngine] validateFile predicate threw; marking item as validation_failed:', err)
            }
            customReason = {
              code: 'type_not_allowed',
              allowed: [],
              got: file.type || file.name,
            }
          }
          if (customReason) {
            rt.applyInternal({ type: 'validation.failed', localId, reason: customReason })
            return
          }

          if (signal.aborted) return

          let checksum: string | undefined
          const checksumCap = rt.opts.config.checksumMaxSize
          const skipChecksum = checksumCap !== null && file.size > checksumCap
          if (skipChecksum) {
            // Above the configured threshold: skip the digest (and the dedupe
            // lookup downstream). Avoids buffering huge files in heap because
            // browser SHA-256 has no streaming variant.
            if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
              console.warn(
                `[UploadEngine] Skipping checksum for "${file.name}" (size ${file.size} > checksumMaxSize ${checksumCap}); dedupe is unavailable for this upload.`,
              )
            }
          } else {
            try {
              checksum = await calculateFileChecksum(file, signal, rt.opts.config.checksumChunkBytes)
              if (signal.aborted) return
              const updatedFingerprint = { ...fingerprint, checksum }
              rt.applyInternal({ type: 'fingerprint.updated', localId, fingerprint: updatedFingerprint })
            } catch (err) {
              // Checksum failure is non-fatal; continue without dedupe.
              if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
                console.warn('[UploadEngine] Failed to calculate checksum:', err)
              }
            }
          }

          if (signal.aborted) return

          if (checksum && rt.opts.api.findByChecksum) {
            try {
              const existingFile = await rt.opts.api.findByChecksum({ checksum, purpose }, { signal })
              if (signal.aborted) return
              if (existingFile) {
                const currentItem = rt.state.items.get(localId)
                if (currentItem && currentItem.phase === 'validating') {
                  rt.applyInternal({ type: 'dedupe.ok', localId, result: existingFile })
                  return
                }
              }
            } catch (err) {
              // Dedupe failure is non-fatal; fall through to normal upload.
              if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
                console.warn('[UploadEngine] Failed to check for existing file:', err)
              }
            }
          }

          if (signal.aborted) return

          rt.applyInternal({ type: 'validation.ok', localId })
        } finally {
          release()
        }
      },
      { localId },
    )
  }

  if (toAdd.length > 0) {
    rt.applyInternal({ type: 'files.added', items: toAdd })
  }
}

// ============================================================================
// pause -- abort inflight controller so runUpload routes to `paused`
// ============================================================================

/**
 * Side effect for `pause`.
 *
 * Aborts the inflight controller (if any) with `mode='pause'` so
 * `runUpload` routes the abort to `applyPaused`. Queued items are reverted
 * to `ready` by the reducer.
 *
 * @param rt Store runtime.
 * @param localId Target item key.
 * @template M Intent map keyed by strategy id.
 * @template C Cursor map keyed by strategy id.
 * @template P Purpose discriminator string.
 * @template R Backend result payload.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function handlePause<
  M extends Contracts.IntentMap,
  C extends Contracts.CursorMap<M>,
  P extends string,
  R extends Contracts.IResultBase,
>(rt: Store.IRuntime<M, C, P, R>, localId: string) {
  const inflight = rt.inflightUploads.get(localId)
  if (!inflight) return
  inflight.mode = 'pause'
  inflight.controller.abort('pause')
}

// ============================================================================
// cancel -- mark mode, queue server abort for multipart, release all slots
// ============================================================================

/**
 * Cancel an upload.
 *
 * Marks the inflight upload's `mode = 'cancel'` so `runUpload`'s catch path
 * routes to `canceled`, enqueues a best-effort server-side multipart abort,
 * then releases all per-item bookkeeping with reason `'cancel'`.
 *
 * @param rt Store runtime.
 * @param localId Target item key.
 * @template M Intent map keyed by strategy id.
 * @template C Cursor map keyed by strategy id.
 * @template P Purpose discriminator string.
 * @template R Backend result payload.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function handleCancel<
  M extends Contracts.IntentMap,
  C extends Contracts.CursorMap<M>,
  P extends string,
  R extends Contracts.IResultBase,
>(rt: Store.IRuntime<M, C, P, R>, localId: string) {
  const item = rt.state.items.get(localId)

  // Idempotent: a redundant cancel must not enqueue another server abort.
  if (item?.phase === 'canceled') return

  const inflight = rt.inflightUploads.get(localId)
  if (inflight) inflight.mode = 'cancel'

  // Skip server multipart-abort once the session is past byte transfer; the
  // backend is busy assembling and aborting would race with completion.
  if (
    item &&
    item.phase !== 'completing' &&
    item.phase !== 'completed' &&
    hasIntent(item) &&
    item.intent.strategy === 'multipart' &&
    rt.opts.api.multipart?.abort
  ) {
    const intent = item.intent
    if (isMultipartIntent(intent)) {
      rt.enqueueEffect(
        async (signal) => {
          try {
            const abort = rt.opts.api.multipart?.abort
            if (abort) await abort({ fileId: intent.fileId, uploadId: intent.uploadId }, { signal })
          } catch {
            // Server abort is opportunistic.
          }
        },
        { localId },
      )
    }
  }

  releaseAllSlots(rt, localId, 'cancel')
}

// ============================================================================
// rebind -- attach a fresh File to a persisted `paused` item
// ============================================================================

/**
 * Pre-validate a `rebind` command and emit `rebind.ok` / `rebind.failed`.
 *
 * @param rt Store runtime.
 * @param localId Target item key.
 * @param file Fresh File to bind onto the persisted `paused` item.
 * @template M Intent map keyed by strategy id.
 * @template C Cursor map keyed by strategy id.
 * @template P Purpose discriminator string.
 * @template R Backend result payload.
 * @returns True when the reducer should apply the command.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function handleRebind<
  M extends Contracts.IntentMap,
  C extends Contracts.CursorMap<M>,
  P extends string,
  R extends Contracts.IResultBase,
>(rt: Store.IRuntime<M, C, P, R>, localId: string, file: File): boolean {
  const item = rt.state.items.get(localId)

  if (!item) {
    rt.emitter.emit('rebind.failed', { localId, reason: { code: 'no_item' } })
    return false
  }

  if (item.phase !== 'paused') {
    rt.emitter.emit('rebind.failed', { localId, reason: { code: 'wrong_phase', phase: item.phase } })
    return false
  }

  if (item.file) {
    rt.emitter.emit('rebind.failed', { localId, reason: { code: 'already_bound' } })
    return false
  }

  const next = fp(file)
  if (!fingerprintMatches(next, item.fingerprint, { compareType: rt.opts.config.strictRebindType })) {
    rt.emitter.emit('rebind.failed', {
      localId,
      reason: { code: 'fingerprint_mismatch', expected: item.fingerprint, got: next },
    })
    return false
  }

  rt.emitter.emit('rebind.ok', { localId })
  return true
}

// ============================================================================
// createIntent -- call backend api.createIntent for items in creating_intent
// ============================================================================

/**
 * Call `api.createIntent` for an item in `creating_intent` and apply the result.
 *
 * Retries on retryable errors via `scheduleRetry`.
 *
 * @param rt Store runtime.
 * @param localId Target item key.
 * @param effectSignal Effect-pool watchdog signal.
 * @template M Intent map keyed by strategy id.
 * @template C Cursor map keyed by strategy id.
 * @template P Purpose discriminator string.
 * @template R Backend result payload.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export async function createIntent<
  M extends Contracts.IntentMap,
  C extends Contracts.CursorMap<M>,
  P extends string,
  R extends Contracts.IResultBase,
>(rt: Store.IRuntime<M, C, P, R>, localId: string, effectSignal?: AbortSignal) {
  const item = rt.state.items.get(localId)
  if (!item || item.phase !== 'creating_intent') return
  if (rt.inflightIntents.has(localId)) return

  const { controller, release } = acquireSlot(rt.inflightIntents, localId, effectSignal)

  try {
    const intent = await rt.opts.api.createIntent(
      {
        purpose: item.purpose,
        contentType: item.file.type || 'application/octet-stream',
        size: item.file.size,
        filename: item.file.name,
        checksum: item.fingerprint.checksum,
      },
      { signal: controller.signal },
    )

    // Item might have been canceled while intent was creating.
    const current = rt.state.items.get(localId)
    if (!current || current.phase !== 'creating_intent') return

    const intentError = validateIntent(intent, intent.strategy, item.file.size)
    if (intentError) {
      const error: Contracts.Error = {
        code: 'validation_failed',
        message: `Invalid intent from backend: ${intentError.message}`,
        cause: intentError,
        retryable: false,
      }
      rt.applyInternal({ type: 'intent.failed', localId, error, retryable: false })
      return
    }

    rt.applyInternal({ type: 'intent.ok', localId, intent: narrowIntent<M>(intent) })
  } catch (err: unknown) {
    if (controller.signal.aborted) return

    const error = normalizeError(err, rt.opts.errorNormalizer, rt.opts.config.keepRawCause)
    const errorWithContext = withErrorContext(
      error,
      rt.opts.config.errorContextInMessage,
      () => `file: ${item.fingerprint.name}, size: ${item.file.size} bytes, purpose: ${item.purpose}`,
    )

    const decision = retryDecision(rt.opts.config, { phase: 'intent', attempt: item.attempt, error: errorWithContext })

    rt.applyInternal({ type: 'intent.failed', localId, error: errorWithContext, retryable: decision.retryable })

    if (decision.retryable && decision.delayMs !== undefined) {
      scheduleRetry(rt, localId, decision.delayMs)
    }
  } finally {
    release()
  }
}

/** Cast a `validateIntent`-passed value to its typed variant. */
function narrowIntent<M extends Contracts.IntentMap>(intent: unknown): Contracts.AnyIntent<M> {
  return intent as Contracts.AnyIntent<M>
}

// ============================================================================
// runUpload -- drive an uploading item through its registered strategy
// ============================================================================

/**
 * Drive a single upload from `uploading` to a terminal phase via the registered strategy.
 *
 * Owns the per-item `inflightUploads` slot, releases it before emitting
 * terminal transitions so the scheduler can start the next queued item in
 * the same tick.
 *
 * @param rt Store runtime.
 * @param localId Target item key.
 * @template M Intent map keyed by strategy id.
 * @template C Cursor map keyed by strategy id.
 * @template P Purpose discriminator string.
 * @template R Backend result payload.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export async function runUpload<
  M extends Contracts.IntentMap,
  C extends Contracts.CursorMap<M>,
  P extends string,
  R extends Contracts.IResultBase,
>(rt: Store.IRuntime<M, C, P, R>, localId: string) {
  const item = rt.state.items.get(localId)

  if (!item || item.phase !== 'uploading' || !hasIntent(item)) {
    // Only clean an inflight that no other invocation has claimed yet.
    const stale = rt.inflightUploads.get(localId)
    if (stale && !stale.started) rt.inflightUploads.delete(localId)
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
  // Only delete the map entry if it is still the one we own.
  const releaseOwnedSlot = () => {
    if (rt.inflightUploads.get(localId) === inflight) rt.inflightUploads.delete(localId)
  }

  try {
    // Terminal-state helpers release the slot before applyInternal so the
    // scheduler sees an accurate active count when it fires synchronously.
    const applyCanceled = () => {
      const current = rt.state.items.get(localId)
      if (!current || current.phase !== 'uploading') return
      releaseOwnedSlot()
      rt.applyInternal({ type: 'canceled', localId, canceledAt: Date.now() })
    }

    const applyPaused = (cursor: Contracts.AnyCursor<C>) => {
      const current = rt.state.items.get(localId)
      if (!current || current.phase !== 'uploading') return
      releaseOwnedSlot()
      rt.applyInternal({ type: 'paused', localId, cursor, pausedAt: Date.now() })
    }

    // Aborted before strategy.start runs: route to the matching terminal state.
    if (controller.signal.aborted) {
      if (inflight.mode === 'pause') {
        const cur = rt.state.items.get(localId)
        const strategy = item.intent.strategy
        const cursor: Contracts.AnyCursor<C> = cur && hasCursor(cur) ? cur.cursor : { strategy, value: undefined }
        applyPaused(cursor)
        return
      }

      if (inflight.mode === 'cancel') {
        applyCanceled()
        return
      }

      // mode === 'normal' means something external aborted us (watchdog race,
      // consumer reaching in). Surface as a non-retryable abort error so the
      // cause is visible to telemetry rather than silently canceled.
      const error: Contracts.Error = {
        code: 'aborted',
        message: 'Upload controller aborted before strategy start',
        reason: 'unknown',
        retryable: false,
      }
      rt.applyInternal({ type: 'upload.failed', localId, error, retryable: false })
      return
    }

    const strategyId = item.intent.strategy
    const strategy = rt.opts.strategies.get(strategyId)
    if (!strategy) {
      const error: Contracts.Error = {
        code: 'strategy_missing',
        message: `Strategy not found: ${strategyId}`,
        strategy: String(strategyId),
        retryable: false,
      }
      rt.applyInternal({ type: 'upload.failed', localId, error, retryable: false })
      return
    }

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
          if (!cur || !hasCursor(cur)) return undefined
          if (cur.cursor.strategy !== strategyId) return undefined
          return cur.cursor.value
        },

        persistCursor: (cursorValue) => {
          // Bug guard: a strategy holds the `persistCursor` reference across
          // its own async boundaries. Calling it post-abort used to flip
          // `cursor.updated` through the reducer on an item the engine had
          // already moved out of `uploading`. Reject after the abort so
          // late writes are dropped at the source.
          if (controller.signal.aborted) return
          const tagged: Contracts.AnyCursor<C> = { strategy: strategyId, value: cursorValue }
          rt.applyInternal({ type: 'cursor.updated', localId, cursor: tagged })
        },

        reportProgress: (p) => {
          const now = Date.now()
          // Always emit the terminal tick (100%); UIs jump from e.g. 87% to
          // 'completing' if the throttle eats the final progress event.
          const isFinal = p.totalBytes > 0 && p.uploadedBytes >= p.totalBytes
          // Throttle state lives on `rt.progressThrottle` keyed by localId so
          // it survives pause -> resume reschedules; without the carry-over,
          // a rapid resume window would skip the throttle and re-emit on
          // every tick.
          const last = rt.progressThrottle.get(localId) ?? 0
          if (!isFinal && now - last < progressThrottle) return
          rt.applyInternal({
            type: 'upload.progress',
            localId,
            uploadedBytes: p.uploadedBytes,
            totalBytes: p.totalBytes,
          })
          rt.progressThrottle.set(localId, now)
        },
      })

      // Strategy returned: bytes are on the server. Honor a pending pause
      // only if the strategy persisted a cursor; otherwise treat as
      // completion so a cancel/pause in the final tick does not discard
      // backed-up work.
      const ok = sampleAbortContext(rt, localId, controller, inflight)
      if (ok.aborted && ok.mode === 'pause' && ok.cursor) {
        applyPaused(ok.cursor)
        return
      }

      rt.applyInternal({ type: 'upload.ok', localId })
    } catch (err: unknown) {
      const errCtx = sampleAbortContext(rt, localId, controller, inflight)

      if (errCtx.aborted) {
        if (errCtx.mode === 'pause' && errCtx.cursor) {
          applyPaused(errCtx.cursor)
          return
        }
        // pause-without-cursor, cancel, or normal abort: terminal cancel.
        applyCanceled()
        return
      }

      const error = normalizeError(err, rt.opts.errorNormalizer, rt.opts.config.keepRawCause)
      const itemForContext = rt.state.items.get(localId)
      const errorWithContext = itemForContext
        ? withErrorContext(error, rt.opts.config.errorContextInMessage, () => {
            const fileSize = hasFile(itemForContext) ? itemForContext.file.size : 0
            return `file: ${itemForContext.fingerprint.name}, size: ${fileSize} bytes, phase: ${itemForContext.phase}`
          })
        : error
      const decision = retryDecision(rt.opts.config, {
        phase: 'upload',
        attempt: getAttempt(itemForContext),
        error: errorWithContext,
      })
      rt.applyInternal({ type: 'upload.failed', localId, error: errorWithContext, retryable: decision.retryable })

      if (decision.retryable && decision.delayMs !== undefined) {
        scheduleRetry(rt, localId, decision.delayMs)
      }
    }
  } finally {
    releaseOwnedSlot()
  }
}

/**
 * Synchronously sample the abort context as a single tuple. Done in one
 * block so a `cursor.updated` event landing between reads cannot flip a
 * pause-without-cursor into a pause-with-stale-cursor or vice versa.
 */
function sampleAbortContext<
  M extends Contracts.IntentMap,
  C extends Contracts.CursorMap<M>,
  P extends string,
  R extends Contracts.IResultBase,
>(
  rt: Store.IRuntime<M, C, P, R>,
  localId: string,
  controller: AbortController,
  inflight: { mode: Store.InflightMode } | undefined,
): { aborted: boolean; mode: Store.InflightMode | undefined; cursor: Contracts.AnyCursor<C> | undefined } {
  const aborted = controller.signal.aborted
  const mode = inflight?.mode
  if (!aborted) return { aborted: false, mode, cursor: undefined }
  const item = rt.state.items.get(localId)
  const cursor = item && hasCursor(item) ? item.cursor : undefined
  return { aborted: true, mode, cursor }
}

// ============================================================================
// finalizeUpload -- commit a completing item via api.complete
// ============================================================================

/**
 * Call `api.complete` to commit a finished upload.
 *
 * Strategy-specific commit logic (multipart completeMultipart, tus HEAD,
 * etc.) belongs in the strategy.
 *
 * @param rt Store runtime.
 * @param localId Target item key.
 * @param effectSignal Effect-pool watchdog signal.
 * @template M Intent map keyed by strategy id.
 * @template C Cursor map keyed by strategy id.
 * @template P Purpose discriminator string.
 * @template R Backend result payload.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export async function finalizeUpload<
  M extends Contracts.IntentMap,
  C extends Contracts.CursorMap<M>,
  P extends string,
  R extends Contracts.IResultBase,
>(rt: Store.IRuntime<M, C, P, R>, localId: string, effectSignal?: AbortSignal) {
  const item = rt.state.items.get(localId)
  if (!item || item.phase !== 'completing') return
  if (rt.inflightCompletes.has(localId)) return

  const { controller, release } = acquireSlot(rt.inflightCompletes, localId, effectSignal)

  try {
    const result = await rt.opts.api.complete({ fileId: item.intent.fileId }, { signal: controller.signal })

    const current = rt.state.items.get(localId)
    if (!current || current.phase !== 'completing') return

    rt.applyInternal({ type: 'complete.ok', localId, result })
  } catch (err: unknown) {
    if (controller.signal.aborted) return

    const error = normalizeError(err, rt.opts.errorNormalizer, rt.opts.config.keepRawCause)

    const itemForContext = rt.state.items.get(localId)
    const errorWithContext = itemForContext
      ? withErrorContext(error, rt.opts.config.errorContextInMessage, () => {
          const fileId = hasIntent(itemForContext) ? itemForContext.intent.fileId : 'unknown'
          return `file: ${itemForContext.fingerprint.name}, fileId: ${fileId}`
        })
      : error

    const decision = retryDecision(rt.opts.config, {
      phase: 'complete',
      attempt: getAttempt(itemForContext),
      error: errorWithContext,
    })

    rt.applyInternal({ type: 'complete.failed', localId, error: errorWithContext, retryable: decision.retryable })

    if (decision.retryable && decision.delayMs !== undefined) {
      scheduleRetry(rt, localId, decision.delayMs)
    }
  } finally {
    release()
  }
}

// ============================================================================
// cleanupOldItems -- evict terminal items based on TTL + maxItems caps
// ============================================================================

/**
 * Evict terminal items based on `completedItemTTL` and `maxItems`.
 *
 * Returns a new state when items were removed, otherwise `null`. Runs on
 * every dispatch and short-circuits when no caps apply. Terminal phases
 * that age out: `completed`, `canceled`, and `error` with
 * `retryable === false`. Retryable errors are kept so a user-driven retry
 * still has the item to act on; non-retryable errors are final, like a
 * canceled item.
 *
 * @param rt Store runtime (used for memoization and config).
 * @param state Current reducer state to scan.
 * @template M Intent map keyed by strategy id.
 * @template C Cursor map keyed by strategy id.
 * @template P Purpose discriminator string.
 * @template R Backend result payload.
 * @returns New state when items were evicted, or `null` when unchanged.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function cleanupOldItems<
  M extends Contracts.IntentMap,
  C extends Contracts.CursorMap<M>,
  P extends string,
  R extends Contracts.IResultBase,
>(rt: Store.IRuntime<M, C, P, R>, state: Reducer.IState<M, C, P, R>): Reducer.IState<M, C, P, R> | null {
  const maxItems = rt.opts.config?.maxItems
  const completedTTL = rt.opts.config?.completedItemTTL

  const noTTL = completedTTL === undefined
  const noMax = maxItems === undefined || maxItems === null
  if (noTTL && noMax) return null
  if (noTTL && !noMax && state.items.size <= (maxItems as number)) return null

  const now = Date.now()
  // Short-circuit when nothing has changed since the last cleanup AND no
  // eligible terminal item has aged past its TTL. The TTL deadline is the
  // earliest `terminalTs + completedTTL` across all terminal items; the
  // walk is skipped until wall-clock reaches it.
  if (rt.cleanupCheckedState === state && now < rt.cleanupNextDeadline) return null

  const toRemove: string[] = []
  // Direct Map iteration: avoids Array.from allocation when the path
  // short-circuits in the TTL-only branch (the common case).
  let nextDeadline = Number.POSITIVE_INFINITY

  if (completedTTL !== undefined) {
    for (const [localId, item] of state.items) {
      const ts = terminalTimestamp(item)
      if (ts === null) continue
      const ageDeadline = ts + completedTTL
      if (now > ageDeadline) toRemove.push(localId)
      else if (ageDeadline < nextDeadline) nextDeadline = ageDeadline
    }
  }

  const removed = new Set(toRemove)
  if (!noMax && state.items.size - removed.size > (maxItems as number)) {
    // Allocate only on the over-cap branch.
    const remaining: Array<[string, Engine.Item<M, C, P, R>, number]> = []
    for (const [id, item] of state.items) {
      if (removed.has(id)) continue
      const ts = terminalTimestamp(item)
      if (ts !== null) remaining.push([id, item, ts])
    }
    remaining.sort((a, b) => a[2] - b[2])
    const overCap = state.items.size - removed.size - (maxItems as number)
    for (let i = 0; i < overCap && i < remaining.length; i++) toRemove.push(remaining[i][0])
  }

  if (toRemove.length === 0) {
    rt.cleanupCheckedState = state
    rt.cleanupNextDeadline = nextDeadline
    return null
  }

  const nextItems = new Map(state.items)
  for (const localId of toRemove) nextItems.delete(localId)
  // Cleanup mutated state -- invalidate the memo; next pass walks from the
  // fresh state ref.
  rt.cleanupCheckedState = null
  rt.cleanupNextDeadline = Number.POSITIVE_INFINITY

  return { ...state, items: nextItems }
}

/**
 * Return the relevant terminal timestamp for an item, or `null` if the item
 * is not eligible for eviction (active or retryable error).
 */
function terminalTimestamp<
  M extends Contracts.IntentMap,
  C extends Contracts.CursorMap<M>,
  P extends string,
  R extends Contracts.IResultBase,
>(item: Engine.Item<M, C, P, R>): number | null {
  if (item.phase === 'completed' && typeof item.completedAt === 'number') return item.completedAt
  if (item.phase === 'canceled' && typeof item.canceledAt === 'number') return item.canceledAt
  if (item.phase === 'error' && item.retryable === false && typeof item.failedAt === 'number') return item.failedAt
  return null
}

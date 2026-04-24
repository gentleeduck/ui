import type { CursorMap, IntentMap, UploadResultBase } from '../contracts'
import { computeFingerprint, fingerprintMatches } from '../utils/fingerprint'
import type { UploadCommand } from './commands.types'
import type { InternalEvent, UploadItem } from './internal-events.types'
import type { UploadProgress } from './progress.types'

export type UploadState<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
> = {
  /** Map of uploads by localId for O(1) lookups */
  items: Map<string, UploadItem<M, C, P, R>>
}

export function createReducer<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
>() {
  return function reduce(
    state: UploadState<M, C, P, R>,
    event: UploadCommand<P> | InternalEvent<M, C, P, R>,
  ): UploadState<M, C, P, R> {
    const items = new Map(state.items)

    const set = (localId: string, next: UploadItem<M, C, P, R>) => items.set(localId, next)

    const now = Date.now()

    // Type guard: Commands don't have dots in their type, internal events do (e.g., 'intent.ok')
    const isCommand = (e: UploadCommand<P> | InternalEvent<M, C, P, R>): e is UploadCommand<P> => {
      return 'type' in e && typeof e.type === 'string' && !e.type.includes('.')
    }

    // Command handling
    if (isCommand(event)) {
      switch (event.type) {
        case 'addFiles': {
          // handled in store (creates items + emits events)
          break
        }

        case 'start': {
          const item = items.get(event.localId)
          if (!item) break
          if (item.phase !== 'ready') break

          set(event.localId, {
            ...item,
            phase: 'queued',
            requestedAt: now,
          })
          break
        }

        case 'resume': {
          const item = items.get(event.localId)
          if (!item) break
          if (item.phase !== 'paused') break
          if (!item.file) break

          set(event.localId, {
            ...item,
            file: item.file,
            phase: 'queued',
            requestedAt: now,
          })
          break
        }

        case 'pause': {
          const item = items.get(event.localId)
          if (!item) break

          // If it's queued but not started, revert back to ready.
          if (item.phase === 'queued') {
            set(event.localId, {
              ...item,
              phase: 'ready',
            })
          }

          // If it's uploading, store will abort and an internal 'paused' event will move it.
          break
        }

        case 'cancel': {
          const item = items.get(event.localId)
          if (!item) break
          if (item.phase === 'completed' || item.phase === 'canceled') break

          set(event.localId, toCanceled(item, now))
          break
        }

        case 'retry': {
          const item = items.get(event.localId)
          if (!item) break
          if (item.phase !== 'error' || !item.retryable) break
          if (!item.file) break

          if (item.intent) {
            // If we have progress and intent, we were in completing phase - retry completing
            if (item.progress && item.progress.pct === 100) {
              set(event.localId, {
                ...item,
                progress: item.progress,
                intent: item.intent,
                file: item.file,
                phase: 'completing',
                completingAt: now,
              })
            } else {
              // Otherwise, retry from ready phase
              set(event.localId, {
                ...item,
                file: item.file,
                intent: item.intent,
                phase: 'ready',
              })
            }
          } else {
            // For intent creation failures, increment attempt on retry
            set(event.localId, {
              ...item,
              phase: 'creating_intent',
              file: item.file,
              attempt: (item.attempt ?? 1) + 1,
            })
          }
          break
        }

        case 'rebind': {
          const item = items.get(event.localId)
          if (!item) break

          if (item.phase === 'paused' && !item.file) {
            const fp = computeFingerprint(event.file)
            if (fingerprintMatches(fp, item.fingerprint)) {
              set(event.localId, { ...item, file: event.file })
            }
          }
          break
        }

        case 'remove': {
          items.delete(event.localId)
          break
        }

        case 'startAll':
        case 'pauseAll':
        case 'cancelAll': {
          // handled in store
          break
        }
      }

      return { items }
    }

    // Internal event handling
    switch (event.type) {
      case 'files.added': {
        const ev = event
        for (const item of ev.items) {
          if (!items.has(item.localId)) {
            set(item.localId, {
              phase: 'validating',
              localId: item.localId,
              purpose: item.purpose,
              file: item.file,
              fingerprint: item.fingerprint,
              createdAt: item.createdAt,
            })
          }
        }
        break
      }

      case 'fingerprint.updated': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item) break

        set(ev.localId, { ...item, fingerprint: ev.fingerprint })
        break
      }

      case 'validation.ok': {
        const item = items.get(event.localId)
        if (!item || item.phase !== 'validating') break

        set(event.localId, {
          ...item,
          phase: 'creating_intent',
          attempt: 1,
        })
        break
      }

      case 'validation.failed': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item || item.phase !== 'validating') break

        set(ev.localId, {
          ...item,
          phase: 'error',
          error: { code: 'validation_failed', reason: ev.reason, message: String(ev.reason) },
          retryable: false,
          attempt: 1,
          failedAt: now,
        })
        break
      }

      case 'intent.ok': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item || item.phase !== 'creating_intent') break

        set(ev.localId, {
          ...item,
          phase: 'ready',
          intent: ev.intent,
        })
        break
      }

      case 'intent.failed': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item || item.phase !== 'creating_intent') break

        set(ev.localId, {
          ...item,
          phase: 'error',
          error: ev.error,
          retryable: ev.retryable,
          failedAt: now,
        })
        break
      }

      case 'upload.begin': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item || item.phase !== 'queued') break

        const total = item.file.size
        const carried: UploadProgress | undefined = item.progress

        const progress: UploadProgress = carried
          ? { ...carried, totalBytes: total, pct: pct(carried.uploadedBytes, total) }
          : { uploadedBytes: 0, totalBytes: total, pct: 0 }

        set(ev.localId, {
          ...item,
          phase: 'uploading',
          progress,
          startedAt: ev.startedAt,
        })
        break
      }

      case 'upload.progress': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item || item.phase !== 'uploading') break

        const progress: UploadProgress = {
          uploadedBytes: ev.uploadedBytes,
          totalBytes: ev.totalBytes,
          pct: pct(ev.uploadedBytes, ev.totalBytes),
        }

        set(ev.localId, { ...item, progress })
        break
      }

      case 'cursor.updated': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item) break

        if (item.phase === 'uploading') {
          set(ev.localId, { ...item, cursor: ev.cursor })
        } else if (item.phase === 'queued') {
          set(ev.localId, { ...item, cursor: ev.cursor })
        } else if (item.phase === 'paused') {
          set(ev.localId, { ...item, cursor: ev.cursor })
        }
        break
      }

      case 'upload.ok': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item || item.phase !== 'uploading') break

        set(ev.localId, {
          ...item,
          phase: 'completing',
          progress: { uploadedBytes: item.file.size, totalBytes: item.file.size, pct: 100 },
          completingAt: now,
        })
        break
      }

      case 'upload.failed': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item || item.phase !== 'uploading') break

        set(ev.localId, {
          ...item,
          phase: 'error',
          error: ev.error,
          retryable: ev.retryable,
          attempt: 1,
          failedAt: now,
        })
        break
      }

      case 'paused': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item || item.phase !== 'uploading') break

        set(ev.localId, {
          ...item,
          phase: 'paused',
          cursor: ev.cursor,
          pausedAt: ev.pausedAt,
        })
        break
      }

      case 'canceled': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item) break

        set(ev.localId, toCanceled(item, ev.canceledAt))
        break
      }

      case 'complete.ok': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item || item.phase !== 'completing') break

        set(ev.localId, {
          ...item,
          phase: 'completed',
          completedBy: 'upload',
          result: ev.result,
          completedAt: now,
        })
        break
      }

      case 'dedupe.ok': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item || item.phase !== 'validating') break

        set(ev.localId, {
          phase: 'completed',
          localId: item.localId,
          file: item.file,
          purpose: item.purpose,
          fingerprint: item.fingerprint,
          result: ev.result,
          completedBy: 'dedupe',
          completedAt: now,
          createdAt: item.createdAt,
        })
        break
      }

      case 'complete.failed': {
        const ev = event
        const item = items.get(ev.localId)
        if (!item || item.phase !== 'completing') break

        // Increment attempt number for retry tracking
        const nextAttempt = (item.attempt ?? 1) + 1

        set(ev.localId, {
          ...item,
          phase: 'error',
          error: ev.error,
          retryable: ev.retryable,
          attempt: nextAttempt,
          failedAt: now,
        })
        break
      }
    }

    return { items }
  }
}

// Helpers
function toCanceled<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  item: UploadItem<M, C, P, R>,
  canceledAt: number,
): UploadItem<M, C, P, R> {
  return {
    phase: 'canceled',
    localId: item.localId,
    purpose: item.purpose,
    fingerprint: item.fingerprint,
    canceledAt,
    createdAt: item.createdAt,
    file: 'file' in item ? item.file : undefined,
    intent: 'intent' in item ? item.intent : undefined,
    cursor: 'cursor' in item ? item.cursor : undefined,
    progress: 'progress' in item ? item.progress : undefined,
    attempt: 'attempt' in item ? item.attempt : undefined,
  }
}

function pct(uploaded: number, total: number) {
  if (total <= 0) return 0
  return Math.min(100, (uploaded / total) * 100)
}

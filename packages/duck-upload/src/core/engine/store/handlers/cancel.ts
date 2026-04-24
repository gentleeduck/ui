import type { CursorMap, IntentMap, UploadResultBase } from '../../../contracts'
import { hasIntent, isMultipartIntent } from '../store.libs'
import type { StoreRuntime } from '../store.types'

/**
 * Cancels a single upload item and aborts related inflight operations.
 *
 * This function is intentionally best-effort: abort calls can throw or be unsupported,
 * and server-side multipart abort is attempted only when the adapter provides it.
 */
export function handleCancel<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  rt: StoreRuntime<M, C, P, R>,
  localId: string,
) {
  const item = rt.state.items.get(localId)

  // Abort inflight intent
  const intentCtl = rt.inflightIntents.get(localId)
  if (intentCtl) {
    intentCtl.abort({ reason: 'cancel' })
    rt.inflightIntents.delete(localId)
  }

  // Abort inflight complete
  const completeCtl = rt.inflightCompletes.get(localId)
  if (completeCtl) {
    completeCtl.abort({ reason: 'cancel' })
    rt.inflightCompletes.delete(localId)
  }

  // Abort inflight upload
  const inflight = rt.inflightUploads.get(localId)
  if (inflight) {
    inflight.mode = 'cancel'
    inflight.controller.abort({ reason: 'cancel' })
  }

  // Best-effort server abort for multipart uploads
  if (item && hasIntent(item) && item.intent.strategy === 'multipart' && rt.opts.api.multipart?.abort) {
    const intent = item.intent
    if (isMultipartIntent(intent)) {
      rt.enqueueEffect(async () => {
        try {
          const abort = rt.opts.api.multipart?.abort
          if (abort) {
            await abort({ fileId: intent.fileId, uploadId: intent.uploadId })
          }
        } catch {
          // ignore
        }
      })
    }
  }

  // If not inflight, reducer will mark canceled.
}

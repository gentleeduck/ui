import type { CursorMap, IntentMap, UploadResultBase } from '../../../contracts'
import type { StoreRuntime } from '../store.types'

export function handlePause<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  rt: StoreRuntime<M, C, P, R>,
  localId: string,
) {
  const inflight = rt.inflightUploads.get(localId)
  if (inflight) {
    inflight.mode = 'pause'
    inflight.controller.abort({ reason: 'pause' })
    return
  }

  // If not inflight but queued, reducer already reverts it to ready.
}

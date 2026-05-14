import type { CursorMap, FileFingerprint, IntentMap, UploadResultBase } from '../../../contracts'
import { generateId } from '../../../utils/id'
import { validateFile, validateFileList } from '../../validation'
import { calculateFileChecksum, computeFingerprint } from '../store.libs'
import type { StoreRuntime } from '../store.types'

/**
 * Sync: validate + insert. Async (queued): checksum, dedupe lookup,
 * and the final validation transition.
 */
export function handleAddFiles<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase,
>(rt: StoreRuntime<M, C, P, R>, files: File[], purpose: P) {
  const existingCount = Array.from(rt.state.items.values()).filter(
    (item) => item.purpose === purpose && item.phase !== 'canceled',
  ).length

  const { valid, rejected } = validateFileList(files, purpose, rt.opts.config, existingCount)

  for (const { file, reason } of rejected) {
    rt.emitter.emit('file.rejected', { reason, file })
  }

  const now = Date.now()
  const toAdd: Array<{ localId: string; purpose: P; file: File; fingerprint: FileFingerprint; createdAt: number }> = []

  for (const file of valid) {
    const localId = generateId()
    const fingerprint = (rt.opts.fingerprint ?? computeFingerprint)(file)

    toAdd.push({ localId, purpose, file, fingerprint, createdAt: now })

    rt.enqueueEffect(async () => {
      let checksum: string | undefined
      try {
        checksum = await calculateFileChecksum(file)
        const updatedFingerprint = { ...fingerprint, checksum }
        rt.applyInternal({ type: 'fingerprint.updated', localId, fingerprint: updatedFingerprint })
      } catch (err) {
        // Checksum failure is non-fatal — continue without dedupe.
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.warn('[UploadEngine] Failed to calculate checksum:', err)
        }
      }

      // Dedupe: skip upload entirely when the backend already has the file.
      if (checksum && rt.opts.api.findByChecksum) {
        try {
          const existingFile = await rt.opts.api.findByChecksum({ checksum, purpose })
          if (existingFile) {
            const currentItem = rt.state.items.get(localId)
            if (currentItem && currentItem.phase === 'validating') {
              rt.applyInternal({ type: 'dedupe.ok', localId, result: existingFile })
              return
            }
          }
        } catch (err) {
          // Dedupe failure is non-fatal — fall through to normal upload.
          if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            console.warn('[UploadEngine] Failed to check for existing file:', err)
          }
        }
      }

      const reason = rt.opts.validateFile?.(file, purpose)
      if (reason) {
        rt.applyInternal({ type: 'validation.failed', localId, reason })
        return
      }

      // Re-run config validation per-file in case the caller skipped validateFileList.
      const cfgReason = validateFile(file, purpose, rt.opts.config)
      if (cfgReason) {
        rt.applyInternal({ type: 'validation.failed', localId, reason: cfgReason })
        return
      }

      rt.applyInternal({ type: 'validation.ok', localId })
    })
  }

  if (toAdd.length > 0) {
    rt.applyInternal({ type: 'files.added', items: toAdd })
  }
}

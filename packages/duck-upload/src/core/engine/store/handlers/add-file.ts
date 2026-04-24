import type { CursorMap, FileFingerprint, IntentMap, UploadResultBase } from '../../../contracts'
import { generateId } from '../../../utils/id'
import { validateFile, validateFileList } from '../../validation'
import { calculateFileChecksum, computeFingerprint } from '../store.libs'
import type { StoreRuntime } from '../store.types'

/**
 * Handles the `addFiles` command.
 *
 * This function performs fast synchronous work immediately (validation + state insertion)
 * and then schedules additional async work through the runtime effect queue
 * (checksum computation, de-dupe checks, and final validation transitions).
 *
 * @template M - Intent map type
 * @template C - Cursor map type
 * @template P - Purpose string union type
 *
 * @param rt - Store runtime
 * @param files - Files selected by the user
 * @param purpose - Upload purpose used for validation/routing
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
      // Calculate checksum for deduplication
      let checksum: string | undefined
      try {
        checksum = await calculateFileChecksum(file)
        // Update fingerprint with checksum
        const updatedFingerprint = { ...fingerprint, checksum }
        rt.applyInternal({ type: 'fingerprint.updated', localId, fingerprint: updatedFingerprint })
      } catch (err) {
        // If checksum calculation fails, continue without checksum
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.warn('[UploadEngine] Failed to calculate checksum:', err)
        }
      }

      // Check for existing file by checksum if available
      if (checksum && rt.opts.api.findByChecksum) {
        try {
          const existingFile = await rt.opts.api.findByChecksum({ checksum, purpose })
          if (existingFile) {
            // File already exists, skip upload and mark as completed
            const currentItem = rt.state.items.get(localId)
            if (currentItem && currentItem.phase === 'validating') {
              rt.applyInternal({ type: 'dedupe.ok', localId, result: existingFile })
              return
            }
          }
        } catch (err) {
          // If findByChecksum fails, continue with normal upload flow
          if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            console.warn('[UploadEngine] Failed to check for existing file:', err)
          }
        }
      }

      // Allow extra sync validation hook
      const reason = rt.opts.validateFile?.(file, purpose)
      if (reason) {
        rt.applyInternal({ type: 'validation.failed', localId, reason })
        return
      }

      // Still run config validation per-file (covers case where caller skipped validateFileList)
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

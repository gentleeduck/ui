import type { AnyCursor, AnyIntent, CursorMap, IntentMap, UploadResultBase } from '../contracts'
import type { UploadItem } from '../engine/internal-events.types'
import type { UploadState } from '../engine/reducer'
import { hasCursor, hasIntent } from '../engine/store/store.libs'
import { isRecord } from '../utils/guards'
import type { PersistedSnapshot, PersistedUploadItem } from './persistence.types'

/**
 * Serializes the current upload state into a JSON-safe structure.
 * Only serializes items that have a valid 'intent', as these are the only ones
 * that can be resumed cleanly.
 */
export function serializeSnapshot<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase,
>(state: UploadState<M, C, P, R>, version: number): PersistedSnapshot<M, C, P> {
  const items: Record<string, PersistedUploadItem<M, C, P>> = {}

  for (const item of state.items.values()) {
    if (!hasIntent(item)) continue

    // Do not persist terminal items. Persistence is for resuming and recovery, not history.
    if (
      (item.phase as string) === 'completed' ||
      (item.phase as string) === 'canceled' ||
      (item.phase as string) === 'error'
    )
      continue

    const cursor = hasCursor(item) ? item.cursor : undefined

    const progress =
      'progress' in item && item.progress
        ? {
            uploadedBytes: item.progress.uploadedBytes,
            totalBytes: item.progress.totalBytes,
            pct: item.progress.pct,
          }
        : undefined

    const persisted: PersistedUploadItem<M, C, P> = {
      id: item.localId,
      purpose: item.purpose,
      status: item.phase,
      file: {
        name: item.fingerprint.name,
        size: item.fingerprint.size,
        type: item.fingerprint.type,
        lastModified: item.fingerprint.lastModified,
        checksum: item.fingerprint.checksum,
      },
      intent: item.intent,
      cursor,
      progress,
    }

    items[persisted.id] = persisted
  }

  return { version, createdAt: Date.now(), items }
}

/**
 * Deserializes a persisted snapshot back into a store state.
 *
 * Important:
 * - Browser `File` objects cannot be restored from persistence.
 * - We restore resumable items (those with a cursor) into the `paused` phase,
 *   with `file` left undefined. Your UI can ask the user to rebind the file.
 */
export function deserializeSnapshot<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase,
>(
  raw: unknown,
  opts: {
    isPurpose?: (value: string) => value is P
    isIntent?: (value: unknown) => value is M[keyof M]
    hasStrategy: (value: string) => boolean
  },
): UploadState<M, C, P, R> | null {
  if (!opts.isPurpose || !opts.isIntent) return null
  if (!isPersistedSnapshot(raw)) return null

  const items = new Map<string, UploadItem<M, C, P, R>>()

  for (const value of Object.values(raw.items)) {
    const parsed = parsePersistedItem(value)
    if (!parsed) continue

    if (!opts.isPurpose(parsed.purpose)) continue
    if (!opts.isIntent(parsed.intent)) continue

    const strategy = parsed.intent.strategy
    if (typeof strategy !== 'string' || !opts.hasStrategy(strategy)) continue

    if (!parsed.cursor || !isCursorForRegistry<C>(parsed.cursor, opts.hasStrategy)) continue
    if (parsed.cursor.strategy !== strategy) continue

    const totalBytes = parsed.progress?.totalBytes ?? parsed.file.size
    const uploadedBytes = parsed.progress?.uploadedBytes ?? 0
    const pct =
      typeof parsed.progress?.pct === 'number'
        ? parsed.progress.pct
        : totalBytes > 0
          ? Math.min(100, Math.max(0, (uploadedBytes / totalBytes) * 100))
          : 0

    items.set(parsed.id, {
      phase: 'paused',
      localId: parsed.id,
      purpose: parsed.purpose,
      fingerprint: {
        name: parsed.file.name,
        size: parsed.file.size,
        type: parsed.file.type,
        lastModified: parsed.file.lastModified,
        checksum: parsed.file.checksum,
      },
      intent: parsed.intent as AnyIntent<M>,
      cursor: parsed.cursor,
      progress: { uploadedBytes, totalBytes, pct },
      pausedAt: Date.now(),
      createdAt: raw.createdAt ?? Date.now(),
      file: undefined,
    } as UploadItem<M, C, P, R>)
  }

  return { items }
}

function isPersistedSnapshot(value: unknown): value is PersistedSnapshot<unknown, unknown, string> {
  if (!isRecord(value)) return false
  if (typeof value.version !== 'number') return false
  if (typeof value.createdAt !== 'number') return false
  return isRecord(value.items)
}

function parsePersistedItem(value: unknown): {
  id: string
  purpose: string
  status: string
  file: { name: string; size: number; type: string; lastModified: number; checksum?: string }
  intent: unknown
  cursor?: unknown
  progress?: { uploadedBytes: number; totalBytes: number; pct?: number }
} | null {
  if (!isRecord(value)) return null

  const id = typeof value.id === 'string' ? value.id : null
  const purpose = typeof value.purpose === 'string' ? value.purpose : null
  const status = typeof value.status === 'string' ? value.status : null
  const intent = value.intent

  if (!id || !purpose || !status) return null

  if (!isRecord(value.file)) return null

  const name = typeof value.file.name === 'string' ? value.file.name : null
  const size = typeof value.file.size === 'number' ? value.file.size : null
  const type = typeof value.file.type === 'string' ? value.file.type : null
  const lastModified = typeof value.file.lastModified === 'number' ? value.file.lastModified : null
  const checksum = typeof value.file.checksum === 'string' ? value.file.checksum : undefined

  if (!name || size === null || !type || lastModified === null) return null

  const progress = parseProgress(value.progress)

  return {
    id,
    purpose,
    status,
    file: { name, size, type, lastModified, checksum },
    intent,
    cursor: value.cursor,
    progress,
  }
}

function parseProgress(value: unknown): { uploadedBytes: number; totalBytes: number; pct?: number } | undefined {
  if (!isRecord(value)) return undefined
  if (typeof value.uploadedBytes !== 'number' || typeof value.totalBytes !== 'number') return undefined
  const pct = typeof value.pct === 'number' ? value.pct : undefined
  return { uploadedBytes: value.uploadedBytes, totalBytes: value.totalBytes, pct }
}

function isCursorForRegistry<C extends Record<string, unknown>>(
  value: unknown,
  hasStrategy: (value: string) => boolean,
): value is AnyCursor<C> {
  if (!isRecord(value)) return false
  if (typeof value.strategy !== 'string') return false
  if (!hasStrategy(value.strategy)) return false
  return true
}

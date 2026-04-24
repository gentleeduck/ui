/**
 * A minimal, serializable representation of an upload item that is safe to store
 * in persistence (LocalStorage, IndexedDB, etc).
 *
 * This type is intentionally not the full {@link UploadItem} state.
 * It captures only the fields needed to:
 * - restore the UI list after refresh
 * - rebind an upload to its backend intent (if already created)
 * - resume an upload strategy from a known cursor (when supported)
 * - restore last-known progress and phase for UX continuity
 *
 * @typeParam M - Map of upload intent variants keyed by intent kind (e.g. `direct`, `multipart`).
 * @typeParam C - Map of cursor shapes keyed by {@link M}'s intent kinds.
 * @typeParam P - Union of allowed `purpose` strings for your app (e.g. `"avatar" | "document"`).
 */
export type PersistedSnapshot<M, C, P extends string> = {
  /** Persistence schema version (not app version). */
  version: number
  /** Unix epoch milliseconds when this snapshot was written. */
  createdAt: number
  /** List of persisted upload items. */
  items: Record<string, PersistedUploadItem<M, C, P>>
}

export type PersistedUploadItem<M, C, P extends string> = {
  /** Stable, client-generated ID for this upload in local state. */
  id: string
  /** File name. */
  file: {
    /** File name. */
    name: string
    /** File size in bytes. */
    size: number
    /** File MIME type. */
    type: string
    /** File lastModified timestamp (ms). */
    lastModified: number
    /** Optional checksum (example: SHA-256 hex). */
    checksum?: string
  }
  /** Backend-provided "intent" that describes how to upload (strategy, URLs, fields, etc). */
  intent: M[keyof M]
  /** Strategy cursor used to resume uploads that support continuation. */
  cursor?: import('../contracts').AnyCursor<C & Record<string, unknown>>
  /** Last-known progress for UX continuity after restoring from persistence. */
  progress?: { uploadedBytes: number; totalBytes: number; pct?: number }
  /** The last known state-machine phase at the time of persistence. */
  status: string
  /** Logical purpose for the upload (application-defined). */
  purpose: P
}

/**
 * A persisted snapshot of the upload store.
 *
 * Snapshots are versioned to allow safe migrations when the persistence schema evolves.
 * They are time-stamped for diagnostics and garbage-collection policies.
 */
export interface PersistenceAdapter {
  /** Loads a snapshot from persistence. */
  load(key: string): unknown | null | Promise<unknown | null>
  /** Saves a snapshot to persistence. */
  save(key: string, snapshot: unknown): void | Promise<void>
  /** Clears a snapshot from persistence. */
  clear(key: string): void | Promise<void>
}

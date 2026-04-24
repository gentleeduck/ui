/**
 * Deterministic client-side identity for a file.
 *
 * Used to match the same file across refreshes (for rebind) and to deduplicate.
 * If you include `checksum`, it should be stable and computed consistently.
 */
export type FileFingerprint = {
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

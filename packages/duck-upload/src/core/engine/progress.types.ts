/**
 * Upload progress snapshot.
 *
 * Invariants:
 * - `totalBytes` should be `file.size` when known.
 * - `pct` should be clamped to 0..100.
 */
export type UploadProgress = {
  /** Bytes uploaded so far. */
  uploadedBytes: number
  /** Total bytes to upload. */
  totalBytes: number
  /** Percent complete (0..100). */
  pct: number
}

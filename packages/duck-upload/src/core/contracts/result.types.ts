/**
 * Base shape for upload completion results returned by your backend.
 *
 * Extend this with any additional metadata you return (e.g. width/height, variants).
 */
export type UploadResultBase = {
  /** Backend file identifier. */
  fileId: string
  /** Storage key or path used for signed URLs. */
  key: string
}

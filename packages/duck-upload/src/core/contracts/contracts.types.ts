/**
 * Public contract types grouped under the `Contracts` namespace.
 *
 * Each sub-namespace owns one concern (Intent, Cursor, Result, Fingerprint,
 * Errors, Validation, Strategy, BackendApi).
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace Contracts {
  // -------------------- Intent --------------------

  /** Base shape for all upload intents. */
  export interface IIntentBase<K extends string = string> {
    /** Strategy name (discriminant). */
    strategy: K
    /** Unique backend file identifier. */
    fileId: string
  }

  /** Registry of intent types mapped by strategy name. */
  export type IntentMap = Record<string, IIntentBase<string>>

  /** Union of strategy keys for an intent map. */
  export type StrategyKey<M extends IntentMap> = keyof M & string

  /** Union of all intent variants for an intent map. */
  export type AnyIntent<M extends IntentMap> = M[StrategyKey<M>]

  // -------------------- Cursor --------------------

  /** Registry of cursor payload types mapped by strategy name. */
  export type CursorMap<M extends IntentMap> = Partial<Record<StrategyKey<M>, unknown>>

  /** Discriminated union of all cursor variants. */
  export type AnyCursor<C extends Record<string, unknown>> = {
    [K in keyof C & string]: { strategy: K; value?: C[K] }
  }[keyof C & string]

  // -------------------- Result --------------------

  /** Base shape for upload completion results returned by your backend. */
  export interface IResultBase {
    /** Backend file identifier. */
    fileId: string
    /** Storage key or path used for signed URLs. */
    key: string
  }

  // -------------------- Fingerprint --------------------

  /** Deterministic client-side identity for a file. */
  export interface IFileFingerprint {
    /** File name. */
    name: string
    /** File size in bytes. */
    size: number
    /** File MIME type. */
    type: string
    /** File lastModified timestamp (ms). */
    lastModified: number
    /** Optional checksum (e.g. SHA-256 hex). */
    checksum?: string
  }

  // -------------------- Errors --------------------

  /** File rejection reasons produced by client-side validation. */
  export type RejectReason =
    | { code: 'empty_file' }
    | { code: 'file_too_large'; maxBytes: number; size: number }
    | { code: 'type_not_allowed'; allowed: string[]; got: string }
    | { code: 'too_many_files'; max: number }

  /** Base shape for custom errors. */
  export interface IErrorBase {
    /** Stable error code. */
    code: string
    /** Human-friendly message (safe for UI). */
    message: string
    /** Optional cause (original error, response, etc.). */
    cause?: unknown
    /** Whether the error should be retried. */
    retryable?: boolean
  }

  /** Built-in engine errors. */
  export type BuiltInError =
    | { code: 'validation_failed'; message: string; reason: RejectReason; retryable?: false }
    | { code: 'strategy_missing'; message: string; strategy: string; retryable?: false }
    | { code: 'aborted'; message: string; reason: 'pause' | 'cancel' | 'unknown'; cause?: unknown; retryable?: false }
    | { code: 'network'; message: string; cause?: unknown; retryable?: boolean }
    | { code: 'http'; message: string; status: number; statusText?: string; cause?: unknown; retryable?: boolean }
    | { code: 'timeout'; message: string; cause?: unknown; retryable?: boolean }
    | { code: 'auth'; message: string; cause?: unknown; retryable?: false }
    | { code: 'rate_limit'; message: string; retryAfterMs?: number; cause?: unknown; retryable?: boolean }
    | { code: 'server'; message: string; serverCode?: string; cause?: unknown; retryable?: boolean }
    | { code: 'unknown'; message: string; cause?: unknown; retryable?: boolean }

  /** The error type used everywhere in the engine. */
  export type Error = BuiltInError | (IErrorBase & Record<string, unknown>)

  // -------------------- Validation --------------------

  /** Validation rules applied on `addFiles`. */
  export interface IValidationRules {
    /** Maximum number of files allowed. */
    maxFiles?: number
    /** Maximum file size in bytes. */
    maxSizeBytes?: number
    /** Minimum file size in bytes. */
    minSizeBytes?: number
    /** Allowed MIME types. */
    allowedTypes?: string[]
    /** Allowed file extensions. */
    allowedExtensions?: string[]
  }

  // -------------------- Backend API --------------------

  /** Common options object for backend calls. */
  export type WithSignal = { signal?: AbortSignal }

  /** Backend adapter the engine calls into. */
  export interface IUploadApi<M extends IntentMap, P extends string, R extends IResultBase = IResultBase> {
    /**
     * Create an upload intent. The backend decides the strategy and any
     * presigned URLs / form fields.
     */
    createIntent(
      args: { purpose: P; contentType: string; size: number; filename: string; checksum?: string },
      opts?: WithSignal,
    ): Promise<M[keyof M]>

    /** Finalize an upload after all bytes are on the server. */
    complete(args: { fileId: string }, opts?: WithSignal): Promise<R>

    /** Optional helper to mint a signed preview URL for a finished upload. */
    getSignedPreviewUrl?(args: { fileId: string; key: string; purpose: P }, opts?: WithSignal): Promise<string>

    /** Optional checksum-based dedupe lookup. */
    findByChecksum?(args: { checksum: string; purpose: P }, opts?: WithSignal): Promise<R | null>

    /** Multipart-strategy operations. Required when using the multipart strategy. */
    multipart?: {
      /** Sign one part for upload. */
      signPart(
        args: { fileId: string; uploadId: string; partNumber: number; checksum?: string },
        opts?: WithSignal,
      ): Promise<{ url: string; headers?: Record<string, string> }>

      /** Tell the backend to assemble the parts into the final object. */
      completeMultipart(
        args: { fileId: string; uploadId: string; parts: Array<{ partNumber: number; etag: string }> },
        opts?: WithSignal,
      ): Promise<unknown>

      /** Optional: list already-uploaded parts (used by resume diagnostics). */
      listParts?(
        args: { fileId: string; uploadId: string },
        opts?: WithSignal,
      ): Promise<Array<{ partNumber: number; etag?: string; size?: number }>>

      /** Optional: abort an in-progress multipart session on the backend. */
      abort?(args: { fileId: string; uploadId: string }, opts?: WithSignal): Promise<void>
    }

    /** TUS-strategy operations. */
    tus?: {
      /** Create a TUS upload session, returning its URL. */
      create(
        args: { fileId: string; size: number; filename: string; contentType: string },
        opts?: WithSignal,
      ): Promise<{ uploadUrl: string }>

      /** Read the current TUS upload offset (used for resume). */
      getOffset(args: { uploadUrl: string }, opts?: WithSignal): Promise<{ offset: number }>
    }
  }
}

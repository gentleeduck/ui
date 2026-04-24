/**
 * Base shape for all upload intents.
 *
 * An "intent" is data provided by your backend that tells the client how to upload a file
 * (for example: a presigned POST, presigned PUT, multipart upload IDs, part URLs, headers, etc).
 *
 * Every intent must include:
 * - `strategy`: a discriminant used to select an upload strategy implementation
 * - `fileId`: a stable backend identifier for the file being uploaded
 *
 * @typeParam K - Strategy key / discriminant string (example: `"direct" | "multipart"`).
 */
export type IntentBase<K extends string = string> = {
  /** Strategy name (discriminant). */
  strategy: K
  /** Unique backend file identifier. */
  fileId: string
}

/**
 * Registry of intent types mapped by strategy name.
 *
 * Example:
 * ```ts
 * type MyIntents = {
 *   direct: DirectIntent
 *   multipart: MultipartIntent
 * }
 * ```
 *
 * `M[keyof M]` is used throughout the engine as the "any intent" union.
 */
export type IntentMap = Record<string, IntentBase<string>>

/** Union of strategy keys for an intent map. */
export type StrategyKey<M extends IntentMap> = keyof M & string

/** Union of all intent variants for an intent map. */
export type AnyIntent<M extends IntentMap> = M[StrategyKey<M>]

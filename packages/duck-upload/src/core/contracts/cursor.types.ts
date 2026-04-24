import type { IntentMap, StrategyKey } from './intent.types'

/**
 * Registry of cursor payload types mapped by strategy name.
 *
 * A "cursor" is strategy-defined resume state (ex: multipart uploaded parts, next byte offset).
 * Use `unknown` here and define concrete cursor payload types in your app.
 *
 * @typeParam M - The intent map, used to constrain strategy keys.
 */
export type CursorMap<M extends IntentMap> = Partial<Record<StrategyKey<M>, unknown>>

/**
 * Discriminated union of all cursor variants.
 *
 * The cursor is always tagged with a `strategy` so it can be routed back to the correct strategy
 * on resume/rebind.
 *
 * @typeParam C - Cursor registry (usually {@link CursorMap}).
 */
export type AnyCursor<C extends Record<string, unknown>> = {
  [K in keyof C & string]: { strategy: K; value?: C[K] }
}[keyof C & string]

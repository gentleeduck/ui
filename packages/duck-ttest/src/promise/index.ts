/** Unwrap `Promise<T>` to `T`; pass non-promises through unchanged. */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

/** Recursively unwrap nested promises. */
export type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T

/** `T` or `Promise<T>` — for async-or-sync APIs. */
export type MaybePromise<T> = T | Promise<T>

export type Promisable<T> = MaybePromise<T>

/** Resolved tuple from `Promise.all`-style inputs. */
export type PromiseAll<T extends readonly unknown[]> = { [K in keyof T]: Awaited<T[K]> }

/** `true` if `T` is a `Promise`. */
export type IsPromise<T> = T extends Promise<unknown> ? true : false

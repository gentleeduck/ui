// Promise and async type utilities

/**
 * Unwrap a `Promise<T>` into `T`. Returns `T` untouched if it isn't a promise.
 *
 * @example
 * type X = UnwrapPromise<Promise<string>> // string
 * type Y = UnwrapPromise<number>          // number
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

/**
 * Recursively unwrap nested promises.
 *
 * @example
 * type X = DeepAwaited<Promise<Promise<string>>> // string
 */
export type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T

/**
 * `T` or a `Promise<T>`. Common return type for async-or-sync APIs.
 */
export type MaybePromise<T> = T | Promise<T>

/** Alias for `MaybePromise`. */
export type Promisable<T> = MaybePromise<T>

/**
 * Resolved tuple from `Promise.all`-style inputs.
 *
 * @example
 * type X = PromiseAll<[Promise<1>, Promise<'x'>, 3]> // [1, 'x', 3]
 */
export type PromiseAll<T extends readonly unknown[]> = { [K in keyof T]: Awaited<T[K]> }

/**
 * `true` if `T` is a `Promise<any>`.
 */
export type IsPromise<T> = T extends Promise<unknown> ? true : false

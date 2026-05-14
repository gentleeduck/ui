import type { Equal } from '~/equality'

/** Keys of `O` whose value extends `T`. */
export type KeysOfType<O, T> = { [K in keyof O]: O[K] extends T ? K : never }[keyof O]

/** Optional keys of `T`. */
export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T]

/** Required keys of `T`. */
export type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>

/** Readonly keys of `T`. */
export type ReadonlyKeys<T> = {
  [K in keyof T]-?: Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? K : never
}[keyof T]

/** Mutable (non-readonly) keys of `T`. */
export type MutableKeys<T> = Exclude<keyof T, ReadonlyKeys<T>>

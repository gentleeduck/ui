import type { Equal } from '~/equality'

/** `true` if every property of `T` is mutable (no `readonly`). */
export type IsMutable<T> = Equal<{ -readonly [K in keyof T]: T[K] }, T>

/** `true` if every property of `T` is `readonly`. */
export type IsReadonly<T> = Equal<T, Readonly<T>>

/** `true` if every property of `T` is optional. */
export type IsPartial<T> = Equal<{ [K in keyof T]?: T[K] }, T>

/** `true` if every property of `T` is required. */
export type IsRequired<T> = Equal<{ [K in keyof T]-?: T[K] }, T>

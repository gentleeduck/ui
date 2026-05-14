/** Union of all JavaScript primitive types. */
export type Primitive = string | number | boolean | bigint | symbol | null | undefined

/** Union of all falsy values. */
export type Falsy = '' | 0 | 0n | false | null | undefined

/** Exclude falsy types from `T`. */
export type Truthy<T> = Exclude<T, Falsy>

export type Nullish = null | undefined

/** Remove `null | undefined` from `T`. */
export type NonNullish<T> = Exclude<T, Nullish>

/**
 * Built-in types that behave like primitives for deep-transform recursion.
 * Used as the stop condition by `DeepPartial`, `DeepReadonly`, etc.
 */
export type Builtin =
  | Primitive
  | Date
  | Error
  | RegExp
  | ArrayBuffer
  | DataView
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<WeakKey, unknown>
  | WeakSet<WeakKey>
  | Promise<unknown>
  // biome-ignore lint/complexity/noBannedTypes: intentional structural function match
  | Function

/** Anything not a primitive — objects, arrays, functions, class instances. */
// biome-ignore lint/complexity/noBannedTypes: {} deliberately matches any non-nullish value
export type NonPrimitive = Exclude<{}, Primitive>

export type IsPrimitive<T> = T extends Primitive ? true : false

/** A value or a readonly array of that value. */
export type Arrayable<T> = T | readonly T[]

/** `n`-dimensional nested array of `T`. */
export type MultidimensionalArray<T> = T | ReadonlyArray<MultidimensionalArray<T>>

export type Nullable<T> = T | null
export type Maybe<T> = T | null | undefined

/** `true` if `T` includes `undefined`. */
export type IsOptional<T> = undefined extends T ? true : false

/** `true` if `T` includes `null` or `undefined`. */
export type IsNullable<T> = null extends T ? true : undefined extends T ? true : false

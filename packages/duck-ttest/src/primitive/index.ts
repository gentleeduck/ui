// Primitive type utilities

/**
 * Union of all JavaScript primitive types.
 *
 * @example
 * type X = Primitive // string | number | boolean | bigint | symbol | null | undefined
 */
export type Primitive = string | number | boolean | bigint | symbol | null | undefined

/**
 * Union of all falsy values at the type level.
 *
 * @example
 * type X = Falsy // '' | 0 | 0n | false | null | undefined
 */
export type Falsy = '' | 0 | 0n | false | null | undefined

/**
 * Excludes falsy types from `T`. The type-level equivalent of `Boolean(x)` filtering.
 *
 * @example
 * type X = Truthy<string | '' | 0 | number | null> // string | number
 */
export type Truthy<T> = Exclude<T, Falsy>

/**
 * `null | undefined` — the two nullish values.
 */
export type Nullish = null | undefined

/**
 * Removes `null | undefined` from `T`.
 *
 * @example
 * type X = NonNullish<string | null | undefined> // string
 */
export type NonNullish<T> = Exclude<T, Nullish>

/**
 * Well-known built-in object types that behave like primitives in most
 * deep-transform scenarios. Useful as a stop condition when recursing.
 *
 * Includes: primitives, `Date`, `Error`, `RegExp`, `ArrayBuffer`, `DataView`,
 * `Map`, `Set`, `WeakMap`, `WeakSet`, `Promise`, and every function type.
 * Extending this type automatically improves every recursive utility in this
 * package that uses it as a stop condition (`DeepPartial`, `DeepReadonly`, …).
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

/**
 * Anything that is *not* a primitive — objects, arrays, functions, class instances.
 */
// biome-ignore lint/complexity/noBannedTypes: {} deliberately matches any non-nullish value
export type NonPrimitive = Exclude<{}, Primitive>

/**
 * `true` if `T` is a primitive type, `false` otherwise.
 *
 * @example
 * type A = IsPrimitive<string>       // true
 * type B = IsPrimitive<{ a: 1 }>     // false
 * type C = IsPrimitive<() => void>   // false
 */
export type IsPrimitive<T> = T extends Primitive ? true : false

/**
 * A value or an array of that value.
 *
 * @example
 * function emit(events: Arrayable<string>): void { /* ... *\/ }
 */
export type Arrayable<T> = T | readonly T[]

/**
 * Recursive `n`-dimensional nested array of `T`.
 *
 * @example
 * type X = MultidimensionalArray<number> // number | number[] | number[][] | ...
 */
export type MultidimensionalArray<T> = T | ReadonlyArray<MultidimensionalArray<T>>

/** `T | null`. */
export type Nullable<T> = T | null

/** `T | null | undefined`. */
export type Maybe<T> = T | null | undefined

/**
 * `true` if `T` includes `undefined` (i.e. is optional-compatible).
 */
export type IsOptional<T> = undefined extends T ? true : false

/**
 * `true` if `T` includes `null` or `undefined`.
 */
export type IsNullable<T> = null extends T ? true : undefined extends T ? true : false

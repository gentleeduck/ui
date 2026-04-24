// Literal type utilities

/**
 * Suggest autocomplete for the literal union `L` while still permitting any
 * value of the wider type `W`.
 *
 * Classic use: a prop that wants a finite set of suggestions but shouldn't
 * error if the user passes something else.
 *
 * @example
 * type Size = LiteralUnion<'sm' | 'md' | 'lg', string>
 * const a: Size = 'sm'      // ✓ autocompletes sm/md/lg
 * const b: Size = 'custom'  // ✓ still allowed
 */
export type LiteralUnion<L extends W, W> = L | (W & { _?: never })

/**
 * Force `T` to match `Shape` exactly — no extra properties allowed.
 *
 * @example
 * function log<T extends Exact<T, { name: string }>>(t: T): void { /* ... *\/ }
 * log({ name: 'a' })               // ✓
 * log({ name: 'a', extra: 1 })     // ❌ 'extra' is not in Exact<...>
 */
export type Exact<T, Shape> = T extends Shape ? (Exclude<keyof T, keyof Shape> extends never ? T : never) : never

/**
 * Widen a literal type to its primitive.
 *
 * @example
 * type A = Widen<'hello'> // string
 * type B = Widen<42>      // number
 * type C = Widen<true>    // boolean
 */
export type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends bigint
        ? bigint
        : T extends symbol
          ? symbol
          : T

/**
 * `true` if `T` is a literal (not its widened primitive).
 *
 * @example
 * type A = IsLiteral<'hello'>  // true
 * type B = IsLiteral<string>   // false
 * type C = IsLiteral<42>       // true
 */
export type IsLiteral<T> = T extends string | number | boolean | bigint | symbol
  ? Widen<T> extends T
    ? false
    : true
  : false

/**
 * Prevent TypeScript from widening an inferred literal. Useful as a generic
 * constraint in helper functions that accept literal args.
 *
 * @example
 * declare function value<T>(t: Narrow<T>): T
 * const x = value(['a', 'b', 1]) // inferred as readonly ['a', 'b', 1]
 */
export type Narrow<T> =
  | (T extends [] ? [] : never)
  | (T extends string | number | boolean | bigint ? T : never)
  | { [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : Narrow<T[K]> }

/**
 * `true` if `T` is a string-literal type (not the wider `string`).
 *
 * @example
 * type A = IsStringLiteral<'hello'> // true
 * type B = IsStringLiteral<string>  // false
 */
export type IsStringLiteral<T> = [T] extends [string] ? ([string] extends [T] ? false : true) : false

/**
 * `true` if `T` is a numeric-literal type (not the wider `number`).
 */
export type IsNumericLiteral<T> = [T] extends [number] ? ([number] extends [T] ? false : true) : false

/**
 * `true` if `T` is a boolean-literal (`true` or `false`), not `boolean`.
 */
export type IsBooleanLiteral<T> = [T] extends [boolean] ? ([boolean] extends [T] ? false : true) : false

/**
 * `true` if `T` is a bigint-literal.
 */
export type IsBigIntLiteral<T> = [T] extends [bigint] ? ([bigint] extends [T] ? false : true) : false

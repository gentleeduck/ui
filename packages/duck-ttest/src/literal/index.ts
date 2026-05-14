/**
 * Autocomplete-friendly literal union: suggests `L` while still accepting any
 * value of the wider type `W`. Use for props that want suggestions without
 * rejecting other values.
 */
export type LiteralUnion<L extends W, W> = L | (W & { _?: never })

/** Force `T` to match `Shape` exactly — no extra properties allowed. */
export type Exact<T, Shape> = T extends Shape ? (Exclude<keyof T, keyof Shape> extends never ? T : never) : never

/** Widen a literal type to its primitive. */
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

/** `true` if `T` is a literal (not its widened primitive). */
export type IsLiteral<T> = T extends string | number | boolean | bigint | symbol
  ? Widen<T> extends T
    ? false
    : true
  : false

/** Prevent inference from widening literal args. Use as a generic constraint. */
export type Narrow<T> =
  | (T extends [] ? [] : never)
  | (T extends string | number | boolean | bigint ? T : never)
  | { [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : Narrow<T[K]> }

/** `true` if `T` is a string-literal (not the wider `string`). */
export type IsStringLiteral<T> = [T] extends [string] ? ([string] extends [T] ? false : true) : false

/** `true` if `T` is a numeric-literal. */
export type IsNumericLiteral<T> = [T] extends [number] ? ([number] extends [T] ? false : true) : false

/** `true` if `T` is a boolean-literal. */
export type IsBooleanLiteral<T> = [T] extends [boolean] ? ([boolean] extends [T] ? false : true) : false

/** `true` if `T` is a bigint-literal. */
export type IsBigIntLiteral<T> = [T] extends [bigint] ? ([bigint] extends [T] ? false : true) : false

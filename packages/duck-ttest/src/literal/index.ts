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

// Internal: `true` if `T` is `Wide` exactly (i.e. `T` is the wide type, not a
// narrower literal subtype of it).
type _IsExactly<T, Wide> = [T] extends [Wide] ? ([Wide] extends [T] ? false : true) : false

/** `true` if `T` is a string-literal (not the wider `string`). */
export type IsStringLiteral<T> = _IsExactly<T, string>

/** `true` if `T` is a numeric-literal. */
export type IsNumericLiteral<T> = _IsExactly<T, number>

/** `true` if `T` is a boolean-literal. */
export type IsBooleanLiteral<T> = _IsExactly<T, boolean>

/** `true` if `T` is a bigint-literal. */
export type IsBigIntLiteral<T> = _IsExactly<T, bigint>

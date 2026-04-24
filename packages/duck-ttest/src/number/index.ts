// Type-level number arithmetic and predicates.
//
// Implemented via tuple-length recursion — so values are small-N only.
// TypeScript's recursion limit practically caps arithmetic at ~999.

/** Internal: a tuple whose length equals `N`. */
type Tuple<N extends number, Acc extends unknown[] = []> = Acc['length'] extends N ? Acc : Tuple<N, [...Acc, unknown]>

/**
 * `true` if `N` is exactly `0`.
 */
export type IsZero<N extends number> = N extends 0 ? true : false

/**
 * `true` if `N` has a leading minus sign.
 *
 * @example
 * type A = IsNegative<-3>  // true
 * type B = IsNegative<5>   // false
 */
export type IsNegative<N extends number> = `${N}` extends `-${string}` ? true : false

/**
 * `true` if `N` is strictly greater than `0`.
 */
export type IsPositive<N extends number> = IsZero<N> extends true ? false : IsNegative<N> extends true ? false : true

/**
 * Absolute value of `N`.
 *
 * @example
 * type A = Abs<-7>  // 7
 * type B = Abs<7>   // 7
 */
export type Abs<N extends number> = `${N}` extends `-${infer P extends number}` ? P : N

/**
 * Negate `N` — flips its sign.
 *
 * @example
 * type A = Negate<3>   // -3
 * type B = Negate<-3>  // 3
 * type C = Negate<0>   // 0
 */
export type Negate<N extends number> = N extends 0
  ? 0
  : `${N}` extends `-${infer P extends number}`
    ? P
    : `-${N}` extends `${infer R extends number}`
      ? R
      : never

/**
 * Increment a non-negative integer by 1. Limited by recursion depth.
 *
 * @example
 * type X = Inc<4> // 5
 */
export type Inc<N extends number> = [...Tuple<N>, unknown]['length'] & number

/**
 * Decrement a positive integer by 1. Yields `never` for `0`.
 *
 * @example
 * type X = Dec<4> // 3
 */
export type Dec<N extends number> = Tuple<N> extends [unknown, ...infer R] ? R['length'] & number : never

/**
 * Add two non-negative integers.
 *
 * @example
 * type X = Add<3, 4> // 7
 */
export type Add<A extends number, B extends number> = [...Tuple<A>, ...Tuple<B>]['length'] & number

/**
 * Subtract `B` from `A` for non-negative integers where `A >= B`. Else `never`.
 *
 * @example
 * type X = Sub<7, 3> // 4
 */
export type Sub<A extends number, B extends number> =
  Tuple<A> extends [...infer R, ...Tuple<B>] ? R['length'] & number : never

/**
 * Multiply two non-negative integers.
 *
 * @example
 * type X = Mul<3, 4> // 12
 */
export type Mul<A extends number, B extends number, Acc extends unknown[] = []> = B extends 0
  ? Acc['length'] & number
  : Mul<A, Dec<B>, [...Acc, ...Tuple<A>]>

/**
 * `A > B` for non-negative integers.
 */
export type Gt<A extends number, B extends number> = A extends B
  ? false
  : Tuple<A> extends [...Tuple<B>, ...unknown[]]
    ? true
    : false

/**
 * `A < B` for non-negative integers.
 */
export type Lt<A extends number, B extends number> = A extends B ? false : Gt<B, A>

/**
 * `A >= B` for non-negative integers.
 */
export type Gte<A extends number, B extends number> = A extends B ? true : Gt<A, B>

/**
 * `A <= B` for non-negative integers.
 */
export type Lte<A extends number, B extends number> = A extends B ? true : Lt<A, B>

/**
 * `true` if `A === B`.
 */
export type Eq<A extends number, B extends number> = A extends B ? (B extends A ? true : false) : false

/**
 * `-1 | 0 | 1` comparison result of `A` vs `B` for non-negative integers.
 */
export type Compare<A extends number, B extends number> = A extends B ? 0 : Gt<A, B> extends true ? 1 : -1

/** `true` if `N` is even. */
export type IsEven<N extends number> = N extends 0
  ? true
  : N extends 1
    ? false
    : Dec<N> extends infer D extends number
      ? Dec<D> extends infer DD extends number
        ? IsEven<DD>
        : false
      : false

/** `true` if `N` is odd. */
export type IsOdd<N extends number> = IsEven<N> extends true ? false : true

/**
 * Convert a number to its string literal representation.
 *
 * @example
 * type X = NumberToString<42> // '42'
 */
export type NumberToString<N extends number> = `${N}`

/**
 * Parse a string literal into a number type if possible, else `never`.
 *
 * @example
 * type X = StringToNumber<'42'> // 42
 */
export type StringToNumber<S extends string> = S extends `${infer N extends number}` ? N : never

/**
 * Constrains to integers. Same as `number` unless used in a position that
 * benefits from the brand (e.g. function parameter with a literal check).
 */
export type Integer<N extends number = number> = `${N}` extends `${bigint}` ? N : never

/**
 * Constrains to positive (non-zero, non-negative) numbers.
 */
export type Positive<N extends number = number> = IsPositive<N> extends true ? N : never

/** Constrains to negative numbers. */
export type NegativeNumber<N extends number = number> = IsNegative<N> extends true ? N : never

/** Constrains to non-negative numbers (>= 0). */
export type NonNegative<N extends number = number> = IsNegative<N> extends true ? never : N

/** Constrains to finite numbers. */
export type Finite<N extends number = number> = number extends N
  ? N
  : `${N}` extends 'Infinity' | '-Infinity' | 'NaN'
    ? never
    : N

// -----------------------------------------------------------------------------
// Aggregate / range operations
// -----------------------------------------------------------------------------

/**
 * Sum of a tuple of non-negative integers.
 *
 * @example
 * type X = Sum<[1, 2, 3, 4]> // 10
 */
export type Sum<T extends readonly number[]> = T extends readonly [
  infer H extends number,
  ...infer R extends readonly number[],
]
  ? Add<H, Sum<R>>
  : 0

/**
 * Maximum value in a tuple of non-negative integers.
 */
export type Max<T extends readonly number[]> = T extends readonly [
  infer H extends number,
  ...infer R extends readonly number[],
]
  ? _MaxReduce<R, H>
  : never

type _MaxReduce<T extends readonly number[], Acc extends number> = T extends readonly [
  infer H extends number,
  ...infer R extends readonly number[],
]
  ? _MaxReduce<R, Gt<H, Acc> extends true ? H : Acc>
  : Acc

/**
 * Minimum value in a tuple of non-negative integers.
 */
export type Min<T extends readonly number[]> = T extends readonly [
  infer H extends number,
  ...infer R extends readonly number[],
]
  ? _MinReduce<R, H>
  : never

type _MinReduce<T extends readonly number[], Acc extends number> = T extends readonly [
  infer H extends number,
  ...infer R extends readonly number[],
]
  ? _MinReduce<R, Lt<H, Acc> extends true ? H : Acc>
  : Acc

/**
 * Integer division `floor(A / B)` for non-negative integers. `B` must be positive.
 *
 * @example
 * type X = Div<10, 3> // 3
 */
export type Div<A extends number, B extends number, Count extends unknown[] = []> =
  Lt<A, B> extends true ? Count['length'] & number : Div<Sub<A, B>, B, [...Count, unknown]>

/**
 * Remainder `A mod B` for non-negative integers. `B` must be positive.
 *
 * @example
 * type X = Mod<10, 3> // 1
 */
export type Mod<A extends number, B extends number> = Lt<A, B> extends true ? A : Mod<Sub<A, B>, B>

/**
 * Union of all integers from `Start` (inclusive) to `End` (exclusive).
 *
 * @example
 * type X = EnumerateRange<2, 6> // 2 | 3 | 4 | 5
 */
export type EnumerateRange<Start extends number, End extends number> = Exclude<_Enum<End>, _Enum<Start>>

type _Enum<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : _Enum<N, [...Acc, Acc['length']]>

/**
 * `true` if `Lo <= N <= Hi`.
 */
export type IsBetween<N extends number, Lo extends number, Hi extends number> =
  Gte<N, Lo> extends true ? (Lte<N, Hi> extends true ? true : false) : false

/**
 * Stringify every digit of a non-negative integer as a tuple of digits.
 *
 * @example
 * type X = DigitsOf<1205> // ['1', '2', '0', '5']
 */
export type DigitsOf<N extends number> = _Digits<`${N}`>
type _Digits<S extends string> = S extends `${infer H}${infer R}` ? [H, ..._Digits<R>] : []

/**
 * Integer power `A ** B` for small non-negative integers. Limited by
 * TypeScript's tuple-length recursion cap — practical only for small values.
 *
 * @example
 * type X = Pow<2, 5> // 32
 */
export type Pow<A extends number, B extends number, Acc extends unknown[] = [unknown]> = B extends 0
  ? Acc['length'] & number
  : Pow<A, Dec<B>, _Replicate<Acc, A>>

type _Replicate<
  T extends unknown[],
  N extends number,
  Out extends unknown[] = [],
  I extends unknown[] = [],
> = I['length'] extends N ? Out : _Replicate<T, N, [...Out, ...T], [...I, unknown]>

/**
 * Greatest common divisor (Euclidean algorithm) for non-negative integers.
 *
 * @example
 * type X = GCD<12, 18> // 6
 */
export type GCD<A extends number, B extends number> = B extends 0 ? A : GCD<B, Mod<A, B>>

/**
 * Least common multiple of `A` and `B` for non-negative integers.
 *
 * @example
 * type X = LCM<4, 6> // 12
 */
export type LCM<A extends number, B extends number> = A extends 0 ? 0 : B extends 0 ? 0 : Mul<Div<A, GCD<A, B>>, B>

/**
 * Factorial of `N`. Recursion-limited — practical up to ~170 in theory, but
 * TypeScript tuple-length caps practical use at ~20.
 *
 * @example
 * type X = Factorial<5> // 120
 */
export type Factorial<N extends number> = N extends 0 | 1 ? 1 : Mul<N, Factorial<Dec<N>>>

/**
 * Clamp `N` to the inclusive range `[Lo, Hi]`.
 *
 * @example
 * type A = Clamp<50, 0, 100>  // 50
 * type B = Clamp<120, 0, 100> // 100
 * type C = Clamp<-5, 0, 100>  // 0
 */
export type Clamp<N extends number, Lo extends number, Hi extends number> =
  Lt<N, Lo> extends true ? Lo : Gt<N, Hi> extends true ? Hi : N

/**
 * `true` if `N` is a power of two (2, 4, 8, 16, ...).
 */
export type IsPowerOfTwo<N extends number> = N extends 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024
  ? true
  : false

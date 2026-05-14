// Tuple-length recursion arithmetic. TypeScript's recursion limit caps practical N at ~999.

/** A tuple whose length equals `N`. */
type Tuple<N extends number, Acc extends unknown[] = []> = Acc['length'] extends N ? Acc : Tuple<N, [...Acc, unknown]>

export type IsZero<N extends number> = N extends 0 ? true : false

export type IsNegative<N extends number> = `${N}` extends `-${string}` ? true : false

export type IsPositive<N extends number> = IsZero<N> extends true ? false : IsNegative<N> extends true ? false : true

export type Abs<N extends number> = `${N}` extends `-${infer P extends number}` ? P : N

/** Negate `N`: `Negate<3>` → `-3`; `Negate<0>` → `0`. */
export type Negate<N extends number> = N extends 0
  ? 0
  : `${N}` extends `-${infer P extends number}`
    ? P
    : `-${N}` extends `${infer R extends number}`
      ? R
      : never

/** `Inc<N>` → `N + 1`. */
export type Inc<N extends number> = [...Tuple<N>, unknown]['length'] & number

/** `Dec<N>` → `N - 1`; `never` for `0`. */
export type Dec<N extends number> = Tuple<N> extends [unknown, ...infer R] ? R['length'] & number : never

/** Add two non-negative integers. */
export type Add<A extends number, B extends number> = [...Tuple<A>, ...Tuple<B>]['length'] & number

/** Subtract `B` from `A` where `A >= B`; else `never`. */
export type Sub<A extends number, B extends number> =
  Tuple<A> extends [...infer R, ...Tuple<B>] ? R['length'] & number : never

/** Multiply two non-negative integers. */
export type Mul<A extends number, B extends number, Acc extends unknown[] = []> = B extends 0
  ? Acc['length'] & number
  : Mul<A, Dec<B>, [...Acc, ...Tuple<A>]>

/** `A > B` for non-negative integers. */
export type Gt<A extends number, B extends number> = A extends B
  ? false
  : Tuple<A> extends [...Tuple<B>, ...unknown[]]
    ? true
    : false

/** `A < B` for non-negative integers. */
export type Lt<A extends number, B extends number> = A extends B ? false : Gt<B, A>

/** `A >= B` for non-negative integers. */
export type Gte<A extends number, B extends number> = A extends B ? true : Gt<A, B>

/** `A <= B` for non-negative integers. */
export type Lte<A extends number, B extends number> = A extends B ? true : Lt<A, B>

export type Eq<A extends number, B extends number> = A extends B ? (B extends A ? true : false) : false

/** Returns `-1 | 0 | 1` for `A` vs `B`. */
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

export type NumberToString<N extends number> = `${N}`

/** Parse a string literal into a number, else `never`. */
export type StringToNumber<S extends string> = S extends `${infer N extends number}` ? N : never

/** Constrain to integers. */
export type Integer<N extends number = number> = `${N}` extends `${bigint}` ? N : never

/** Constrain to positive (non-zero) numbers. */
export type Positive<N extends number = number> = IsPositive<N> extends true ? N : never

export type NegativeNumber<N extends number = number> = IsNegative<N> extends true ? N : never

/** Constrain to non-negative numbers (>= 0). */
export type NonNegative<N extends number = number> = IsNegative<N> extends true ? never : N

/** Constrain to finite numbers. */
export type Finite<N extends number = number> = number extends N
  ? N
  : `${N}` extends 'Infinity' | '-Infinity' | 'NaN'
    ? never
    : N

/** Sum a tuple of non-negative integers. */
export type Sum<T extends readonly number[]> = T extends readonly [
  infer H extends number,
  ...infer R extends readonly number[],
]
  ? Add<H, Sum<R>>
  : 0

/** Maximum value in a tuple. */
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

/** Minimum value in a tuple. */
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

/** Integer division `floor(A / B)`; `B` must be positive. */
export type Div<A extends number, B extends number, Count extends unknown[] = []> =
  Lt<A, B> extends true ? Count['length'] & number : Div<Sub<A, B>, B, [...Count, unknown]>

/** Remainder `A mod B`; `B` must be positive. */
export type Mod<A extends number, B extends number> = Lt<A, B> extends true ? A : Mod<Sub<A, B>, B>

/** Union of integers in `[Start, End)`. */
export type EnumerateRange<Start extends number, End extends number> = Exclude<_Enum<End>, _Enum<Start>>

type _Enum<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : _Enum<N, [...Acc, Acc['length']]>

/** `Lo <= N <= Hi`. */
export type IsBetween<N extends number, Lo extends number, Hi extends number> =
  Gte<N, Lo> extends true ? (Lte<N, Hi> extends true ? true : false) : false

/** Tuple of decimal digits: `DigitsOf<1205>` → `['1', '2', '0', '5']`. */
export type DigitsOf<N extends number> = _Digits<`${N}`>
type _Digits<S extends string> = S extends `${infer H}${infer R}` ? [H, ..._Digits<R>] : []

/** Integer power `A ** B`. Tuple-recursion cap limits practical N. */
export type Pow<A extends number, B extends number, Acc extends unknown[] = [unknown]> = B extends 0
  ? Acc['length'] & number
  : Pow<A, Dec<B>, _Replicate<Acc, A>>

type _Replicate<
  T extends unknown[],
  N extends number,
  Out extends unknown[] = [],
  I extends unknown[] = [],
> = I['length'] extends N ? Out : _Replicate<T, N, [...Out, ...T], [...I, unknown]>

/** Greatest common divisor (Euclidean). */
export type GCD<A extends number, B extends number> = B extends 0 ? A : GCD<B, Mod<A, B>>

/** Least common multiple. */
export type LCM<A extends number, B extends number> = A extends 0 ? 0 : B extends 0 ? 0 : Mul<Div<A, GCD<A, B>>, B>

/** Factorial. Tuple-recursion caps practical use at ~20. */
export type Factorial<N extends number> = N extends 0 | 1 ? 1 : Mul<N, Factorial<Dec<N>>>

/** Clamp `N` to `[Lo, Hi]` inclusive. */
export type Clamp<N extends number, Lo extends number, Hi extends number> =
  Lt<N, Lo> extends true ? Lo : Gt<N, Hi> extends true ? Hi : N

export type IsPowerOfTwo<N extends number> = N extends 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024
  ? true
  : false

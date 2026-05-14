/** First element of `T`. */
export type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never

/** All-but-first of `T`. */
export type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never

/** Last element of `T`. */
export type Last<T extends any[]> = T extends [...any[], infer L] ? L : never

/** Prepend `E` to `T`. */
export type Prepend<E, T extends any[]> = [E, ...T]

/** Append `E` to `T`. */
export type Append<T extends any[], E> = [...T, E]

/** Length of `T`. */
export type Length<T extends any[]> = T['length']

/** Pair `T` and `U` element-wise; stops at the shorter input. */
export type Zip<T extends any[], U extends any[]> = T extends [infer T1, ...infer TR]
  ? U extends [infer U1, ...infer UR]
    ? [[T1, U1], ...Zip<TR, UR>]
    : []
  : []

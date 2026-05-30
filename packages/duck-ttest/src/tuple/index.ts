/** First element of `T`. */
export type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never

/** All-but-first of `T`. */
export type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never

/** Last element of `T`. */
export type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never

/** Prepend `E` to `T`. */
export type Prepend<E, T extends unknown[]> = [E, ...T]

/** Append `E` to `T`. */
export type Append<T extends unknown[], E> = [...T, E]

/** Length of `T`. */
export type Length<T extends unknown[]> = T['length']

/** Pair `T` and `U` element-wise; stops at the shorter input. */
export type Zip<T extends unknown[], U extends unknown[]> = T extends [infer T1, ...infer TR]
  ? U extends [infer U1, ...infer UR]
    ? [[T1, U1], ...Zip<TR, UR>]
    : []
  : []

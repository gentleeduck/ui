/**
 * Bidirectional structural equality. Distinguishes `any` from `unknown` and
 * preserves variance — narrower than `X extends Y && Y extends X`.
 */
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

/** Inverse of `Equal`. */
export type NotEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? false : true

/** One-way assignability: `X extends Y`. */
export type ShallowEqual<X, Y> = X extends Y ? true : false

/** Inverse of `ShallowEqual`. */
export type ShallowNotEqual<X, Y> = X extends Y ? false : true

/** `true` if `O[K]` exists and equals `T` exactly. */
export type HasKeyWithType<K extends string, T, O> = K extends keyof O ? Equal<T, O[K]> : false

/** `true` if `K` is in `keyof O`. */
export type HasKey<K extends string, O> = K extends keyof O ? true : false

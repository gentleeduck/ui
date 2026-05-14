/** Flatten an intersection into a plain object. */
export type Expand<T> = { [K in keyof T]: T[K] }

/** Merge `A` and `B`; overlapping keys take `B`'s type. */
export type Merge<A, B> = Expand<Omit<A, keyof B> & B>

/** Keys of `A` not present in `B`. */
export type Diff<A, B> = Omit<A, keyof B>

/** Pick properties of `O` whose value extends `T`. */
export type PickByValue<O, T> = {
  [K in keyof O as O[K] extends T ? K : never]: O[K]
}

/** Omit properties of `O` whose value extends `T`. */
export type OmitByValue<O, T> = {
  [K in keyof O as O[K] extends T ? never : K]: O[K]
}

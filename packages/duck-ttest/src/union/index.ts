/** Union to intersection: `A | B` → `A & B`. */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

/** Remove keys `K` from object type `O`. */
export type ExcludeKeys<O, K extends keyof any> = Omit<O, Extract<keyof O, K>>

/** Keys present in both `A` and `B`. */
export type OverlappingKeys<A, B> = Extract<keyof A, keyof B>

/** Properties of `A` whose keys are not in `B`. */
export type Only<A, B> = {
  [K in Exclude<keyof A, keyof B>]: A[K]
}

/** Symmetric difference: keys exclusive to `A` or `B`, not both. */
export type XOR<A, B> = Only<A, B> | Only<B, A>

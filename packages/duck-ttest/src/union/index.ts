/**
 * Transforms a union type `U` into an intersection of its members.
 *
 * @example
 * type U = { a: number } | { b: string }
 * type I = UnionToIntersection<U> // => { a: number } & { b: string }
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

/**
 * Removes the specified keys `K` from object type `O`.
 *
 * @example
 * type O = { a: string, b: number, c: boolean }
 * type R = ExcludeKeys<O, 'a' | 'c'> // => { b: number }
 */
export type ExcludeKeys<O, K extends keyof any> = Omit<O, Extract<keyof O, K>>

/**
 * Extracts the keys that are present in both object types `A` and `B`.
 *
 * @example
 * type A = { a: string, b: number }
 * type B = { b: boolean, c: string }
 * type R = OverlappingKeys<A, B> // => "b"
 */
export type OverlappingKeys<A, B> = Extract<keyof A, keyof B>

/**
 * Picks the keys from object `A` that are not present in object `B`.
 *
 * @example
 * type A = { a: number, b: string }
 * type B = { b: boolean, c: string }
 * type R = Only<A, B> // => { a: number }
 */
export type Only<A, B> = {
  [K in Exclude<keyof A, keyof B>]: A[K]
}

/**
 * Creates a type that represents the keys exclusive to `A` or `B`,
 * but not both (i.e., a "symmetric difference").
 *
 * @example
 * type A = { a: string, b: number }
 * type B = { b: number, c: boolean }
 * type R = XOR<A, B> // => { a: string } | { c: boolean }
 */
export type XOR<A, B> = Only<A, B> | Only<B, A>

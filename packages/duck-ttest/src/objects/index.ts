// 5. Set-like Operations on Object Types

/**
 * Flattens an intersection type into a plain object by remapping its properties.
 *
 * @template T - The intersection or object type to expand.
 * @returns A new object type with the same keys and value types as `T`, fully materialized.
 *
 * @example
 * type I = { a: 1 } & { b: 2 };
 * type E = Expand<I>; // { a: 1; b: 2 }
 */
export type Expand<T> = { [K in keyof T]: T[K] }

/**
 * Merges two object types, giving properties from `B` priority over `A`.
 *
 * @template A - The base object.
 * @template B - The overriding object.
 * @returns A new type containing all keys from `A` and `B`, where overlapping keys use the type from `B`.
 *
 * @example
 * type A = { a: 1; b: 2 };
 * type B = { b: 3; c: 4 };
 * type M = Merge<A, B>; // { a: 1; b: 3; c: 4 }
 */
export type Merge<A, B> = Expand<Omit<A, keyof B> & B>

/**
 * Produces a new object type by removing from `A` all keys that also appear in `B`.
 *
 * @template A - The source object.
 * @template B - The object whose keys should be excluded.
 * @returns An object type containing only the keys of `A` not present in `B`.
 *
 * @example
 * type A = { a: 1; b: 2; c: 3 };
 * type B = { b: any; d: any };
 * type D = Diff<A, B>; // { a: 1; c: 3 }
 */
export type Diff<A, B> = Omit<A, keyof B>

/**
 * Picks from `O` those properties whose value types extend `T`.
 *
 * @template O - The source object.
 * @template T - The value type to filter by.
 * @returns An object type containing only the properties of `O` with values assignable to `T`.
 *
 * @example
 * type O = { a: 1; b: 's'; c: 2 };
 * type P = PickByValue<O, number>; // { a: 1; c: 2 }
 */
export type PickByValue<O, T> = {
  [K in keyof O as O[K] extends T ? K : never]: O[K]
}

/**
 * Omits from `O` those properties whose value types extend `T`.
 *
 * @template O - The source object.
 * @template T - The value type to filter by.
 * @returns An object type containing only the properties of `O` whose values are *not* assignable to `T`.
 *
 * @example
 * type O = { a: 1; b: 's'; c: 2 };
 * type Q = OmitByValue<O, number>; // { b: 's' }
 */
export type OmitByValue<O, T> = {
  [K in keyof O as O[K] extends T ? never : K]: O[K]
}

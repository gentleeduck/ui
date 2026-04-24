/**
 * `Head<T>` extracts the first element type from a tuple `T`.
 *
 * @example
 * type First = Head<[1, 2, 3]>; // 1
 * type None = Head<[]>; // never
 */
export type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never

/**
 * `Tail<T>` extracts all but the first element of a tuple `T`.
 *
 * @example
 * type Rest = Tail<[1, 2, 3]>; // [2, 3]
 * type Empty = Tail<[]>; // never
 */
export type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never

/**
 * `Last<T>` extracts the last element type from a tuple `T`.
 *
 * @example
 * type LastOne = Last<[1, 2, 3]>; // 3
 * type None = Last<[]>; // never
 */
export type Last<T extends any[]> = T extends [...any[], infer L] ? L : never

/**
 * `Prepend<E, T>` adds an element `E` at the beginning of tuple `T`.
 *
 * @example
 * type WithFirst = Prepend<0, [1, 2, 3]>; // [0, 1, 2, 3]
 */
export type Prepend<E, T extends any[]> = [E, ...T]

/**
 * `Append<T, E>` adds an element `E` at the end of tuple `T`.
 *
 * @example
 * type WithLast = Append<[1, 2, 3], 4>; // [1, 2, 3, 4]
 */
export type Append<T extends any[], E> = [...T, E]

/**
 * `Length<T>` evaluates to the number of elements in tuple or array `T`.
 *
 * @example
 * type Size = Length<[1, 2, 3]>; // 3
 */
export type Length<T extends any[]> = T['length']

/**
 * `Zip<T, U>` combines two tuples `T` and `U` element-by-element into pairs.
 * Stops at the shorter of the two input tuples.
 *
 * @example
 * type Zipped = Zip<[1, 2], ['a', 'b']>; // [[1, 'a'], [2, 'b']]
 * type Uneven = Zip<[1, 2, 3], ['a']>;   // [[1, 'a']]
 */
export type Zip<T extends any[], U extends any[]> = T extends [infer T1, ...infer TR]
  ? U extends [infer U1, ...infer UR]
    ? [[T1, U1], ...Zip<TR, UR>]
    : []
  : []

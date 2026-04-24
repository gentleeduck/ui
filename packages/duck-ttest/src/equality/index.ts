// 2. Type Equality
/**
 * Equal<X, Y>
 * -----------------------------------------
 * Determines whether two types `X` and `Y` are identical.
 * Uses a clever trick with conditional types and generic function overloads
 * to compare type compatibility in both directions.
 *
 * @template X - The first type to compare.
 * @template Y - The second type to compare.
 *
 * @returns `true` if `X` and `Y` resolve to the same type, `false` otherwise.
 *
 * @example
 * // Basic primitives
 * type T1 = Equal<string, string>; // true
 * type T2 = Equal<string, number>; // false
 *
 * @example
 * // Object shape
 * type O1 = Equal<{ a: number }, { a: number }>; // true
 * type O2 = Equal<{ a: number }, { b: number }>; // false
 */
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

/**
 * NotEqual<X, Y>
 * -----------------------------------------
 * The logical inverse of `Equal<X, Y>`.
 * Yields `true` if `X` and `Y` are different types, `false` if they match.
 *
 * @template X - The first type.
 * @template Y - The second type.
 *
 * @example
 * type T = NotEqual<1, 2>; // true
 * type U = NotEqual<1, 1>; // false
 */
export type NotEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? false : true

/**
 * ShallowEqual<X, Y>
 * -----------------------------------------
 * Checks whether type `X` is assignable to type `Y`.
 * This is a one-way compatibility check (shallow), not bidirectional.
 *
 * @template X - Source type.
 * @template Y - Target type.
 *
 * @returns `true` if `X` extends `Y`, else `false`.
 *
 * @example
 * // X has fewer or equal keys than Y
 * type T = ShallowEqual<{ a: number }, { a: number; b?: string }>; // true
 * type U = ShallowEqual<{ a: string }, { a: number }>; // false
 */
export type ShallowEqual<X, Y> = X extends Y ? true : false

/**
 * ShallowNotEqual<X, Y>
 * -----------------------------------------
 * The inverse of `ShallowEqual<X, Y>`.
 */
export type ShallowNotEqual<X, Y> = X extends Y ? false : true

/**
 * HasKeyWithType<K, T, O>
 * -----------------------------------------
 * Validates that object `O` contains a property `K` whose type matches `T` exactly.
 * Useful to assert specific shapes in test suites.
 *
 * @template K - The key to look for (string literal).
 * @template T - The expected type of `O[K]`.
 * @template O - The object type to inspect.
 *
 * @returns `true` if `K` is in `keyof O` and `Equal<T, O[K]>` is `true`.
 *
 * @example
 * type Obj = { x: number; y: string };
 * type T1 = HasKeyWithType<'x', number, Obj>; // true
 * type T2 = HasKeyWithType<'x', string, Obj>; // false
 * type T3 = HasKeyWithType<'z', any, Obj>;     // false
 */
export type HasKeyWithType<K extends string, T, O> = K extends keyof O ? Equal<T, O[K]> : false

/**
 * HasKey<K, O>
 * -----------------------------------------
 * Checks if object type `O` has a property key `K`.
 *
 * @template K - The key to test (string literal).
 * @template O - The object to inspect.
 *
 * @returns `true` if `K` is in `keyof O`, else `false`.
 *
 * @example
 * type Obj = { foo: string };
 * type T1 = HasKey<'foo', Obj>; // true
 * type T2 = HasKey<'bar', Obj>; // false
 */
export type HasKey<K extends string, O> = K extends keyof O ? true : false

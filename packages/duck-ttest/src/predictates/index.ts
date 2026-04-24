import type { Equal } from '~/equality'

// 3. Type Predicates

/**
 * `IsMutable<T>` checks whether all properties of `T` are mutable (i.e., not marked as `readonly`).
 *
 * It works by comparing `T` with a version of `T` where all properties have had `readonly` removed.
 * If both types are equal, then `T` is fully mutable.
 *
 * @example
 * type A = { x: number };               // mutable
 * type B = { readonly x: number };     // readonly
 *
 * type Test1 = IsMutable<A>; // true
 * type Test2 = IsMutable<B>; // false
 */
export type IsMutable<T> = Equal<{ -readonly [K in keyof T]: T[K] }, T>

/**
 * `IsReadonly<T>` checks whether all properties of `T` are `readonly`.
 *
 * It works by comparing `T` to a `Readonly<T>` version of itself.
 * If both types are equal, all properties are readonly.
 *
 * @example
 * type A = { readonly x: number };     // readonly
 * type B = { x: number };              // mutable
 *
 * type Test1 = IsReadonly<A>; // true
 * type Test2 = IsReadonly<B>; // false
 */
export type IsReadonly<T> = Equal<T, Readonly<T>>

/**
 * `IsPartial<T>` checks whether all properties of `T` are optional (i.e., `?`).
 *
 * It does this by comparing `T` to a version of itself where all keys are made optional.
 * If both match, the original type was already fully optional.
 *
 * @example
 * type A = { x?: number; y?: string }; // fully optional
 * type B = { x: number };              // required
 *
 * type Test1 = IsPartial<A>; // true
 * type Test2 = IsPartial<B>; // false
 */
export type IsPartial<T> = Equal<{ [K in keyof T]?: T[K] }, T>

/**
 * `IsRequired<T>` checks whether all properties of `T` are required (i.e., not `?`).
 *
 * It works by comparing `T` to a version of itself where all keys are made required.
 * If both match, the original type was already fully required.
 *
 * @example
 * type A = { x: number; y: string };   // fully required
 * type B = { x?: number };             // optional
 *
 * type Test1 = IsRequired<A>; // true
 * type Test2 = IsRequired<B>; // false
 */
export type IsRequired<T> = Equal<{ [K in keyof T]-?: T[K] }, T>

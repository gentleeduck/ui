// 4. Key Extraction / Manipulation

import type { Equal } from '~/equality'

/**
 * KeysOfType<O, T>
 * -----------------------------------------
 * Extracts the keys from an object `O` whose property types extend `T`.
 *
 * @template O - The object to inspect.
 * @template T - The value type to match against.
 *
 * @returns A union of keys `K` in `O` for which `O[K]` extends `T`, or `never` if none.
 *
 * @example
 * type Obj = { a: number; b: string; c: number };
 * type NumKeys = KeysOfType<Obj, number>; // 'a' | 'c'
 * type StrKeys = KeysOfType<Obj, string>; // 'b'
 */
export type KeysOfType<O, T> = { [K in keyof O]: O[K] extends T ? K : never }[keyof O]

/**
 * OptionalKeys<T>
 * -----------------------------------------
 * Extracts the keys from `T` that are optional (i.e. may be omitted).
 *
 * @template T - The object type to analyze.
 *
 * @returns A union of keys in `T` where `T[K]` is optional, or `never` if none.
 *
 * @example
 * type Obj = { a?: number; b: string; c?: boolean };
 * type Opt = OptionalKeys<Obj>; // 'a' | 'c'
 */
export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T]

/**
 * RequiredKeys<T>
 * -----------------------------------------
 * Extracts the keys from `T` that are required (i.e. must be provided).
 *
 * @template T - The object type to analyze.
 *
 * @returns A union of keys in `T` where `T[K]` is required, or `never` if none.
 *
 * @example
 * type Obj = { a?: number; b: string; c?: boolean };
 * type Req = RequiredKeys<Obj>; // 'b'
 */
export type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>

/**
 * ReadonlyKeys<T>
 * -----------------------------------------
 * Extracts the keys from `T` that are marked `readonly`.
 *
 * @template T - The object type to analyze.
 *
 * @returns A union of keys in `T` where `T[K]` is readonly, or `never` if none.
 *
 * @example
 * type Obj = { readonly x: number; y: string };
 * type RO = ReadonlyKeys<Obj>; // 'x'
 */
export type ReadonlyKeys<T> = {
  [K in keyof T]-?: Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? K : never
}[keyof T]

/**
 * MutableKeys<T>
 * -----------------------------------------
 * Extracts the keys from `T` that are not `readonly` (i.e. mutable).
 *
 * @template T - The object type to analyze.
 *
 * @returns A union of keys in `T` where `T[K]` is mutable, or `never` if none.
 *
 * @example
 * type Obj = { readonly x: number; y: string };
 * type Mut = MutableKeys<Obj>; // 'y'
 */
export type MutableKeys<T> = Exclude<keyof T, ReadonlyKeys<T>>

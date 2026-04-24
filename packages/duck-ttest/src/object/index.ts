import type { Builtin } from '~/primitive'

/**
 * Flattens an intersection into a single object with the same keys and values.
 * Makes IDE hover output much nicer.
 *
 * @example
 * type A = Simplify<{ a: 1 } & { b: 2 }> // { a: 1; b: 2 }
 */
export type Simplify<T> = { [K in keyof T]: T[K] } & {}

/** Alias for `Simplify`. */
export type Prettify<T> = Simplify<T>

/**
 * Override properties of `A` with properties of `B`. Keys in `B` win.
 *
 * @example
 * type X = Override<{ a: 1; b: 2 }, { b: 'new'; c: 3 }> // { a: 1; b: 'new'; c: 3 }
 */
export type Override<A, B> = Simplify<Omit<A, keyof B> & B>

/** Alias for `Override`. */
export type Assign<A, B> = Override<A, B>

/**
 * Recursively makes every property optional.
 *
 * @example
 * type X = DeepPartial<{ a: { b: number } }> // { a?: { b?: number } }
 */
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends ReadonlyArray<infer U>
    ? Array<DeepPartial<U>>
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T

/**
 * Recursively makes every property required.
 */
export type DeepRequired<T> = T extends Builtin
  ? T
  : T extends ReadonlyArray<infer U>
    ? Array<DeepRequired<U>>
    : T extends object
      ? { [K in keyof T]-?: DeepRequired<T[K]> }
      : T

/**
 * Recursively marks every property as `readonly`.
 */
export type DeepReadonly<T> = T extends Builtin
  ? T
  : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T

/**
 * Recursively strips `readonly` from every property.
 */
export type DeepMutable<T> = T extends Builtin
  ? T
  : T extends ReadonlyArray<infer U>
    ? Array<DeepMutable<U>>
    : T extends object
      ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
      : T

/** Alias for `DeepMutable`. */
export type DeepWritable<T> = DeepMutable<T>

/**
 * Recursively removes `null | undefined` from every property value.
 */
export type DeepNonNullable<T> = T extends Builtin
  ? NonNullable<T>
  : T extends ReadonlyArray<infer U>
    ? Array<DeepNonNullable<U>>
    : T extends object
      ? { [K in keyof T]: DeepNonNullable<NonNullable<T[K]>> }
      : NonNullable<T>

/**
 * Strip `readonly` from every top-level property.
 */
export type Mutable<T> = { -readonly [K in keyof T]: T[K] }

/** Alias for `Mutable`. */
export type Writable<T> = Mutable<T>

/**
 * Marks a set of keys `K` as optional while leaving the rest untouched.
 *
 * @example
 * type X = PartialBy<{ a: 1; b: 2 }, 'b'> // { a: 1; b?: 2 }
 */
export type PartialBy<T, K extends keyof T> = Simplify<Omit<T, K> & Partial<Pick<T, K>>>

/**
 * Marks a set of keys `K` as required while leaving the rest untouched.
 */
export type RequiredBy<T, K extends keyof T> = Simplify<Omit<T, K> & Required<Pick<T, K>>>

/**
 * Marks a set of keys `K` as readonly while leaving the rest untouched.
 */
export type ReadonlyBy<T, K extends keyof T> = Simplify<Omit<T, K> & Readonly<Pick<T, K>>>

/**
 * Marks a set of keys `K` as mutable (strips readonly) while leaving the rest untouched.
 */
export type MutableBy<T, K extends keyof T> = Simplify<Omit<T, K> & Mutable<Pick<T, K>>>

/**
 * A stricter `Omit` that errors if `K` is not a real key of `T`.
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>

/**
 * A stricter `Pick` that errors if `K` is not a real key of `T`.
 */
export type StrictPick<T, K extends keyof T> = Pick<T, K>

/**
 * Union of all value types in `T`.
 *
 * @example
 * type X = ValueOf<{ a: 1; b: 'x' }> // 1 | 'x'
 */
export type ValueOf<T> = T[keyof T]

/**
 * Tuple of `[key, value]` pairs for the properties of `T`.
 *
 * @example
 * type X = Entries<{ a: 1; b: 2 }> // ['a', 1] | ['b', 2]
 */
export type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T]

/**
 * Build an object from a union of `[key, value]` pairs.
 *
 * @example
 * type X = FromEntries<['a', 1] | ['b', 2]> // { a: 1; b: 2 }
 */
export type FromEntries<T extends readonly [PropertyKey, unknown]> = {
  [K in T as K[0]]: K[1]
}

/**
 * Swap keys and values. Requires values to be valid `PropertyKey`s.
 *
 * @example
 * type X = Invert<{ a: 'x'; b: 'y' }> // { x: 'a'; y: 'b' }
 */
export type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T as T[K]]: K
}

/**
 * Rename one key in `T` from `From` to `To`.
 *
 * @example
 * type X = RenameKey<{ a: 1; b: 2 }, 'a', 'c'> // { c: 1; b: 2 }
 */
export type RenameKey<T, From extends keyof T, To extends PropertyKey> = Simplify<
  Omit<T, From> & { [K in To]: T[From] }
>

/**
 * Force `T` to contain at least one of the keys in `Keys`.
 *
 * @example
 * type X = RequireAtLeastOne<{ a?: 1; b?: 2; c?: 3 }, 'a' | 'b'>
 * // { a: 1; b?: 2; c?: 3 } | { a?: 1; b: 2; c?: 3 }
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Simplify<
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys] &
    Omit<T, Keys>
>

/**
 * Force `T` to contain exactly one of the keys in `Keys`.
 *
 * @example
 * type X = RequireExactlyOne<{ a?: 1; b?: 2; c?: 3 }, 'a' | 'b'>
 * // ({ a: 1; b?: never } | { a?: never; b: 2 }) & { c?: 3 }
 */
export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = Simplify<
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>
  }[Keys] &
    Omit<T, Keys>
>

/**
 * Force `T` to contain either all of `Keys` or none of them.
 */
export type RequireAllOrNone<T, Keys extends keyof T = keyof T> = Simplify<
  (Required<Pick<T, Keys>> | Partial<Record<Keys, never>>) & Omit<T, Keys>
>

/**
 * `T` narrowed to require it be non-empty.
 */
export type NonEmptyObject<T> = keyof T extends never ? never : T

/**
 * Pick keys from deeply-nested `T` at a single dotted path.
 *
 * @example
 * type X = DeepPick<{ a: { b: { c: 1; d: 2 } } }, 'a.b.c'>
 * // { a: { b: { c: 1 } } }
 */
export type DeepPick<T, Path extends string> = Path extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? { [K in Head]: DeepPick<T[Head], Rest> }
    : never
  : Path extends keyof T
    ? { [K in Path]: T[Path] }
    : never

/**
 * Remove a deeply-nested key from `T` at a single dotted path.
 */
export type DeepOmit<T, Path extends string> = Path extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? Simplify<Omit<T, Head> & { [K in Head]: DeepOmit<T[Head], Rest> }>
    : T
  : Path extends keyof T
    ? Omit<T, Path>
    : T

/**
 * Get the value at a dotted path into `T`, or `undefined` if missing.
 *
 * @example
 * type X = Get<{ a: { b: { c: number } } }, 'a.b.c'> // number
 */
export type Get<T, Path extends string> = Path extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? Get<T[Head], Rest>
    : undefined
  : Path extends keyof T
    ? T[Path]
    : undefined

/**
 * All possible dotted paths into `T`, as a union of strings.
 */
export type Paths<T, D extends number = 6> = [D] extends [0]
  ? never
  : T extends Builtin
    ? never
    : T extends object
      ? {
          [K in keyof T & (string | number)]: T[K] extends Builtin
            ? `${K}`
            : T[K] extends object
              ? `${K}` | `${K}.${Paths<T[K], Prev<D>>}`
              : `${K}`
        }[keyof T & (string | number)]
      : never

// biome-ignore lint/correctness/noUnusedVariables: depth counter helper
type Prev<N extends number> = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9][N]

// -----------------------------------------------------------------------------
// type-fest-flavor extensions
// -----------------------------------------------------------------------------

/**
 * Strict `Omit` that errors when a key is unknown. `Except<T, K>` is equivalent
 * to `Omit<T, K>` except that `K` is constrained to `keyof T`.
 */
export type Except<T, K extends keyof T> = Omit<T, K>

/**
 * Recursively merge `A` and `B`. Properties from `B` override properties
 * from `A`; when both sides are plain objects, they merge recursively.
 */
export type MergeDeep<A, B> = A extends Builtin
  ? B
  : B extends Builtin
    ? B
    : {
        [K in keyof A | keyof B]: K extends keyof B
          ? K extends keyof A
            ? MergeDeep<A[K], B[K]>
            : B[K]
          : K extends keyof A
            ? A[K]
            : never
      }

/**
 * Override `A` with `B` where every key in `B` must already exist in `A`.
 *
 * @example
 * type X = OverrideProperties<{ a: 1; b: 2 }, { b: 'x' }> // { a: 1; b: 'x' }
 */
export type OverrideProperties<A, B extends Partial<Record<keyof A, unknown>>> = Simplify<
  Omit<A, keyof B> & { [K in keyof B]: B[K] }
>

/**
 * Require zero or one of the keys in `Keys`. Disallows combinations.
 */
export type RequireOneOrNone<T, Keys extends keyof T = keyof T> = Simplify<
  | Partial<Record<Keys, never>>
  | {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>
    }[Keys]
> &
  Omit<T, Keys>

/**
 * Drop the index signature from an object type, keeping only explicit keys.
 */
export type OmitIndexSignature<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : symbol extends K ? never : K]: T[K]
}

/**
 * Keep only the index signature from an object type, dropping explicit keys.
 */
export type PickIndexSignature<T> = {
  [K in keyof T as string extends K ? K : number extends K ? K : symbol extends K ? K : never]: T[K]
}

/**
 * Union of every key present in any member of a union of objects.
 *
 * @example
 * type U = { a: 1 } | { b: 2 } | { a: 3; c: 4 }
 * type X = KeysOfUnion<U> // 'a' | 'b' | 'c'
 */
export type KeysOfUnion<T> = T extends unknown ? keyof T : never

/**
 * Replace every leaf value in `T` with `V` recursively, preserving structure.
 */
export type Schema<T, V> = T extends Builtin
  ? V
  : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<Schema<U, V>>
    : T extends object
      ? { [K in keyof T]: Schema<T[K], V> }
      : V

// Aliases matching type-fest naming
/** Alias for `PartialBy`. */
export type SetOptional<T, K extends keyof T> = PartialBy<T, K>
/** Alias for `RequiredBy`. */
export type SetRequired<T, K extends keyof T> = RequiredBy<T, K>
/** Alias for `ReadonlyBy`. */
export type SetReadonly<T, K extends keyof T> = ReadonlyBy<T, K>
/** Alias for `MutableBy`. */
export type SetMutable<T, K extends keyof T> = MutableBy<T, K>

// -----------------------------------------------------------------------------
// Value-based filters
// -----------------------------------------------------------------------------

/**
 * Remove properties whose value is `never`.
 *
 * @example
 * type X = OmitNever<{ a: 1; b: never; c: 3 }> // { a: 1; c: 3 }
 */
export type OmitNever<T> = { [K in keyof T as [T[K]] extends [never] ? never : K]: T[K] }

/**
 * Remove properties whose value is assignable to `V`. Same behavior as
 * `OmitByValue` but emphasized as the "filter-by-value" primitive.
 */
export type Without<T, V> = { [K in keyof T as T[K] extends V ? never : K]: T[K] }

/**
 * Replace all property values of type `From` with `To`.
 *
 * @example
 * type X = ReplaceValue<{ a: string; b: number; c: string }, string, boolean>
 * // { a: boolean; b: number; c: boolean }
 */
export type ReplaceValue<T, From, To> = { [K in keyof T]: T[K] extends From ? To : T[K] }

/**
 * Pick the required properties of `T`.
 */
export type PickRequired<T> = { [K in keyof T as {} extends Pick<T, K> ? never : K]: T[K] }

/**
 * Pick the optional properties of `T`.
 */
export type PickOptional<T> = { [K in keyof T as {} extends Pick<T, K> ? K : never]?: T[K] }

/**
 * Alias of `PickByValue` — filter to only keys whose value extends `U`.
 */
export type ConditionalPick<T, U> = { [K in keyof T as T[K] extends U ? K : never]: T[K] }

/**
 * Alias of `OmitByValue` — filter OUT keys whose value extends `U`.
 */
export type ConditionalExcept<T, U> = { [K in keyof T as T[K] extends U ? never : K]: T[K] }

/**
 * Mutually-exclusive merge — allow `A` OR `B`, not both.
 *
 * @example
 * type X = MergeExclusive<{ a: 1 }, { b: 2 }>
 * // { a: 1; b?: never } | { a?: never; b: 2 }
 */
export type MergeExclusive<A, B> =
  | (A & { [K in Exclude<keyof B, keyof A>]?: never })
  | (B & { [K in Exclude<keyof A, keyof B>]?: never })

// -----------------------------------------------------------------------------
// Key-case transforms (shallow + deep)
// -----------------------------------------------------------------------------

/**
 * Transform every key of `T` using the built-in string-manipulation utility `Fn`.
 * `Fn` is one of the template-literal helpers: `Uppercase`, `Lowercase`,
 * `Capitalize`, `Uncapitalize`, or one of the case utilities from `~/template`.
 */
type MapKeys<T, F extends (s: string) => string> = {
  // biome-ignore lint/suspicious/noExplicitAny: conditional mapping needs any
  [K in keyof T as K extends string ? ReturnType<F & ((s: K) => any)> : K]: T[K]
}

/** Shallow camelCase keys. Signature is symbolic; use `CamelCaseKeys` at type-level. */
export type CamelCaseKeys<T> = {
  [K in keyof T as K extends string ? _Camel<K> : K]: T[K]
}

/** Shallow PascalCase keys. */
export type PascalCaseKeys<T> = {
  [K in keyof T as K extends string ? _Pascal<K> : K]: T[K]
}

/** Shallow snake_case keys. */
export type SnakeCaseKeys<T> = {
  [K in keyof T as K extends string ? _Snake<K> : K]: T[K]
}

/** Shallow kebab-case keys. */
export type KebabCaseKeys<T> = {
  [K in keyof T as K extends string ? _Kebab<K> : K]: T[K]
}

/** Deep recursive camelCase keys — recurses into object-valued properties. */
export type DeepCamelCaseKeys<T> = T extends Builtin
  ? T
  : T extends ReadonlyArray<infer U>
    ? Array<DeepCamelCaseKeys<U>>
    : T extends object
      ? {
          [K in keyof T as K extends string ? _Camel<K> : K]: DeepCamelCaseKeys<T[K]>
        }
      : T

/** Deep PascalCase keys. */
export type DeepPascalCaseKeys<T> = T extends Builtin
  ? T
  : T extends ReadonlyArray<infer U>
    ? Array<DeepPascalCaseKeys<U>>
    : T extends object
      ? {
          [K in keyof T as K extends string ? _Pascal<K> : K]: DeepPascalCaseKeys<T[K]>
        }
      : T

/** Deep snake_case keys. */
export type DeepSnakeCaseKeys<T> = T extends Builtin
  ? T
  : T extends ReadonlyArray<infer U>
    ? Array<DeepSnakeCaseKeys<U>>
    : T extends object
      ? {
          [K in keyof T as K extends string ? _Snake<K> : K]: DeepSnakeCaseKeys<T[K]>
        }
      : T

/** Deep kebab-case keys. */
export type DeepKebabCaseKeys<T> = T extends Builtin
  ? T
  : T extends ReadonlyArray<infer U>
    ? Array<DeepKebabCaseKeys<U>>
    : T extends object
      ? {
          [K in keyof T as K extends string ? _Kebab<K> : K]: DeepKebabCaseKeys<T[K]>
        }
      : T

// Inlined case helpers (mirror ~/template but scoped to avoid a cross-module dep)
type _Words<S extends string> = _SplitCase<_SplitDelim<S>>
type _SplitDelim<
  S extends string,
  Acc extends string = '',
  Out extends string[] = [],
> = S extends `${infer H}${infer R}`
  ? H extends '_' | '-' | ' '
    ? _SplitDelim<R, '', Acc extends '' ? Out : [...Out, Acc]>
    : _SplitDelim<R, `${Acc}${H}`, Out>
  : Acc extends ''
    ? Out
    : [...Out, Acc]
type _SplitCase<T extends readonly string[]> = T extends readonly [infer H extends string, ...infer R extends string[]]
  ? [..._SplitWord<H>, ..._SplitCase<R>]
  : []
type _SplitWord<S extends string, Acc extends string = ''> = S extends `${infer H}${infer R}`
  ? H extends Uppercase<H>
    ? H extends Lowercase<H>
      ? _SplitWord<R, `${Acc}${H}`>
      : Acc extends ''
        ? _SplitWord<R, H>
        : [Acc, ..._SplitWord<`${H}${R}`>]
    : _SplitWord<R, `${Acc}${H}`>
  : Acc extends ''
    ? []
    : [Acc]
type _JoinLower<T extends readonly string[], Sep extends string> = T extends [
  infer H extends string,
  ...infer R extends string[],
]
  ? R extends []
    ? Lowercase<H>
    : `${Lowercase<H>}${Sep}${_JoinLower<R, Sep>}`
  : ''
type _PascalJoin<T extends readonly string[]> = T extends [infer H extends string, ...infer R extends string[]]
  ? `${Capitalize<Lowercase<H>>}${_PascalJoin<R>}`
  : ''
type _Camel<S extends string> =
  _Words<S> extends [infer H extends string, ...infer R extends string[]] ? `${Lowercase<H>}${_PascalJoin<R>}` : S
type _Pascal<S extends string> = _PascalJoin<_Words<S>>
type _Snake<S extends string> = _JoinLower<_Words<S>, '_'>
type _Kebab<S extends string> = _JoinLower<_Words<S>, '-'>

// -----------------------------------------------------------------------------
// Key / value access helpers
// -----------------------------------------------------------------------------

/**
 * Merge a tuple of objects left-to-right, with later entries overriding earlier ones.
 *
 * @example
 * type X = MergeAll<[{ a: 1 }, { b: 2 }, { a: 'x' }]> // { a: 'x'; b: 2 }
 */
export type MergeAll<T extends readonly object[]> = T extends readonly [infer H, ...infer R]
  ? R extends readonly object[]
    ? Override<H, MergeAll<R>>
    : H
  : {}

/**
 * Shorthand for `T[K]`.
 */
export type Pluck<T, K extends keyof T> = T[K]

/**
 * Replace the type of a single key `K` in `T` with `V`.
 *
 * @example
 * type X = SetKeyType<{ a: number; b: string }, 'a', boolean>
 * // { a: boolean; b: string }
 */
export type SetKeyType<T, K extends keyof T, V> = Simplify<Omit<T, K> & { [P in K]: V }>

/**
 * Union of keys present in both `A` and `B`.
 */
export type SharedKeys<A, B> = Extract<keyof A, keyof B>

/**
 * Keys of `A` not present in `B`.
 */
export type DiffKeys<A, B> = Exclude<keyof A, keyof B>

/**
 * Alias of `ConditionalPick` — filter to only keys whose value extends `U`.
 */
export type PickByType<T, U> = ConditionalPick<T, U>

/**
 * Alias of `ConditionalExcept` — filter OUT keys whose value extends `U`.
 */
export type OmitByType<T, U> = ConditionalExcept<T, U>

/**
 * Replace every property value of type `From` with `To`, recursively.
 *
 * @example
 * type X = DeepReplaceValue<{ a: string; b: { c: string } }, string, number>
 * // { a: number; b: { c: number } }
 */
export type DeepReplaceValue<T, From, To> = T extends Builtin
  ? T extends From
    ? To
    : T
  : T extends ReadonlyArray<infer U>
    ? Array<DeepReplaceValue<U, From, To>>
    : T extends object
      ? { [K in keyof T]: DeepReplaceValue<T[K], From, To> }
      : T extends From
        ? To
        : T

/**
 * `true` if `A` and `B` have exactly the same keys.
 */
export type HasSameKeys<A, B> = [keyof A] extends [keyof B] ? ([keyof B] extends [keyof A] ? true : false) : false

/**
 * The set of keys common to every object in a union.
 */
export type CommonKeys<U> = (U extends unknown ? (k: keyof U) => void : never) extends (k: infer K) => void ? K : never

// -----------------------------------------------------------------------------
// Distributive and empty-object helpers
// -----------------------------------------------------------------------------

/**
 * Extract keys from `T` whose value type matches `Condition`. Alias of the
 * `KeysOfType` in `~/extraction` — provided here for type-fest-style naming.
 *
 * @example
 * type X = ConditionalKeys<{ a: number; b: string; c: number }, number>
 * // 'a' | 'c'
 */
export type ConditionalKeys<T, Condition> = { [K in keyof T]: T[K] extends Condition ? K : never }[keyof T]

/**
 * `Omit` that distributes over union members. TypeScript's built-in `Omit`
 * collapses a discriminated union; `DistributedOmit` preserves each branch.
 *
 * @example
 * type U = { type: 'a'; a: 1; shared: true } | { type: 'b'; b: 2; shared: true }
 * type A = Omit<U, 'shared'>            // collapses — loses the tag discriminator
 * type B = DistributedOmit<U, 'shared'> // { type: 'a'; a: 1 } | { type: 'b'; b: 2 }
 */
export type DistributedOmit<T, K extends keyof any> = T extends unknown ? Omit<T, K> : never

/**
 * `Pick` that distributes over union members. Preserves each variant's shape
 * where TypeScript's built-in `Pick` would collapse them.
 */
export type DistributedPick<T, K extends keyof any> = T extends unknown ? Pick<T, K & keyof T> : never

/**
 * Nominal empty object — strictly `{}` with no properties. Unlike the literal
 * `{}` type (which accepts any non-nullish value), this is inhabited only by
 * records with zero own enumerable keys.
 */
export type EmptyObject = Record<PropertyKey, never>

/**
 * `Record<PropertyKey, unknown>` — the ergonomic "any record" type. Preferred
 * over `Record<string, any>` for generic constraints since it doesn't
 * accidentally allow arrays or functions.
 */
export type UnknownRecord = Record<PropertyKey, unknown>

/**
 * `true` if `T` has no own keys (i.e. is structurally `{}` or `Record<_, never>`).
 */
export type IsEmptyRecord<T> = keyof T extends never ? true : false

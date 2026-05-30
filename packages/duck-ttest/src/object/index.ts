import type { Builtin } from '~/primitive'

/**
 * Flatten an intersection into a single object — improves IDE hover output.
 * `Simplify<{ a: 1 } & { b: 2 }>` → `{ a: 1; b: 2 }`
 */
export type Simplify<T> = { [K in keyof T]: T[K] } & {}

// --- aliases (prefer the canonical names above; these exist for type-fest / ts-toolbelt parity) ---

/** Alias of `Simplify`; matches type-fest naming. Prefer `Simplify`. */
export type Prettify<T> = Simplify<T>

/** Override properties of `A` with properties of `B`; keys in `B` win. */
export type Override<A, B> = Simplify<Omit<A, keyof B> & B>

export type Assign<A, B> = Override<A, B>

/** Recursively makes every property optional. */
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends ReadonlyArray<infer U>
    ? Array<DeepPartial<U>>
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T

/** Recursively makes every property required. */
export type DeepRequired<T> = T extends Builtin
  ? T
  : T extends ReadonlyArray<infer U>
    ? Array<DeepRequired<U>>
    : T extends object
      ? { [K in keyof T]-?: DeepRequired<T[K]> }
      : T

/** Recursively marks every property as `readonly`. */
export type DeepReadonly<T> = T extends Builtin
  ? T
  : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T

/** Recursively strips `readonly` from every property. */
export type DeepMutable<T> = T extends Builtin
  ? T
  : T extends ReadonlyArray<infer U>
    ? Array<DeepMutable<U>>
    : T extends object
      ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
      : T

export type DeepWritable<T> = DeepMutable<T>

/** Recursively removes `null | undefined` from every property value. */
export type DeepNonNullable<T> = T extends Builtin
  ? NonNullable<T>
  : T extends ReadonlyArray<infer U>
    ? Array<DeepNonNullable<U>>
    : T extends object
      ? { [K in keyof T]: DeepNonNullable<NonNullable<T[K]>> }
      : NonNullable<T>

/** Strip `readonly` from every top-level property. */
export type Mutable<T> = { -readonly [K in keyof T]: T[K] }

export type Writable<T> = Mutable<T>

/** Mark keys `K` as optional, leave others untouched. */
export type PartialBy<T, K extends keyof T> = Simplify<Omit<T, K> & Partial<Pick<T, K>>>

/** Mark keys `K` as required, leave others untouched. */
export type RequiredBy<T, K extends keyof T> = Simplify<Omit<T, K> & Required<Pick<T, K>>>

/** Mark keys `K` as readonly, leave others untouched. */
export type ReadonlyBy<T, K extends keyof T> = Simplify<Omit<T, K> & Readonly<Pick<T, K>>>

/** Strip `readonly` from keys `K`, leave others untouched. */
export type MutableBy<T, K extends keyof T> = Simplify<Omit<T, K> & Mutable<Pick<T, K>>>

/** `Omit` that errors if `K` is not a real key of `T`. */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>

/** `Pick` that errors if `K` is not a real key of `T`. */
export type StrictPick<T, K extends keyof T> = Pick<T, K>

/** Union of all value types in `T`. */
export type ValueOf<T> = T[keyof T]

/** Tuple of `[key, value]` pairs for the properties of `T`. */
export type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T]

/** Build an object from a union of `[key, value]` pairs. */
export type FromEntries<T extends readonly [PropertyKey, unknown]> = {
  [K in T as K[0]]: K[1]
}

/** Swap keys and values. Values must be valid `PropertyKey`s. */
export type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T as T[K]]: K
}

/** Rename one key in `T` from `From` to `To`. */
export type RenameKey<T, From extends keyof T, To extends PropertyKey> = Simplify<
  Omit<T, From> & { [K in To]: T[From] }
>

/**
 * Force `T` to contain at least one of the keys in `Keys`.
 * `RequireAtLeastOne<{ a?: 1; b?: 2; c?: 3 }, 'a' | 'b'>`
 * → `{ a: 1; b?: 2; c?: 3 } | { a?: 1; b: 2; c?: 3 }`
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Simplify<
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys] &
    Omit<T, Keys>
>

/**
 * Force `T` to contain exactly one of the keys in `Keys`.
 * `RequireExactlyOne<{ a?: 1; b?: 2; c?: 3 }, 'a' | 'b'>`
 * → `({ a: 1; b?: never } | { a?: never; b: 2 }) & { c?: 3 }`
 */
export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = Simplify<
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>
  }[Keys] &
    Omit<T, Keys>
>

/** Force `T` to contain either all of `Keys` or none. */
export type RequireAllOrNone<T, Keys extends keyof T = keyof T> = Simplify<
  (Required<Pick<T, Keys>> | Partial<Record<Keys, never>>) & Omit<T, Keys>
>

export type NonEmptyObject<T> = keyof T extends never ? never : T

/** Pick from deeply-nested `T` at a dotted path. `'a.b.c'` → `{ a: { b: { c: ... } } }`. */
export type DeepPick<T, Path extends string> = Path extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? { [K in Head]: DeepPick<T[Head], Rest> }
    : never
  : Path extends keyof T
    ? { [K in Path]: T[Path] }
    : never

/** Remove a deeply-nested key from `T` at a dotted path. */
export type DeepOmit<T, Path extends string> = Path extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? Simplify<Omit<T, Head> & { [K in Head]: DeepOmit<T[Head], Rest> }>
    : T
  : Path extends keyof T
    ? Omit<T, Path>
    : T

/** Value at a dotted path into `T`, or `undefined` if missing. */
export type Get<T, Path extends string> = Path extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? Get<T[Head], Rest>
    : undefined
  : Path extends keyof T
    ? T[Path]
    : undefined

/**
 * Union of all dotted paths into `T`.
 * @remarks Depth-capped at `D = 6` by default; deeper paths silently return `never`.
 *   Lower `D` for very wide objects to control type-checker cost on
 *   `KebabCaseKeys`/`DeepCamelCaseKeys`-style consumers.
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

/** Strict `Omit`: `K` is constrained to `keyof T`. */
export type Except<T, K extends keyof T> = Omit<T, K>

/** Recursively merge `A` and `B`; `B` wins on conflicts, plain objects merge. */
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

/** Override `A` with `B`; every key in `B` must already exist in `A`. */
export type OverrideProperties<A, B extends Partial<Record<keyof A, unknown>>> = Simplify<
  Omit<A, keyof B> & { [K in keyof B]: B[K] }
>

/** Require zero or one of the keys in `Keys`. Disallows combinations. */
export type RequireOneOrNone<T, Keys extends keyof T = keyof T> = Simplify<
  | Partial<Record<Keys, never>>
  | {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>
    }[Keys]
> &
  Omit<T, Keys>

/** Drop the index signature, keeping only explicit keys. */
export type OmitIndexSignature<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : symbol extends K ? never : K]: T[K]
}

/** Keep only the index signature, dropping explicit keys. */
export type PickIndexSignature<T> = {
  [K in keyof T as string extends K ? K : number extends K ? K : symbol extends K ? K : never]: T[K]
}

/** Union of every key present in any member of a union of objects. */
export type KeysOfUnion<T> = T extends unknown ? keyof T : never

/** Replace every leaf value in `T` with `V` recursively, preserving structure. */
export type Schema<T, V> = T extends Builtin
  ? V
  : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<Schema<U, V>>
    : T extends object
      ? { [K in keyof T]: Schema<T[K], V> }
      : V

export type SetOptional<T, K extends keyof T> = PartialBy<T, K>
export type SetRequired<T, K extends keyof T> = RequiredBy<T, K>
export type SetReadonly<T, K extends keyof T> = ReadonlyBy<T, K>
export type SetMutable<T, K extends keyof T> = MutableBy<T, K>

/** Remove properties whose value is `never`. */
export type OmitNever<T> = { [K in keyof T as [T[K]] extends [never] ? never : K]: T[K] }

/** Remove properties whose value is assignable to `V`. */
export type Without<T, V> = { [K in keyof T as T[K] extends V ? never : K]: T[K] }

/** Replace property values of type `From` with `To`. */
export type ReplaceValue<T, From, To> = { [K in keyof T]: T[K] extends From ? To : T[K] }

/** Pick the required properties of `T`. */
export type PickRequired<T> = { [K in keyof T as {} extends Pick<T, K> ? never : K]: T[K] }

/** Pick the optional properties of `T`. */
export type PickOptional<T> = { [K in keyof T as {} extends Pick<T, K> ? K : never]?: T[K] }

/** Filter to keys whose value extends `U`. */
export type ConditionalPick<T, U> = { [K in keyof T as T[K] extends U ? K : never]: T[K] }

/** Filter out keys whose value extends `U`. */
export type ConditionalExcept<T, U> = { [K in keyof T as T[K] extends U ? never : K]: T[K] }

/** Mutually-exclusive merge — `A` xor `B`. */
export type MergeExclusive<A, B> =
  | (A & { [K in Exclude<keyof B, keyof A>]?: never })
  | (B & { [K in Exclude<keyof A, keyof B>]?: never })

/** Shallow camelCase keys. */
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

/** Deep camelCase keys — recurses into object-valued properties. */
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

// Inlined to avoid cross-module dep on ~/template.
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

/** Merge a tuple of objects left-to-right; later entries override earlier. */
export type MergeAll<T extends readonly object[]> = T extends readonly [infer H, ...infer R]
  ? R extends readonly object[]
    ? Override<H, MergeAll<R>>
    : H
  : {}

/** Shorthand for `T[K]`. */
export type Pluck<T, K extends keyof T> = T[K]

/** Replace the type of key `K` in `T` with `V`. */
export type SetKeyType<T, K extends keyof T, V> = Simplify<Omit<T, K> & { [P in K]: V }>

/** Keys present in both `A` and `B`. */
export type SharedKeys<A, B> = Extract<keyof A, keyof B>

/** Keys of `A` not present in `B`. */
export type DiffKeys<A, B> = Exclude<keyof A, keyof B>

export type PickByType<T, U> = ConditionalPick<T, U>
export type OmitByType<T, U> = ConditionalExcept<T, U>

/** Replace values of type `From` with `To`, recursively. */
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

/** `true` if `A` and `B` have exactly the same keys. */
export type HasSameKeys<A, B> = [keyof A] extends [keyof B] ? ([keyof B] extends [keyof A] ? true : false) : false

/** Keys common to every object in a union. */
export type CommonKeys<U> = (U extends unknown ? (k: keyof U) => void : never) extends (k: infer K) => void ? K : never

/** Extract keys from `T` whose value matches `Condition`. */
export type ConditionalKeys<T, Condition> = { [K in keyof T]: T[K] extends Condition ? K : never }[keyof T]

/**
 * `Omit` that distributes over union members; preserves each branch.
 * TS built-in `Omit` collapses discriminated unions — this does not.
 */
export type DistributedOmit<T, K extends keyof any> = T extends unknown ? Omit<T, K> : never

/** `Pick` that distributes over union members; preserves each variant. */
export type DistributedPick<T, K extends keyof any> = T extends unknown ? Pick<T, K & keyof T> : never

/**
 * Nominal empty object — inhabited only by records with zero own keys.
 * Unlike the literal `{}` (which accepts any non-nullish).
 */
export type EmptyObject = Record<PropertyKey, never>

/**
 * Ergonomic "any record". Preferred over `Record<string, any>` for generic
 * constraints since it does not accidentally allow arrays or functions.
 */
export type UnknownRecord = Record<PropertyKey, unknown>

/** `true` if `T` has no own keys. */
export type IsEmptyRecord<T> = keyof T extends never ? true : false

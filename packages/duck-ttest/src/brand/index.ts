// Nominal typing via a phantom tag holding both base type and brand name.
// Inferring base type from `T & {...}` is unreliable when `T` is a primitive,
// so we stash the base inside the tag for `Unbrand` / `BrandOf` to recover.

declare const BRAND: unique symbol

interface __Tag<Base, B> {
  readonly [BRAND]: { readonly base: Base; readonly brand: B }
}

/** Nominal wrapper: `Brand<string, 'UserId'>` is incompatible with `Brand<string, 'OrderId'>`. */
export type Brand<T, B extends string | symbol> = T & __Tag<T, B>

export type Branded<T, B extends string | symbol> = Brand<T, B>

/** Strip the brand, recovering `T`. */
export type Unbrand<T> = T extends __Tag<infer U, any> ? U : T

/** Brand with a custom `__${Tag}` discriminant key for third-party integrations. */
export type Tagged<T, Tag extends string, TagValue = unknown> = T & { readonly [K in `__${Tag}`]: TagValue }

/** Opaque alias of `T`. Semantically identical to `Brand<T, B>`. */
export type Opaque<T, B extends string | symbol = string> = Brand<T, B>

export type Nominal<T, B extends string | symbol> = Brand<T, B>

/** Brand tag of a branded `T`, or `never`. */
export type BrandOf<T> = T extends __Tag<any, infer B> ? B : never

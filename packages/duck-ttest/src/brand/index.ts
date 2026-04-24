// Brand / nominal / opaque type utilities
//
// Nominal typing simulated via a phantom tag object. The tag carries both the
// base type and the brand name so `Unbrand` and `BrandOf` can recover them
// reliably — inferring directly from `T & {...}` intersections is unreliable
// when `T` is a primitive, so we stash the base type inside the tag.

declare const BRAND: unique symbol

interface __Tag<Base, B> {
  readonly [BRAND]: { readonly base: Base; readonly brand: B }
}

/**
 * Nominal wrapper around `T` tagged with `B`. Two brands with different tags
 * are structurally incompatible even when their underlying types match.
 *
 * @example
 * type UserId = Brand<string, 'UserId'>
 * type OrderId = Brand<string, 'OrderId'>
 *
 * const u = 'u1' as UserId
 * const o: OrderId = u // ❌ Type 'UserId' is not assignable to type 'OrderId'
 */
export type Brand<T, B extends string | symbol> = T & __Tag<T, B>

/** Alias for `Brand`. */
export type Branded<T, B extends string | symbol> = Brand<T, B>

/**
 * Strip the brand off a `Brand<T, B>`, returning the underlying `T`.
 */
export type Unbrand<T> = T extends __Tag<infer U, any> ? U : T

/**
 * Variation of `Brand` with a custom string tag key — useful when integrating
 * with third-party branded types that use their own discriminant property.
 *
 * @example
 * type U = Tagged<string, 'kind', 'user'>
 * type K = U['__kind'] // 'user'
 */
export type Tagged<T, Tag extends string, TagValue = unknown> = T & { readonly [K in `__${Tag}`]: TagValue }

/**
 * Fully opaque alias of `T`: structural identity comes only from the brand tag.
 * Semantically identical to `Brand<T, B>`; named for intent.
 */
export type Opaque<T, B extends string | symbol = string> = Brand<T, B>

/** Alias matching the `type-fest` naming convention. */
export type Nominal<T, B extends string | symbol> = Brand<T, B>

/**
 * Extract the brand tag from a branded type, or `never` if not branded.
 */
export type BrandOf<T> = T extends __Tag<any, infer B> ? B : never

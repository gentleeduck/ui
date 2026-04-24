// Discriminated-union helpers
//
// A discriminated union is a union of object types that share a common
// literal-typed "tag" property (e.g. `type`, `kind`). These utilities
// work on such unions by tag.

/**
 * Narrow a discriminated union `U` to the variant where the tag property
 * `K` equals `V`.
 *
 * @example
 * type Event =
 *   | { type: 'click'; x: number; y: number }
 *   | { type: 'keypress'; key: string }
 *
 * type Click = NarrowByTag<Event, 'type', 'click'>
 * // { type: 'click'; x: number; y: number }
 */
export type NarrowByTag<U, K extends keyof U, V> = U extends { [P in K]: V } ? U : never

/**
 * Remove the tag property from every variant of a discriminated union `U`.
 *
 * @example
 * type Event =
 *   | { type: 'click'; x: number }
 *   | { type: 'keypress'; key: string }
 * type Untagged = OmitTag<Event, 'type'>
 * // { x: number } | { key: string }
 */
export type OmitTag<U, K extends keyof U> = U extends unknown ? Omit<U, K> : never

/**
 * Union of all tag values in the `K` slot of `U`.
 *
 * @example
 * type Event = { type: 'click' } | { type: 'keypress' } | { type: 'resize' }
 * type Tags = TagsOf<Event, 'type'> // 'click' | 'keypress' | 'resize'
 */
export type TagsOf<U, K extends keyof U> = U extends unknown ? U[K] : never

/**
 * Extract the payload (tag-stripped variant) whose tag is `V`.
 *
 * @example
 * type Event =
 *   | { type: 'click'; x: number }
 *   | { type: 'keypress'; key: string }
 * type Payload = PayloadOf<Event, 'type', 'click'>
 * // { x: number }
 */
export type PayloadOf<U, K extends keyof U, V> = OmitTag<NarrowByTag<U, K, V>, K>

/**
 * `true` if `U` is a proper discriminated union on tag key `K` — that is,
 * `U` has two or more members with distinct tag values at `K`.
 */
export type IsDiscriminated<U, K extends keyof U> = _IsUnion<TagsOf<U, K>>

type _IsUnion<T, C = T> = [T] extends [never] ? false : T extends any ? ([C] extends [T] ? false : true) : false

/**
 * Build a pattern-matching handler object from a discriminated union.
 *
 * @example
 * type Event =
 *   | { type: 'click'; x: number }
 *   | { type: 'keypress'; key: string }
 *
 * type Handlers<R> = Matchers<Event, 'type', R>
 * // {
 * //   click:    (e: { type: 'click'; x: number }) => R
 * //   keypress: (e: { type: 'keypress'; key: string }) => R
 * // }
 */
export type Matchers<U, K extends keyof U, R> = {
  [V in U extends unknown ? U[K] & PropertyKey : never]: (variant: NarrowByTag<U, K, V>) => R
}

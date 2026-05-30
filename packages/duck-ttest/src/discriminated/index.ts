// Helpers for unions of objects sharing a literal "tag" key (`type`, `kind`, ...).

/** Narrow `U` to the variant where `U[K] === V`. */
export type NarrowByTag<U, K extends keyof U, V> = U extends { [P in K]: V } ? U : never

/** Strip the tag property `K` from every variant of `U`. */
export type OmitTag<U, K extends keyof U> = U extends unknown ? Omit<U, K> : never

/** Union of all tag values in slot `K` of `U`. */
export type TagsOf<U, K extends keyof U> = U extends unknown ? U[K] : never

/** Payload (tag-stripped variant) whose tag at `K` equals `V`. */
export type PayloadOf<U, K extends keyof U, V> = OmitTag<NarrowByTag<U, K, V>, K>

/** `true` if `U` has 2+ variants with distinct tag values at `K`. */
export type IsDiscriminated<U, K extends keyof U> = _IsUnion<TagsOf<U, K>>

type _IsUnion<T, C = T> = [T] extends [never] ? false : T extends unknown ? ([C] extends [T] ? false : true) : false

/** Pattern-match handler object: `{ [tag]: (variant) => R }`. */
export type Matchers<U, K extends keyof U, R> = {
  [V in U extends unknown ? U[K] & PropertyKey : never]: (variant: NarrowByTag<U, K, V>) => R
}

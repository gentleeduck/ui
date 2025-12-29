// 🦆 THIS FILE IS AUTO-GENERATED. DO NOT EDIT.

import { AuthMessages } from '../../../../apps/acme-server/src/auth/auth.constants'

/** 🦆
 * 🦆 Duckgen message registry.
 * 🦆
 * 🦆 Each group key points to a const string array declared in your code and tagged for duckgen.
 * 🦆 Use the types below to build i18n dictionaries that are always aligned with those arrays.
 */
export const DuckgenMessageSources = {
  AuthMessages: AuthMessages,
} as const

/** 🦆
 * 🦆 All message group keys (for example: "auth", "users", "errors").
 */
export type DuckgenMessageGroup = keyof typeof DuckgenMessageSources

/** 🦆
 * 🦆 Message key union for a specific group.
 * 🦆 If G is omitted, the result is the union of all message keys across all groups.
 */
export type DuckgenMessageKey<G extends DuckgenMessageGroup = DuckgenMessageGroup> =
  (typeof DuckgenMessageSources)[G][number]

/** 🦆
 * 🦆 Dictionary shape for a single group.
 * 🦆 Keys are enforced by DuckgenMessageKey<G>.
 */
export type DuckgenMessageDictionary<G extends DuckgenMessageGroup = DuckgenMessageGroup> = Record<
  DuckgenMessageKey<G>,
  string
>

/** 🦆
 * 🦆 All groups mapped to their dictionaries.
 */
export type DuckgenMessageDictionaryByGroup = {
  [G in DuckgenMessageGroup]: DuckgenMessageDictionary<G>
}

/** 🦆
 * 🦆 Alias: language -> all group dictionaries.
 */
export type DuckGenI18nMessages = DuckgenMessageDictionaryByGroup

/** 🦆
 * 🦆 Language -> dictionary for a subset of groups (or all groups if G is omitted).
 * 🦆 Useful when you want a module-scoped i18n object.
 */
export type DuckgenI18n<Lang extends string, G extends DuckgenMessageGroup = DuckgenMessageGroup> = Record<
  Lang,
  DuckgenMessageDictionary<G>
>

/** 🦆
 * 🦆 Language -> all groups. This is the common top-level i18n shape.
 */
export type DuckgenI18nByGroup<Lang extends string> = Record<Lang, DuckGenI18nMessages>

/** 🦆
 * 🦆 Language -> scope -> messages.
 * 🦆
 * 🦆 Two modes:
 * 🦆 1) If ScopeOrMessages is a string scope name (example: "server"), the inner value is Messages.
 * 🦆 2) If ScopeOrMessages is already a messages type, it becomes the inner value and scope keys become string.
 */
export type DuckgenScopedI18nByGroup<
  Lang extends string,
  ScopeOrMessages extends string | DuckGenI18nMessages = DuckGenI18nMessages,
  Messages extends DuckGenI18nMessages = DuckGenI18nMessages,
> = ScopeOrMessages extends string
  ? Record<Lang, Record<ScopeOrMessages, Messages>>
  : Record<Lang, Record<string, ScopeOrMessages>>

/** 🦆
 * 🦆 Convenience alias for the "AuthMessages" group dictionary.
 */
export type AuthMessagesDictionary = DuckgenMessageDictionary<'AuthMessages'>

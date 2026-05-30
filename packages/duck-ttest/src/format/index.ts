// Structural string-format types. Compiler verifies shape only — not RFC semantics.

/** RFC-4122 UUID pattern: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. */
export type UUID = `${string}-${string}-${string}-${string}-${string}`

/** Minimal email shape: `local@domain.tld`. */
export type Email = `${string}@${string}.${string}`

/** Absolute HTTP(S) URL shape. */
export type HttpUrl = `http://${string}` | `https://${string}`

/** Any URL with a scheme and rest. */
export type URLString = `${string}://${string}`

/** IPv4 dotted-quad shape. */
export type IPv4 = `${number}.${number}.${number}.${number}`

/** Minimal IPv6 shape — eight colon-separated groups. */
export type IPv6 = `${string}:${string}:${string}:${string}:${string}:${string}:${string}:${string}`

/** ISO-8601 date: `YYYY-MM-DD`. */
export type ISODate = `${number}-${number}-${number}`

/** ISO-8601 time: `HH:MM:SS` (optionally with fractional seconds). */
export type ISOTime = `${number}:${number}:${number}` | `${number}:${number}:${number}.${number}`

/** ISO-8601 date-time (local or UTC-suffixed). */
export type ISODateTime =
  | `${ISODate}T${ISOTime}`
  | `${ISODate}T${ISOTime}Z`
  | `${ISODate}T${ISOTime}${'+' | '-'}${number}:${number}`

/** `HH:MM` shape for tab-entry time inputs. */
export type HHMM = `${number}:${number}`

/** 24-hour clock full: `HH:MM:SS`. */
export type HHMMSS = `${number}:${number}:${number}`

/** `#RGB`, `#RRGGBB`, or `#RRGGBBAA` hex colors. */
export type HexColor = `#${string}`

/** CSS `rgb(r, g, b)` value. */
export type RgbColor = `rgb(${number}, ${number}, ${number})`

/** CSS `rgba(r, g, b, a)` value. */
export type RgbaColor = `rgba(${number}, ${number}, ${number}, ${number})`

/** CSS `hsl(h, s%, l%)` value. */
export type HslColor = `hsl(${number}, ${number}%, ${number}%)`

// `CSSLength` lives in `~/css` (richer definition: accepts `'0'` and `calc(...)`).
// Re-exported here so existing imports from `~/format` keep resolving.
export type { CSSLength } from '~/css'

/** Semver-ish shape: `MAJOR.MINOR.PATCH` with optional pre-release/build. */
export type Semver =
  | `${number}.${number}.${number}`
  | `${number}.${number}.${number}-${string}`
  | `${number}.${number}.${number}+${string}`
  | `${number}.${number}.${number}-${string}+${string}`

/** E.164-ish international phone shape: leading `+` plus digits. */
export type PhoneE164 = `+${number}`

/** Base64-encoded string pattern (structural, not validated). */
export type Base64 = string & { readonly __format: 'base64' }

/** JWT pattern: `header.payload.signature`. */
export type JWT = `${string}.${string}.${string}`

/**
 * Slug: lowercased-kebab-ish. Purely structural — runtime still needs to
 * validate the character set.
 */
export type Slug = string & { readonly __format: 'slug' }

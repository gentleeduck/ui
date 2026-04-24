// Date / duration type helpers.
//
// Operates on ISO-8601 string literals like `'2026-04-23'` or
// `'2026-04-23T12:34:56Z'` at the type level. Perfect for schema inference
// and for branding duration-valued numbers.

// -----------------------------------------------------------------------------
// ISO date parsing
// -----------------------------------------------------------------------------

/**
 * Extract the year segment of an ISO date as a number literal.
 *
 * @example
 * type X = Year<'2026-04-23'> // 2026
 */
export type Year<S extends string> = S extends `${infer Y extends number}-${string}-${string}${string}` ? Y : never

/**
 * Extract the month segment of an ISO date (1–12, with leading zero stripped).
 *
 * @example
 * type X = Month<'2026-04-23'> // 4
 */
export type Month<S extends string> = S extends `${string}-${infer MS}-${string}` ? _ParseNum<MS> : never

/** Parse a numeric literal from a string, tolerating one leading zero. */
type _ParseNum<S extends string> = S extends `0${infer R}`
  ? R extends ''
    ? 0
    : R extends `${infer N extends number}`
      ? N
      : never
  : S extends `${infer N extends number}`
    ? N
    : never

/**
 * Extract the day-of-month segment of an ISO date.
 *
 * @example
 * type X = Day<'2026-04-23'> // 23
 */
export type Day<S extends string> = S extends `${string}-${string}-${infer DStr}` ? _DayFromDStr<DStr> : never

type _DayFromDStr<S extends string> = S extends `${infer D extends number}T${string}`
  ? D
  : S extends `${infer D extends number}${'Z' | '+' | '-'}${string}`
    ? D
    : S extends `${infer D extends number}`
      ? D
      : never

/**
 * Extract the time-of-day `HH:MM:SS` portion of an ISO datetime, or `never`.
 */
export type TimeOf<S extends string> = S extends `${string}T${infer T}` ? _StripZone<T> : never

type _StripZone<S extends string> = S extends `${infer T}Z`
  ? T
  : S extends `${infer T}+${string}`
    ? T
    : S extends `${infer T}-${string}`
      ? T
      : S

// -----------------------------------------------------------------------------
// Calendar predicates
// -----------------------------------------------------------------------------

// Divisibility checks via string-suffix matching — avoids tuple arithmetic.
type _LastTwoDivBy4 =
  | '00'
  | '04'
  | '08'
  | '12'
  | '16'
  | '20'
  | '24'
  | '28'
  | '32'
  | '36'
  | '40'
  | '44'
  | '48'
  | '52'
  | '56'
  | '60'
  | '64'
  | '68'
  | '72'
  | '76'
  | '80'
  | '84'
  | '88'
  | '92'
  | '96'

/** `true` if `N` is divisible by 4. */
type DivBy4<N extends number> = N extends 0 | 4 | 8 ? true : `${N}` extends `${string}${_LastTwoDivBy4}` ? true : false

/** `true` if `N` is divisible by 100 (ends in `00`). */
type DivBy100<N extends number> = `${N}` extends `${string}00` ? true : false

/**
 * `true` if `N` is divisible by 400 (ends in `00` AND the hundreds prefix is
 * itself divisible by 4).
 */
type DivBy400<N extends number> = `${N}` extends `${infer Prefix extends number}00`
  ? Prefix extends 0
    ? N extends 0
      ? true
      : false
    : DivBy4<Prefix>
  : false

/**
 * `true` if `Y` is a leap year per the Gregorian rule (divisible by 4, except
 * centuries not divisible by 400).
 */
export type IsLeapYear<Y extends number> =
  DivBy400<Y> extends true ? true : DivBy100<Y> extends true ? false : DivBy4<Y>

/**
 * Number of days in a given `Month` of a given `Year`.
 *
 * @example
 * type A = DaysInMonth<2024, 2> // 29 (leap year)
 * type B = DaysInMonth<2025, 2> // 28
 */
export type DaysInMonth<Y extends number, M extends number> = M extends 1 | 3 | 5 | 7 | 8 | 10 | 12
  ? 31
  : M extends 4 | 6 | 9 | 11
    ? 30
    : M extends 2
      ? IsLeapYear<Y> extends true
        ? 29
        : 28
      : never

/**
 * Days-of-week symbolic alias; `Mon` = 1 ... `Sun` = 7 (ISO-8601 order).
 */
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

// -----------------------------------------------------------------------------
// Duration branded types (runtime is just `number`)
// -----------------------------------------------------------------------------

declare const _UNIT: unique symbol

/** A duration value tagged with a unit `U`. */
export type Duration<U extends string> = number & { readonly [_UNIT]: U }

/** Milliseconds. */
export type Milliseconds = Duration<'ms'>
/** Seconds. */
export type Seconds = Duration<'s'>
/** Minutes. */
export type Minutes = Duration<'min'>
/** Hours. */
export type Hours = Duration<'h'>
/** Days. */
export type Days = Duration<'d'>
/** Weeks. */
export type Weeks = Duration<'w'>

/** Union of all common duration units. */
export type AnyDuration = Milliseconds | Seconds | Minutes | Hours | Days | Weeks

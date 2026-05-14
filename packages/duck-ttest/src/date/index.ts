// Type-level ISO-8601 date helpers (`'2026-04-23'`, `'2026-04-23T12:34:56Z'`).

/** Extract year: `Year<'2026-04-23'>` → `2026`. */
export type Year<S extends string> = S extends `${infer Y extends number}-${string}-${string}${string}` ? Y : never

/** Extract month (1–12, leading zero stripped). */
export type Month<S extends string> = S extends `${string}-${infer MS}-${string}` ? _ParseNum<MS> : never

/** Parse a numeric literal, tolerating one leading zero. */
type _ParseNum<S extends string> = S extends `0${infer R}`
  ? R extends ''
    ? 0
    : R extends `${infer N extends number}`
      ? N
      : never
  : S extends `${infer N extends number}`
    ? N
    : never

/** Extract day-of-month. */
export type Day<S extends string> = S extends `${string}-${string}-${infer DStr}` ? _DayFromDStr<DStr> : never

type _DayFromDStr<S extends string> = S extends `${infer D extends number}T${string}`
  ? D
  : S extends `${infer D extends number}${'Z' | '+' | '-'}${string}`
    ? D
    : S extends `${infer D extends number}`
      ? D
      : never

/** Extract `HH:MM:SS` from an ISO datetime, or `never`. */
export type TimeOf<S extends string> = S extends `${string}T${infer T}` ? _StripZone<T> : never

type _StripZone<S extends string> = S extends `${infer T}Z`
  ? T
  : S extends `${infer T}+${string}`
    ? T
    : S extends `${infer T}-${string}`
      ? T
      : S

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

type DivBy4<N extends number> = N extends 0 | 4 | 8 ? true : `${N}` extends `${string}${_LastTwoDivBy4}` ? true : false

type DivBy100<N extends number> = `${N}` extends `${string}00` ? true : false

// Ends in `00` AND hundreds prefix divisible by 4.
type DivBy400<N extends number> = `${N}` extends `${infer Prefix extends number}00`
  ? Prefix extends 0
    ? N extends 0
      ? true
      : false
    : DivBy4<Prefix>
  : false

/** Gregorian leap year: div by 4, except centuries not div by 400. */
export type IsLeapYear<Y extends number> =
  DivBy400<Y> extends true ? true : DivBy100<Y> extends true ? false : DivBy4<Y>

/** Days in `Month` of `Year`. Feb returns 29 in leap years. */
export type DaysInMonth<Y extends number, M extends number> = M extends 1 | 3 | 5 | 7 | 8 | 10 | 12
  ? 31
  : M extends 4 | 6 | 9 | 11
    ? 30
    : M extends 2
      ? IsLeapYear<Y> extends true
        ? 29
        : 28
      : never

/** ISO-8601 day of week: `Mon`=1 ... `Sun`=7. */
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

declare const _UNIT: unique symbol

/** Duration branded with unit `U` (runtime is `number`). */
export type Duration<U extends string> = number & { readonly [_UNIT]: U }

export type Milliseconds = Duration<'ms'>
export type Seconds = Duration<'s'>
export type Minutes = Duration<'min'>
export type Hours = Duration<'h'>
export type Days = Duration<'d'>
export type Weeks = Duration<'w'>

export type AnyDuration = Milliseconds | Seconds | Minutes | Hours | Days | Weeks

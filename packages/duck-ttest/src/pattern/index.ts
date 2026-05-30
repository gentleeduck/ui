// Glob semantics:
//   `*`  — zero or more chars (greedy substring)
//   `?`  — exactly one char
//   `**` — any depth, including across `/`

/**
 * `true` if `S` matches glob `P`.
 * @remarks `**` triggers branchy backtracking via `_MatchAnywhere` —
 *   worst case is quadratic in input length. Fine for tooling; do not place
 *   `MatchesGlob` inside hot generic constraints.
 */
export type MatchesGlob<S extends string, P extends string> = P extends ''
  ? S extends ''
    ? true
    : false
  : P extends `**${infer RestP}`
    ? _MatchAnywhere<S, RestP>
    : P extends `*${infer RestP}`
      ? _MatchStar<S, RestP>
      : P extends `?${infer RestP}`
        ? S extends `${string}${infer RestS}`
          ? MatchesGlob<RestS, RestP>
          : false
        : P extends `${infer Lit}${'*' | '?'}${string}`
          ? _MatchLiteralPrefix<S, Lit, P>
          : S extends P
            ? true
            : false

type _MatchStar<S extends string, RestP extends string> = RestP extends ''
  ? true
  : MatchesGlob<S, RestP> extends true
    ? true
    : S extends `${string}${infer S2}`
      ? _MatchStar<S2, RestP>
      : false

type _MatchAnywhere<S extends string, RestP extends string> = RestP extends ''
  ? true
  : MatchesGlob<S, RestP> extends true
    ? true
    : S extends `${string}${infer S2}`
      ? _MatchAnywhere<S2, RestP>
      : false

type _MatchLiteralPrefix<S extends string, Lit extends string, P extends string> = S extends `${Lit}${infer RestS}`
  ? P extends `${Lit}${infer RestP}`
    ? MatchesGlob<RestS, RestP>
    : false
  : false

/** `true` if `S` starts with any of `Prefixes`. */
export type StartsAnyOf<S extends string, Prefixes extends readonly string[]> = Prefixes extends readonly [
  infer H extends string,
  ...infer R extends string[],
]
  ? S extends `${H}${string}`
    ? true
    : StartsAnyOf<S, R>
  : false

/** `true` if `S` ends with any of the given suffixes. */
export type EndsAnyOf<S extends string, Suffixes extends readonly string[]> = Suffixes extends readonly [
  infer H extends string,
  ...infer R extends string[],
]
  ? S extends `${string}${H}`
    ? true
    : EndsAnyOf<S, R>
  : false

/** `true` if `S` contains any of the given substrings. */
export type IncludesAnyOf<S extends string, Needles extends readonly string[]> = Needles extends readonly [
  infer H extends string,
  ...infer R extends string[],
]
  ? S extends `${string}${H}${string}`
    ? true
    : IncludesAnyOf<S, R>
  : false

/** Keep only the strings in tuple `T` that match glob `P`. */
export type FilterMatching<
  T extends readonly string[],
  P extends string,
  Acc extends string[] = [],
> = T extends readonly [infer H extends string, ...infer R extends string[]]
  ? MatchesGlob<H, P> extends true
    ? FilterMatching<R, P, [...Acc, H]>
    : FilterMatching<R, P, Acc>
  : Acc

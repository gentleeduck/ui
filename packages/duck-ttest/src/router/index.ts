// URL pattern types for `/users/:id/posts/:postId`-style patterns.

/** Extract named params as `{ [name]: string }`. */
export type PathParams<Pattern extends string> =
  _ExtractParams<Pattern> extends infer Keys extends string
    ? [Keys] extends [never]
      ? Record<string, never>
      : { [K in Keys]: string }
    : Record<string, never>

type _ExtractParams<S extends string> = S extends `${string}:${infer Name}/${infer Rest}`
  ? _ParamName<Name> | _ExtractParams<`/${Rest}`>
  : S extends `${string}:${infer Name}`
    ? _ParamName<Name>
    : never

type _ParamName<S extends string> = S extends `${infer Name}/${string}` ? Name : S

/** Substitute `Params` into `Pattern`. */
export type BuildPath<
  Pattern extends string,
  Params extends Record<string, string | number>,
> = Pattern extends `${infer Head}:${infer Name}/${infer Tail}`
  ? Name extends keyof Params
    ? `${Head}${Params[Name] & (string | number)}/${BuildPath<Tail, Params>}`
    : never
  : Pattern extends `${infer Head}:${infer Name}`
    ? Name extends keyof Params
      ? `${Head}${Params[Name] & (string | number)}`
      : never
    : Pattern

/** Split a path into segments, dropping empties. */
export type SplitPath<S extends string> = _Clean<_Split<S>>

type _Split<S extends string> = S extends `${infer H}/${infer R}` ? [H, ..._Split<R>] : [S]
type _Clean<T extends readonly string[]> = T extends readonly [infer H extends string, ...infer R extends string[]]
  ? H extends ''
    ? _Clean<R>
    : [H, ..._Clean<R>]
  : []

/** `true` if `Path` matches `Pattern`; `:`-prefixed segments are wildcards. */
export type MatchRoute<Pattern extends string, Path extends string> = _MatchSegments<
  SplitPath<Pattern>,
  SplitPath<Path>
>

type _MatchSegments<P extends readonly string[], U extends readonly string[]> = P extends readonly [
  infer PH extends string,
  ...infer PR extends string[],
]
  ? U extends readonly [infer UH extends string, ...infer UR extends string[]]
    ? PH extends `:${string}`
      ? _MatchSegments<PR, UR>
      : PH extends UH
        ? _MatchSegments<PR, UR>
        : false
    : false
  : U extends readonly []
    ? true
    : false

/** Extract query-string keys from `?a=1&b=2`-style URLs as `{ [key]: string }`. */
export type QueryParams<S extends string> = S extends `${string}?${infer Q}`
  ? _QueryToRecord<Q>
  : S extends `?${infer Q}`
    ? _QueryToRecord<Q>
    : Record<string, never>

type _QueryToRecord<S extends string> =
  _QSplit<S> extends infer Keys extends string
    ? [Keys] extends [never]
      ? Record<string, never>
      : { [K in Keys]: string }
    : Record<string, never>

type _QSplit<S extends string> = S extends `${infer Pair}&${infer Rest}`
  ? _PairKey<Pair> | _QSplit<Rest>
  : S extends ''
    ? never
    : _PairKey<S>

type _PairKey<S extends string> = S extends `${infer K}=${string}` ? K : S

/** Combined path/query descriptor for a route. */
export interface RouteDescriptor<Pattern extends string, Query = Record<string, never>> {
  readonly pattern: Pattern
  readonly params: PathParams<Pattern>
  readonly query: Query
}

// POSIX path types operate on forward-slash paths. Normalize Windows backslashes
// at runtime before feeding through.

/** Absolute POSIX path: starts with `/`. */
export type PosixAbsolutePath = `/${string}`

/** Relative POSIX path. */
export type PosixRelativePath = `${'' | './' | '../'}${string}`

export type PosixPath = PosixAbsolutePath | PosixRelativePath

/** Windows path with drive letter (`C:\...`) or UNC (`\\server\share\...`). */
export type WindowsAbsolutePath = `${Uppercase<string>}:\\${string}` | `\\\\${string}`

/** Windows path (absolute or relative — note: relative uses `\`). */
export type WindowsPath = WindowsAbsolutePath | `${string}\\${string}`

/** `true` if `P` begins with `/` (POSIX) or a `X:\` (Windows) segment. */
export type IsAbsolute<P extends string> = P extends PosixAbsolutePath
  ? true
  : P extends WindowsAbsolutePath
    ? true
    : false

/**
 * Extract the file extension (including leading dot), or empty string if none.
 *
 * @example
 * type A = ExtensionOf<'foo.ts'>          // '.ts'
 * type B = ExtensionOf<'index.d.ts'>      // '.ts'
 * type C = ExtensionOf<'Makefile'>        // ''
 */
export type ExtensionOf<P extends string> =
  _LastSegment<P, '/'> extends infer Last extends string
    ? Last extends `${string}.${infer E}`
      ? `.${_LastDot<E>}`
      : ''
    : ''

type _LastDot<S extends string> = S extends `${string}.${infer R}` ? _LastDot<R> : S

/**
 * Extract the basename (filename) of a path.
 *
 * @example
 * type A = BasenameOf<'/a/b/c.txt'> // 'c.txt'
 * type B = BasenameOf<'foo.ts'>     // 'foo.ts'
 */
export type BasenameOf<P extends string> = _LastSegment<P, '/'>

/**
 * Extract the directory portion of a path.
 *
 * @example
 * type A = DirnameOf<'/a/b/c.txt'> // '/a/b'
 * type B = DirnameOf<'foo.ts'>     // ''
 */
export type DirnameOf<P extends string> = _WithoutLast<P, '/'>

/**
 * Extract the stem (filename without its final extension).
 *
 * @example
 * type A = StemOf<'foo.ts'>         // 'foo'
 * type B = StemOf<'index.d.ts'>     // 'index.d'
 * type C = StemOf<'Makefile'>       // 'Makefile'
 */
export type StemOf<P extends string> =
  BasenameOf<P> extends `${infer S}.${infer Tail}`
    ? Tail extends `${string}.${string}`
      ? `${S}.${_DropLastExt<Tail>}`
      : S
    : BasenameOf<P>

type _DropLastExt<S extends string> = S extends `${infer H}.${infer R}`
  ? R extends `${string}.${string}`
    ? `${H}.${_DropLastExt<R>}`
    : H
  : S

/**
 * Join two path segments with a `/`.
 *
 * @example
 * type X = JoinPaths<'a/b', 'c/d'> // 'a/b/c/d'
 */
export type JoinPaths<A extends string, B extends string> = A extends ''
  ? B
  : B extends ''
    ? A
    : A extends `${string}/`
      ? `${A}${B extends `/${infer R}` ? R : B}`
      : `${A}/${B extends `/${infer R}` ? R : B}`

/**
 * Normalize a POSIX path by removing `./` segments and collapsing `..`.
 *
 * @example
 * type X = NormalizePath<'/a/./b/../c'> // '/a/c'
 */
export type NormalizePath<P extends string> = _JoinSegments<
  _Normalize<_SplitOn<P, '/'>>,
  P extends `/${string}` ? true : false
>

type _SplitOn<S extends string, Sep extends string> = S extends `${infer H}${Sep}${infer R}`
  ? [H, ..._SplitOn<R, Sep>]
  : [S]

type _Normalize<T extends readonly string[], Acc extends string[] = []> = T extends readonly [
  infer H extends string,
  ...infer R extends string[],
]
  ? H extends '' | '.'
    ? _Normalize<R, Acc>
    : H extends '..'
      ? Acc extends [...infer AccInit extends string[], string]
        ? _Normalize<R, AccInit>
        : _Normalize<R, Acc>
      : _Normalize<R, [...Acc, H]>
  : Acc

type _JoinSegments<T extends readonly string[], Absolute extends boolean> = T extends readonly []
  ? Absolute extends true
    ? '/'
    : '.'
  : `${Absolute extends true ? '/' : ''}${_JoinWith<T, '/'>}`

type _JoinWith<T extends readonly string[], Sep extends string> = T extends readonly [
  infer H extends string,
  ...infer R extends string[],
]
  ? R extends readonly []
    ? H
    : `${H}${Sep}${_JoinWith<R, Sep>}`
  : ''

type _LastSegment<S extends string, Sep extends string> = S extends `${string}${Sep}${infer R}`
  ? _LastSegment<R, Sep>
  : S
type _WithoutLast<S extends string, Sep extends string> = S extends `${infer Head}${Sep}${infer R}`
  ? R extends `${string}${Sep}${string}`
    ? `${Head}${Sep}${_WithoutLast<R, Sep>}`
    : Head
  : ''

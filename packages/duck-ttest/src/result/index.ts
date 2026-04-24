// Result / Option monads as type definitions.
//
// These mirror Rust's `Result<T, E>` and `Option<T>` for TypeScript projects
// that want compile-time tags without importing a runtime library.

/** Successful branch of a `Result`. */
export interface Ok<T> {
  readonly ok: true
  readonly value: T
}

/** Error branch of a `Result`. */
export interface Err<E> {
  readonly ok: false
  readonly error: E
}

/**
 * A computation that either succeeds with `T` or fails with `E`.
 *
 * @example
 * type Parse = Result<number, 'NotANumber'>
 */
export type Result<T, E> = Ok<T> | Err<E>

/** Present branch of an `Option`. */
export interface Some<T> {
  readonly some: true
  readonly value: T
}

/** Absent branch of an `Option`. */
export interface None {
  readonly some: false
}

/**
 * A value that may be absent.
 *
 * @example
 * type FindUser = Option<User>
 */
export type Option<T> = Some<T> | None

/** `true` if `R` is the `Ok` branch. */
export type IsOk<R> = R extends Ok<unknown> ? true : false

/** `true` if `R` is the `Err` branch. */
export type IsErr<R> = R extends Err<unknown> ? true : false

/** `true` if `O` is the `Some` branch. */
export type IsSome<O> = O extends Some<unknown> ? true : false

/** `true` if `O` is the `None` branch. */
export type IsNone<O> = O extends None ? (O extends Some<unknown> ? false : true) : false

/** Extract the value from an `Ok` branch, or `never` if `R` is not `Ok`. */
export type UnwrapOk<R> = R extends Ok<infer T> ? T : never

/** Extract the error from an `Err` branch, or `never` if `R` is not `Err`. */
export type UnwrapErr<R> = R extends Err<infer E> ? E : never

/** Extract the value from a `Some` branch, or `never` if `O` is `None`. */
export type UnwrapSome<O> = O extends Some<infer T> ? T : never

/**
 * Map the `Ok` value of `R` through the type-function `F` (applied via the
 * `Apply<F, X>` convention — see `~/fp`).
 *
 * @example
 * interface Double { __apply: number; result: [this['__apply']] extends [number] ? number : never }
 * type X = MapResult<Ok<5>, Double> // Ok<number>
 */
export type MapResult<R, F> = R extends Ok<infer T> ? Ok<_Apply<F, T>> : R extends Err<infer E> ? Err<E> : never

/**
 * Map the `Some` value of `O` through the type-function `F`.
 */
export type MapOption<O, F> = O extends Some<infer T> ? Some<_Apply<F, T>> : None

// Local HKT helper — compatible with `~/fp#Fn`/`~/fp#Apply` encoding.
type _Apply<F, X> = F extends { readonly arg: unknown; readonly return: unknown }
  ? (F & { readonly arg: X })['return']
  : never

/**
 * Recover from an `Err` by providing a default value.
 *
 * @example
 * type X = OkOrElse<Err<'fail'>, 0> // 0
 * type Y = OkOrElse<Ok<42>, 0>      // 42
 */
export type OkOrElse<R, Default> = R extends Ok<infer T> ? T : Default

/**
 * Recover from `None` by providing a default value.
 */
export type SomeOrElse<O, Default> = O extends Some<infer T> ? T : Default

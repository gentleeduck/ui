// Type-level functional programming primitives (higher-kinded-type flavor).
//
// A type-function is encoded as an interface that extends `Fn`. It declares
// a `return` member whose body reads `this['arg']`. `Apply<F, X>` binds `X`
// into the `arg` slot and evaluates `return`.
//
// @example
// interface Stringify extends Fn {
//   readonly return: `${this['arg'] & (string | number | bigint | boolean)}`
// }
// type X = Apply<Stringify, 42> // '42'

/**
 * Base interface for a type-level function. Subclasses override `return`.
 */
export interface Fn {
  readonly arg: unknown
  readonly return: unknown
}

/**
 * Evaluate a type-function by binding its `arg` slot to `X` and reading `return`.
 */
export type Apply<F extends Fn, X> = (F & { readonly arg: X })['return']

/**
 * Identity type-function. `Apply<Identity, X>` = `X`.
 */
export interface Identity extends Fn {
  readonly return: this['arg']
}

/**
 * Constant type-function — ignores input and always returns `C`.
 */
export interface Constant<C> extends Fn {
  readonly return: C
}

/**
 * Map every element of `T` through type-function `F`.
 *
 * @example
 * interface ToStr extends Fn {
 *   readonly return: `${this['arg'] & (string | number | bigint | boolean)}`
 * }
 * type X = MapTuple<[1, 2, 3], ToStr> // ['1', '2', '3']
 */
export type MapTuple<T extends readonly unknown[], F extends Fn> = {
  [K in keyof T]: Apply<F, T[K]>
}

/**
 * Keep only elements of `T` for which `F` returns `true`.
 */
export type FilterTuple<T extends readonly unknown[], F extends Fn, Acc extends unknown[] = []> = T extends readonly [
  infer H,
  ...infer R,
]
  ? Apply<F, H> extends true
    ? FilterTuple<R, F, [...Acc, H]>
    : FilterTuple<R, F, Acc>
  : Acc

/**
 * Reduce `T` from the left with accumulator `Init` using binary type-function
 * `F` that takes a `[Acc, Item]` tuple in its `arg` slot.
 *
 * @example
 * interface Append extends Fn {
 *   readonly return: this['arg'] extends [infer A extends unknown[], infer B] ? [...A, B] : never
 * }
 * type X = Reduce<[1, 2, 3], [], Append> // [1, 2, 3]
 */
export type Reduce<T extends readonly unknown[], Init, F extends Fn> = T extends readonly [infer H, ...infer R]
  ? Reduce<R, Apply<F, [Init, H]>, F>
  : Init

/**
 * Compose two type-functions right-to-left. `Apply<ComposeFn<G, F>, X>` =
 * `Apply<G, Apply<F, X>>`.
 */
export interface ComposeFn<G extends Fn, F extends Fn> extends Fn {
  readonly return: Apply<G, Apply<F, this['arg']>>
}

/**
 * Flip a binary (tuple-arg) type-function's argument order.
 */
export interface FlipFn<F extends Fn> extends Fn {
  readonly return: this['arg'] extends [infer A, infer B] ? Apply<F, [B, A]> : never
}

/**
 * Apply the first argument of a 2-ary function, yielding a 1-ary function.
 */
export interface PartialFn<F extends Fn, A> extends Fn {
  readonly return: Apply<F, [A, this['arg']]>
}

/**
 * Pre-baked type-function: convert anything `toString`-able to a string literal.
 */
export interface Stringify extends Fn {
  readonly return: `${this['arg'] & (string | number | bigint | boolean)}`
}

/**
 * Pre-baked type-function: wrap a value into a single-element tuple.
 */
export interface Singleton extends Fn {
  readonly return: [this['arg']]
}

/**
 * Pre-baked type-function: negate a boolean.
 */
export interface FnNot extends Fn {
  readonly return: this['arg'] extends true ? false : true
}

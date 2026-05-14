// Higher-kinded-type encoding: a type-function is an interface extending `Fn`
// whose `return` member references `this['arg']`. `Apply<F, X>` binds `X` into
// the `arg` slot and evaluates `return`.

/** Base interface for a type-level function. Subclasses override `return`. */
export interface Fn {
  readonly arg: unknown
  readonly return: unknown
}

/** Evaluate a type-function by binding `X` into its `arg` slot. */
export type Apply<F extends Fn, X> = (F & { readonly arg: X })['return']

/** `Apply<Identity, X>` = `X`. */
export interface Identity extends Fn {
  readonly return: this['arg']
}

/** Always returns `C`, ignoring input. */
export interface Constant<C> extends Fn {
  readonly return: C
}

/** Map every element of `T` through type-function `F`. */
export type MapTuple<T extends readonly unknown[], F extends Fn> = {
  [K in keyof T]: Apply<F, T[K]>
}

/** Keep only elements of `T` for which `F` returns `true`. */
export type FilterTuple<T extends readonly unknown[], F extends Fn, Acc extends unknown[] = []> = T extends readonly [
  infer H,
  ...infer R,
]
  ? Apply<F, H> extends true
    ? FilterTuple<R, F, [...Acc, H]>
    : FilterTuple<R, F, Acc>
  : Acc

/** Left-fold `T` with accumulator `Init`; `F` takes `[Acc, Item]` in its `arg` slot. */
export type Reduce<T extends readonly unknown[], Init, F extends Fn> = T extends readonly [infer H, ...infer R]
  ? Reduce<R, Apply<F, [Init, H]>, F>
  : Init

/** Right-to-left composition: `Apply<ComposeFn<G, F>, X>` = `Apply<G, Apply<F, X>>`. */
export interface ComposeFn<G extends Fn, F extends Fn> extends Fn {
  readonly return: Apply<G, Apply<F, this['arg']>>
}

/** Flip a binary (tuple-arg) type-function's argument order. */
export interface FlipFn<F extends Fn> extends Fn {
  readonly return: this['arg'] extends [infer A, infer B] ? Apply<F, [B, A]> : never
}

/** Partially apply the first argument of a 2-ary function. */
export interface PartialFn<F extends Fn, A> extends Fn {
  readonly return: Apply<F, [A, this['arg']]>
}

/** Convert any `toString`-able value to a string literal. */
export interface Stringify extends Fn {
  readonly return: `${this['arg'] & (string | number | bigint | boolean)}`
}

/** Wrap a value into a single-element tuple. */
export interface Singleton extends Fn {
  readonly return: [this['arg']]
}

/** Negate a boolean. */
export interface FnNot extends Fn {
  readonly return: this['arg'] extends true ? false : true
}

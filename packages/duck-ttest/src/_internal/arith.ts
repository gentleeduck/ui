// Internal tuple-recursion arithmetic helpers, shared across modules to avoid
// re-inlining the same `Tuple<N>` / `Inc` / `Dec` / `_Add` definitions.
// Not part of the public surface — no sub-export in package.json points here.

/** A tuple whose length equals `N`. */
export type Tuple<N extends number, Acc extends unknown[] = []> = Acc['length'] extends N
  ? Acc
  : Tuple<N, [...Acc, unknown]>

/** `Inc<N>` → `N + 1`. */
export type Inc<N extends number> = [...Tuple<N>, unknown]['length'] & number

/** `Dec<N>` → `N - 1`; `never` for `0`. */
export type Dec<N extends number> = Tuple<N> extends [unknown, ...infer R] ? R['length'] & number : never

/** Add two non-negative integers. */
export type Add<A extends number, B extends number> = [...Tuple<A>, ...Tuple<B>]['length'] & number

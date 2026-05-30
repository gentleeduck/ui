/** Logical AND. */
export type And<A extends boolean, B extends boolean> = A extends true ? (B extends true ? true : false) : false

/** Logical OR. */
export type Or<A extends boolean, B extends boolean> = A extends true ? true : B extends true ? true : false

/** Logical NOT. */
export type Not<A extends boolean> = A extends true ? false : true

/** Exclusive OR — true iff exactly one input is `true`. */
export type Xor<A extends boolean, B extends boolean> = A extends true
  ? B extends true
    ? false
    : true
  : B extends true
    ? true
    : false

/** Exclusive NOR — true iff both inputs are equal. */
export type Xnor<A extends boolean, B extends boolean> = Not<Xor<A, B>>

// `If` lives in `~/conditional` — re-exported here for ergonomic grouping
// alongside the other boolean operators.
export type { If } from '~/conditional'

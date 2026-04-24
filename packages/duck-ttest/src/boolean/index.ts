// Type-level boolean logic

/**
 * Logical AND.
 *
 * @example
 * type A = And<true, true>   // true
 * type B = And<true, false>  // false
 * type C = And<false, true>  // false
 */
export type And<A extends boolean, B extends boolean> = A extends true ? (B extends true ? true : false) : false

/**
 * Logical OR.
 *
 * @example
 * type A = Or<true, false>   // true
 * type B = Or<false, false>  // false
 */
export type Or<A extends boolean, B extends boolean> = A extends true ? true : B extends true ? true : false

/**
 * Logical NOT.
 *
 * @example
 * type A = Not<true>   // false
 * type B = Not<false>  // true
 */
export type Not<A extends boolean> = A extends true ? false : true

/**
 * Exclusive OR — true iff exactly one of the inputs is `true`.
 *
 * @example
 * type A = Xor<true, false>  // true
 * type B = Xor<true, true>   // false
 * type C = Xor<false, false> // false
 */
export type Xor<A extends boolean, B extends boolean> = A extends true
  ? B extends true
    ? false
    : true
  : B extends true
    ? true
    : false

/**
 * Exclusive NOR — true iff both inputs are equal.
 *
 * @example
 * type A = Xnor<true, true>   // true
 * type B = Xnor<false, false> // true
 * type C = Xnor<true, false>  // false
 */
export type Xnor<A extends boolean, B extends boolean> = Not<Xor<A, B>>

/**
 * Type-level ternary. Returns `Then` if `Cond` is `true`, else `Else`.
 *
 * @example
 * type A = If<true, 'yes', 'no'>  // 'yes'
 * type B = If<false, 'yes', 'no'> // 'no'
 */
export type If<Cond extends boolean, Then, Else> = Cond extends true ? Then : Else

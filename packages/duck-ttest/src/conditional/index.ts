// Conditional / control-flow type utilities

/**
 * Type-level ternary. Returns `Then` if `Cond` is `true`, else `Else`.
 *
 * @example
 * type X = If<true, 'yes', 'no'> // 'yes'
 */
export type If<Cond extends boolean, Then, Else> = Cond extends true ? Then : Else

/**
 * Assignability check with branch. Returns `Then` if `A extends B`, else `Else`.
 *
 * @example
 * type X = IfExtends<string, unknown, 'yes', 'no'> // 'yes'
 */
export type IfExtends<A, B, Then, Else> = A extends B ? Then : Else

/**
 * Type-level switch. Matches `Value` against a record of `Case => Result`
 * entries; returns the matching result or `Default`.
 *
 * @example
 * type Kind = 'circle' | 'square' | 'triangle'
 * type Area = Switch<Kind, { circle: number; square: number; triangle: number }, never>
 * type One = Switch<'circle', { circle: 'O'; square: 'S' }, 'none'> // 'O'
 */
export type Switch<Value extends PropertyKey, Cases, Default = never> = Value extends keyof Cases
  ? Cases[Value]
  : Default

/**
 * Pattern-match a type against an ordered list of [When, Then] tuples.
 *
 * @example
 * type X = Match<'b', [['a', 1], ['b', 2], ['c', 3]]> // 2
 */
export type Match<
  Value,
  Cases extends readonly (readonly [unknown, unknown])[],
  Default = never,
> = Cases extends readonly [readonly [infer W, infer R], ...infer Rest]
  ? [Value] extends [W]
    ? R
    : Rest extends readonly (readonly [unknown, unknown])[]
      ? Match<Value, Rest, Default>
      : Default
  : Default

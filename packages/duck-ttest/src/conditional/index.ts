/** Type-level ternary. */
export type If<Cond extends boolean, Then, Else> = Cond extends true ? Then : Else

/** Branch on assignability: `A extends B ? Then : Else`. */
export type IfExtends<A, B, Then, Else> = A extends B ? Then : Else

/** Match `Value` against a record of `Case => Result`; falls back to `Default`. */
export type Switch<Value extends PropertyKey, Cases, Default = never> = Value extends keyof Cases
  ? Cases[Value]
  : Default

/** Match `Value` against ordered `[When, Then]` tuples. */
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

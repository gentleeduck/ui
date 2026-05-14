/** Remove leading whitespace (` `, `\n`, `\t`). */
export type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : S

/** Remove trailing whitespace. */
export type TrimRight<S extends string> = S extends `${infer R}${' ' | '\n' | '\t'}` ? TrimRight<R> : S

/** Remove leading and trailing whitespace. */
export type Trim<S extends string> = TrimLeft<TrimRight<S>>

/** Capitalize each space-separated word; lowercases the rest. */
export type CapitalizeWords<S extends string> = S extends `${infer Head} ${infer Rest}`
  ? `${Capitalize<Lowercase<Head>>} ${CapitalizeWords<Rest>}`
  : Capitalize<Lowercase<S>>

/** snake_case → camelCase. */
export type SnakeToCamel<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
  : S

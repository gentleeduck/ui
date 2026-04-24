/**
 * Removes leading whitespace characters (`' '`, `'\n'`, `'\t'`) from the beginning of the string.
 *
 * @template S - The input string type.
 * @returns The string with leading whitespace removed.
 *
 * @example
 * type A = TrimLeft<'   hello'>         // "hello"
 * type B = TrimLeft<'\n\t world'>       // "world"
 */
export type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : S

/**
 * Removes trailing whitespace characters (`' '`, `'\n'`, `'\t'`) from the end of the string.
 *
 * @template S - The input string type.
 * @returns The string with trailing whitespace removed.
 *
 * @example
 * type A = TrimRight<'hello   '>        // "hello"
 * type B = TrimRight<'world\n\t '>      // "world"
 */
export type TrimRight<S extends string> = S extends `${infer R}${' ' | '\n' | '\t'}` ? TrimRight<R> : S

/**
 * Removes whitespace characters from both the start and end of the string.
 *
 * @template S - The input string type.
 * @returns The string with both leading and trailing whitespace removed.
 *
 * @example
 * type A = Trim<'   hello   '>          // "hello"
 * type B = Trim<'\n\t goodbye \n'>      // "goodbye"
 */
export type Trim<S extends string> = TrimLeft<TrimRight<S>>

/**
 * Capitalizes each word in a space-separated string, converting each to `Capitalized<Lowercase<...>>`.
 *
 * @template S - The input space-separated string.
 * @returns A new string with each word capitalized.
 *
 * @example
 * type A = CapitalizeWords<'hello world'>        // "Hello World"
 * type B = CapitalizeWords<'GOOD night moon'>    // "Good Night Moon"
 */
export type CapitalizeWords<S extends string> = S extends `${infer Head} ${infer Rest}`
  ? `${Capitalize<Lowercase<Head>>} ${CapitalizeWords<Rest>}`
  : Capitalize<Lowercase<S>>

/**
 * Converts a snake_case string to camelCase by removing underscores and capitalizing subsequent words.
 *
 * @template S - The snake_case input string.
 * @returns A camelCase version of the string.
 *
 * @example
 * type A = SnakeToCamel<'hello_world'>           // "helloWorld"
 * type B = SnakeToCamel<'foo_bar_baz'>           // "fooBarBaz"
 */
export type SnakeToCamel<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
  : S

/** Return type of `F`, or `never` if `F` is not a function. */
export type ReturnTypeSafe<F> = F extends (...args: any[]) => infer R ? R : never

/** Parameter tuple of `F`, or `never` if `F` is not a function. */
export type ParametersSafe<F> = F extends (...args: infer P) => any ? P : never

/**
 * Curried form of `F`: `(a, b, c) => R` → `(a) => (b) => (c) => R`.
 */
export type Curried<F> = F extends (...args: infer P) => infer R
  ? P extends [infer A, ...infer Rest]
    ? (arg: A) => Curried<(...args: Rest) => R>
    : R
  : never

/** `F` with its return type wrapped in `Promise`. `never` if `F` is not a function. */
export type Promisify<F> = F extends (...args: infer P) => infer R ? (...args: P) => Promise<R> : never

// Async and iterable type utilities

/**
 * Any synchronous or asynchronous callable. Accepts/returns anything.
 * Use as a generic constraint when a utility needs to accept an arbitrary function.
 */
export type AnyFunction = (...args: any[]) => any

/**
 * Any function whose return type is a `Promise`. The resolved type is `any`
 * — use `AsyncReturnType<F>` when you need the resolved value.
 */
export type AnyAsyncFunction = (...args: any[]) => Promise<any>

/**
 * `T` or a `Promise<T>` or any `PromiseLike<T>` (thenable).
 */
export type Awaitable<T> = T | PromiseLike<T>

/**
 * Awaited return type of an async (or sync) function. If `F` is not a function,
 * yields `never`. If its return is not a promise, yields the raw return type.
 *
 * @example
 * type A = AsyncReturnType<() => Promise<string>> // string
 * type B = AsyncReturnType<() => number>          // number
 */
export type AsyncReturnType<F> = F extends (...args: any[]) => infer R ? Awaited<R> : never

/**
 * Element type of an `Iterable`, `AsyncIterable`, or array.
 *
 * @example
 * type A = IterableElement<string[]>         // string
 * type B = IterableElement<Set<number>>      // number
 * type C = IterableElement<Map<string, 1>>   // [string, 1]
 */
export type IterableElement<T> =
  T extends Iterable<infer U> ? U : T extends AsyncIterable<infer U> ? U : T extends readonly (infer U)[] ? U : never

/**
 * Element type of an `AsyncIterable`.
 *
 * @example
 * type X = AsyncIterableElement<AsyncIterable<string>> // string
 */
export type AsyncIterableElement<T> = T extends AsyncIterable<infer U> ? U : never

/**
 * Recursively unwrap every nested `Promise<...>` or `PromiseLike<...>`.
 * Same behavior as TypeScript's built-in `Awaited<T>`.
 */
export type AwaitedDeep<T> = T extends PromiseLike<infer U> ? AwaitedDeep<U> : T

/**
 * Type of the value yielded by a generator function.
 *
 * @example
 * type X = GeneratorYield<() => Generator<number, void, void>> // number
 */
export type GeneratorYield<F> = F extends (...args: any[]) => Generator<infer Y, any, any>
  ? Y
  : F extends Generator<infer Y, any, any>
    ? Y
    : never

/**
 * Type of the value yielded by an async generator function.
 */
export type AsyncGeneratorYield<F> = F extends (...args: any[]) => AsyncGenerator<infer Y, any, any>
  ? Y
  : F extends AsyncGenerator<infer Y, any, any>
    ? Y
    : never

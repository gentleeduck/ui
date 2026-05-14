/** Any sync or async callable. */
export type AnyFunction = (...args: any[]) => any

/** Any function returning a `Promise`. Use `AsyncReturnType<F>` for the resolved value. */
export type AnyAsyncFunction = (...args: any[]) => Promise<any>

/** `T`, `Promise<T>`, or any thenable `PromiseLike<T>`. */
export type Awaitable<T> = T | PromiseLike<T>

/** Awaited return type of a function. `never` for non-functions. */
export type AsyncReturnType<F> = F extends (...args: any[]) => infer R ? Awaited<R> : never

/** Element type of an `Iterable`, `AsyncIterable`, or array. */
export type IterableElement<T> =
  T extends Iterable<infer U> ? U : T extends AsyncIterable<infer U> ? U : T extends readonly (infer U)[] ? U : never

/** Element type of an `AsyncIterable`. */
export type AsyncIterableElement<T> = T extends AsyncIterable<infer U> ? U : never

/** Recursively unwrap nested `PromiseLike`s. Same behavior as built-in `Awaited`. */
export type AwaitedDeep<T> = T extends PromiseLike<infer U> ? AwaitedDeep<U> : T

/** Yield type of a generator function or generator. */
export type GeneratorYield<F> = F extends (...args: any[]) => Generator<infer Y, any, any>
  ? Y
  : F extends Generator<infer Y, any, any>
    ? Y
    : never

/** Yield type of an async generator function or async generator. */
export type AsyncGeneratorYield<F> = F extends (...args: any[]) => AsyncGenerator<infer Y, any, any>
  ? Y
  : F extends AsyncGenerator<infer Y, any, any>
    ? Y
    : never

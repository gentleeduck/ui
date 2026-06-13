```ts
import type {
  AnyFunction, AnyAsyncFunction,
  Awaitable, AsyncReturnType, AwaitedDeep,
  IterableElement, AsyncIterableElement,
  GeneratorYield, AsyncGeneratorYield,
} from '@gentleduck/ttest/async'
```

## AnyFunction

```ts
type AnyFunction = (...args: any[]) => any
```

Sync or async callable.

## AnyAsyncFunction

```ts
type AnyAsyncFunction = (...args: any[]) => Promise<any>
```

Any function returning a `Promise`. Use `AsyncReturnType<F>` to extract the resolved value.

## Awaitable

```ts
type Awaitable<T> = T | PromiseLike<T>
```

`T`, `Promise<T>`, or any thenable. Useful for return-type annotations on hybrid sync/async APIs.

## AsyncReturnType

```ts
type AsyncReturnType<F> = F extends (...args: any[]) => infer R ? Awaited<R> : never
```

Awaited return type of a function. `never` if `F` is not a function.

```ts
async function load() { return { id: 1 } }
type T = AsyncReturnType<typeof load>  // { id: number }
```

## AwaitedDeep

```ts
type AwaitedDeep<T> = T extends PromiseLike<infer U> ? AwaitedDeep<U> : T
```

Recursively unwrap nested `PromiseLike`s. Unlike TypeScript's built-in `Awaited`, it only matches `PromiseLike` and does not structurally unwrap arbitrary thenables.

## IterableElement

```ts
type IterableElement<T> =
  T extends Iterable<infer U> ? U
  : T extends AsyncIterable<infer U> ? U
  : T extends readonly (infer U)[] ? U
  : never
```

Element type of an iterable, async iterable, or array.

```ts
type a = IterableElement<Set<number>>           // number
type b = IterableElement<AsyncIterable<string>> // string
type c = IterableElement<readonly boolean[]>    // boolean
```

## AsyncIterableElement

```ts
type AsyncIterableElement<T> = T extends AsyncIterable<infer U> ? U : never
```

Like `IterableElement` but restricted to async iterables.

## GeneratorYield

```ts
type GeneratorYield<F> = F extends (...args: any[]) => Generator<infer Y, any, any>
  ? Y
  : F extends Generator<infer Y, any, any> ? Y : never
```

Yield type of a generator function or a generator.

## AsyncGeneratorYield

```ts
type AsyncGeneratorYield<F> = F extends (...args: any[]) => AsyncGenerator<infer Y, any, any>
  ? Y
  : F extends AsyncGenerator<infer Y, any, any> ? Y : never
```

Yield type of an async generator function or async generator.
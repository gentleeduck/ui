import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type {
  AnyAsyncFunction,
  AnyFunction,
  AsyncGeneratorYield,
  AsyncIterableElement,
  AsyncReturnType,
  Awaitable,
  AwaitedDeep,
  GeneratorYield,
  IterableElement,
} from '.'

// AnyFunction / AnyAsyncFunction
type Test_AnyFunction = AssertTrue<
  Equal<((x: string) => number) extends AnyFunction ? true : false, true>,
  'AnyFunction accepts any function'
>
type Test_AnyAsyncFunction = AssertTrue<
  Equal<(() => Promise<number>) extends AnyAsyncFunction ? true : false, true>,
  'AnyAsyncFunction accepts promise-returning functions'
>

// Awaitable
type Test_Awaitable = AssertTrue<
  Equal<42 extends Awaitable<number> ? true : false, true>,
  'Awaitable accepts a plain value'
>
type Test_Awaitable_Promise = AssertTrue<
  Equal<Promise<42> extends Awaitable<number> ? true : false, true>,
  'Awaitable accepts a promise'
>

// AsyncReturnType
type Test_AsyncReturnType_Async = AssertTrue<
  Equal<AsyncReturnType<() => Promise<string>>, string>,
  'AsyncReturnType unwraps promise'
>
type Test_AsyncReturnType_Sync = AssertTrue<
  Equal<AsyncReturnType<() => number>, number>,
  'AsyncReturnType on sync returns value'
>

// IterableElement
type Test_IterableElement_Array = AssertTrue<Equal<IterableElement<string[]>, string>, 'IterableElement of array'>
type Test_IterableElement_Set = AssertTrue<Equal<IterableElement<Set<number>>, number>, 'IterableElement of Set'>

// AsyncIterableElement
type Test_AsyncIterableElement = AssertTrue<
  Equal<AsyncIterableElement<AsyncIterable<string>>, string>,
  'AsyncIterableElement unwraps async iterable'
>

// AwaitedDeep
type Test_AwaitedDeep = AssertTrue<
  Equal<AwaitedDeep<Promise<Promise<Promise<number>>>>, number>,
  'AwaitedDeep flattens nested promises'
>

// GeneratorYield / AsyncGeneratorYield
type Test_GenYield = AssertTrue<
  Equal<GeneratorYield<() => Generator<number, void, void>>, number>,
  'GeneratorYield extracts yield type'
>
type Test_AsyncGenYield = AssertTrue<
  Equal<AsyncGeneratorYield<() => AsyncGenerator<string, void, void>>, string>,
  'AsyncGeneratorYield extracts yield type'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_AnyFunction,
  Test_AnyAsyncFunction,
  Test_Awaitable,
  Test_Awaitable_Promise,
  Test_AsyncReturnType_Async,
  Test_AsyncReturnType_Sync,
  Test_IterableElement_Array,
  Test_IterableElement_Set,
  Test_AsyncIterableElement,
  Test_AwaitedDeep,
  Test_GenYield,
  Test_AsyncGenYield,
]

import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { Curried, ParametersSafe, Promisify, ReturnTypeSafe } from '.'

// 1. ReturnTypeSafe
type Test_ReturnTypeSafe = [
  AssertTrue<Equal<ReturnTypeSafe<() => string>, string>, 'Expected ReturnTypeSafe to extract string return type'>,
  AssertTrue<Equal<ReturnTypeSafe<() => void>, void>, 'Expected ReturnTypeSafe to extract void return type'>,
  AssertTrue<
    Equal<ReturnTypeSafe<() => number[]>, number[]>,
    'Expected ReturnTypeSafe to extract number[] return type'
  >,
  AssertTrue<Equal<ReturnTypeSafe<number>, never>, 'Expected ReturnTypeSafe to return never for non-function'>,
  AssertTrue<Equal<ReturnTypeSafe<null>, never>, 'Expected ReturnTypeSafe to return never for null'>,
  AssertTrue<Equal<ReturnTypeSafe<undefined>, never>, 'Expected ReturnTypeSafe to return never for undefined'>,
]

// 2. ParametersSafe
type Test_ParametersSafe = [
  AssertTrue<
    Equal<ParametersSafe<(x: number, y: string) => void>, [number, string]>,
    'Expected ParametersSafe to extract tuple of parameters'
  >,
  AssertTrue<Equal<ParametersSafe<() => void>, []>, 'Expected ParametersSafe to extract empty tuple for no params'>,
  AssertTrue<Equal<ParametersSafe<string>, never>, 'Expected ParametersSafe to return never for non-function'>,
  AssertTrue<Equal<ParametersSafe<null>, never>, 'Expected ParametersSafe to return never for null'>,
  AssertTrue<Equal<ParametersSafe<undefined>, never>, 'Expected ParametersSafe to return never for undefined'>,
]

// 3. Curried
type Fn1 = (a: number, b: string, c: boolean) => Date
type Fn2 = () => string
type Fn3 = (x: number) => boolean

type Test_Curried = [
  AssertTrue<
    Equal<Curried<Fn1>, (a: number) => (b: string) => (c: boolean) => Date>,
    'Expected Curried to transform Fn1 to nested functions'
  >,
  AssertTrue<Equal<Curried<Fn2>, string>, 'Expected Curried to return return type directly for 0-arg functions'>,
  AssertTrue<
    Equal<Curried<Fn3>, (x: number) => boolean>,
    'Expected Curried to return original function for 1-arg functions'
  >,
]

// 4. Promisify
type Test_Promisify = [
  AssertTrue<
    Equal<Promisify<(a: number, b: string) => boolean>, (a: number, b: string) => Promise<boolean>>,
    'Expected Promisify to wrap sync function result in Promise'
  >,
  AssertTrue<
    Equal<Promisify<() => void>, () => Promise<void>>,
    'Expected Promisify to wrap void function in Promise<void>'
  >,
  AssertTrue<
    Equal<Promisify<() => number>, () => Promise<number>>,
    'Expected Promisify to wrap sync number-returning function'
  >,
  AssertTrue<
    Equal<Promisify<() => [number, string]>, () => Promise<[number, string]>>,
    'Expected Promisify to wrap tuple result in Promise'
  >,
  AssertTrue<Equal<Promisify<number>, never>, 'Expected Promisify to return never for non-function'>,
  AssertTrue<
    Equal<Promisify<() => Promise<string>>, () => Promise<Promise<string>>>,
    'Expected Promisify to wrap already-Promise return'
  >,
  AssertTrue<
    Equal<Promisify<(...args: string[]) => boolean>, (...args: string[]) => Promise<boolean>>,
    'Expected Promisify to preserve rest parameters and wrap result'
  >,
]

/* @__IGNORED__@ */ type _IGNORE = [...Test_ReturnTypeSafe, ...Test_ParametersSafe, ...Test_Curried, ...Test_Promisify]

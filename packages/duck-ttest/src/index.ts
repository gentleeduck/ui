// Demonstrates real-world usage of the TypeScript Utility Library

import type { AssertTrue } from './assert'
import type { Jsonify } from './domain'
import type { Equal } from './equality'
import type { KeysOfType, OptionalKeys, ReadonlyKeys } from './extraction'
import type { Merge } from './objects'
import type { Head, Tail, Zip } from './tuple'
import type { UnionToIntersection, XOR } from './union'

// -------------------------------------------
// Example 1: API Response Sanitization with Jsonify
// -------------------------------------------

type RawUser = {
  id: number
  name: string
  password: string // sensitive, should be removed
  createdAt: Date // not JSON-serializable
  toJSON(): string // method, should be removed
}

type SanitizedUser = Jsonify<RawUser>
// Expected: { id: number; name: string }
type Test_SanitizedUser = AssertTrue<
  Equal<SanitizedUser, { id: number; name: string }>,
  'Expected Jsonify to remove non-JSON-safe properties and methods'
>

// -------------------------------------------
// Example 2: Merging Default and Override Configs
// -------------------------------------------

type DefaultConfig = {
  host: string
  port: number
  useSsl: boolean
}

type UserConfig = {
  port?: number
  useSsl?: boolean
}

// Apply default then user overrides
// Merge treats undefined as override, so omit undefined from user
type FinalConfig = Merge<
  DefaultConfig,
  Jsonify<UserConfig> // ensures no undefined in override
>

// Test Merge behavior
type Test_FinalConfig = AssertTrue<
  Equal<FinalConfig, { host: string; port?: number; useSsl?: boolean }>,
  'Expected Merge to combine DefaultConfig with optional overrides from UserConfig'
>

// -------------------------------------------
// Example 3: Extracting Keys of Specific Types
// -------------------------------------------

type Metrics = {
  count: number
  label: string
  active: boolean
}

type NumberKeys = KeysOfType<Metrics, number> // 'count'
type Test_NumberKeys = AssertTrue<
  Equal<NumberKeys, 'count'>,
  'Expected KeysOfType to extract keys whose values are number'
>

// OptionalKeys & ReadonlyKeys

type ExampleObj = {
  readonly id: string
  name?: string
  value: number
}

type Test_Optional = AssertTrue<
  Equal<OptionalKeys<ExampleObj>, 'name'>,
  'Expected OptionalKeys to extract optional keys only'
>

type Test_Readonly = AssertTrue<
  Equal<ReadonlyKeys<ExampleObj>, 'id'>,
  'Expected ReadonlyKeys to extract readonly keys only'
>

// -------------------------------------------
// Example 4: Tuple Utilities
// -------------------------------------------

type Colors = ['red', 'green', 'blue']
type FirstColor = Head<Colors> // 'red'
type RestColors = Tail<Colors> // ['green', 'blue']
type Zipped = Zip<[1, 2, 3], ['a', 'b', 'c']> // [[1,'a'],[2,'b'],[3,'c']]

// Tests

type Test_FirstColor = AssertTrue<Equal<FirstColor, 'red'>, 'Expected Head to extract first element of tuple'>

type Test_RestColors = AssertTrue<
  Equal<RestColors, ['green', 'blue']>,
  'Expected Tail to extract all but first element of tuple'
>

type Test_Zipped = AssertTrue<
  Equal<Zipped, [[1, 'a'], [2, 'b'], [3, 'c']]>,
  'Expected Zip to combine tuples element-wise into pairs'
>

// -------------------------------------------
// Example 5: Advanced Union/Intersection
// -------------------------------------------

type U1 = { a: 1 } | { b: 2 }
// Convert union to intersection
type I1 = UnionToIntersection<U1> // { a:1 } & { b:2 }
type Test_I1 = AssertTrue<
  Equal<I1, { a: 1 } & { b: 2 }>,
  'Expected UnionToIntersection to convert union type to intersection type'
>

// XOR example

type X1 = XOR<{ a: number; common: string }, { b: boolean; common: string }>
// expected: { a: number } | { b: boolean }
type Test_X1 = AssertTrue<
  Equal<X1, { a: number } | { b: boolean }>,
  'Expected XOR to produce mutually exclusive union of properties'
>

// If all tests pass, this file compiles without errors.

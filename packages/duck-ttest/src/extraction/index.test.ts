import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { KeysOfType, MutableKeys, OptionalKeys, ReadonlyKeys, RequiredKeys } from '.'

// 1. KeysOfType<O, T>
type Test_KeysOfType_Num = AssertTrue<
  Equal<KeysOfType<{ a: 1; b: 's'; c: 2 }, number>, 'a' | 'c'>,
  'Expected KeysOfType to extract numeric keys'
>
type Test_KeysOfType_Str = AssertTrue<
  Equal<KeysOfType<{ a: 1; b: 's'; c: 2 }, string>, 'b'>,
  'Expected KeysOfType to extract string keys'
>

// 2. OptionalKeys<T>
type Test_OptionalKeys = AssertTrue<
  Equal<OptionalKeys<{ a?: number; b: string; c?: boolean }>, 'a' | 'c'>,
  'Expected OptionalKeys to extract optional properties'
>

// 3. RequiredKeys<T>
type Test_RequiredKeys = AssertTrue<
  Equal<RequiredKeys<{ a?: number; b: string; c?: boolean }>, 'b'>,
  'Expected RequiredKeys to extract required properties'
>

// 4. ReadonlyKeys<T>
type Test_ReadonlyKeys = AssertTrue<
  Equal<ReadonlyKeys<{ readonly x: number; y: string }>, 'x'>,
  'Expected ReadonlyKeys to extract readonly keys'
>

// 5. MutableKeys<T>
type Test_MutableKeys = AssertTrue<
  Equal<MutableKeys<{ readonly x: number; y: string }>, 'y'>,
  'Expected MutableKeys to extract mutable keys'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_KeysOfType_Num,
  Test_KeysOfType_Str,
  Test_OptionalKeys,
  Test_RequiredKeys,
  Test_ReadonlyKeys,
  Test_MutableKeys,
]

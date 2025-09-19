// === Type Equality Tests ===

import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal, HasKey, HasKeyWithType, NotEqual, ShallowEqual, ShallowNotEqual } from '.'

// Equal<X, Y>
type Test_Equal_Prims_Pass = AssertTrue<Equal<string, string>, 'Expected string to equal string'>
type Test_Equal_Prims_Fail = AssertFalse<Equal<string, number>, 'Expected string not to equal number'>

type Test_Equal_Obj_Pass = AssertTrue<Equal<{ a: number }, { a: number }>, 'Expected objects to be equal'>
type Test_Equal_Obj_Fail = AssertFalse<Equal<{ a: number }, { b: number }>, 'Expected objects to be different'>

// NotEqual<X, Y>
type Test_NotEqual_Prims_Pass = AssertTrue<NotEqual<1, 2>, 'Expected 1 to not equal 2'>
type Test_NotEqual_Prims_Fail = AssertFalse<NotEqual<1, 1>, 'Expected 1 to equal 1'>

// ShallowEqual<X, Y>
type Test_ShallowEqual_True = AssertTrue<
  ShallowEqual<{ a: number }, { a: number; b?: string }>,
  'Expected shallow equal to pass with optional prop'
>
type Test_ShallowEqual_False = AssertFalse<
  ShallowEqual<{ a: string }, { a: number }>,
  'Expected shallow equal to fail due to type mismatch'
>

// ShallowNotEqual<X, Y>
type Test_ShallowNotEqual_True = AssertTrue<ShallowNotEqual<1, 2>, 'Expected shallow not equal for 1 and 2'>
type Test_ShallowNotEqual_False = AssertFalse<
  ShallowNotEqual<1, 1>,
  'Expected shallow not equal to fail for identical types'
>

// HasKeyWithType<K, T, O>
type ObjA = { x: number; y: string }

type Test_HasKeyWithType_True1 = AssertTrue<
  HasKeyWithType<'x', number, ObjA>,
  "Expected 'x' with type number to exist in ObjA"
>
type Test_HasKeyWithType_False1 = AssertFalse<HasKeyWithType<'x', string, ObjA>, "Expected 'x' not to have type string">
type Test_HasKeyWithType_False2 = AssertFalse<HasKeyWithType<'z', any, ObjA>, "Expected 'z' not to exist in ObjA">

// HasKey<K, O>
type Test_HasKey_True = AssertTrue<HasKey<'foo', { foo: string }>, "Expected key 'foo' to exist">
type Test_HasKey_False = AssertFalse<HasKey<'bar', { foo: string }>, "Expected key 'bar' not to exist">

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Equal_Prims_Pass,
  Test_Equal_Prims_Fail,
  Test_Equal_Obj_Pass,
  Test_Equal_Obj_Fail,
  Test_NotEqual_Prims_Pass,
  Test_NotEqual_Prims_Fail,
  Test_ShallowEqual_True,
  Test_ShallowEqual_False,
  Test_ShallowNotEqual_True,
  Test_ShallowNotEqual_False,
  Test_HasKeyWithType_True1,
  Test_HasKeyWithType_False1,
  Test_HasKeyWithType_False2,
  Test_HasKey_True,
  Test_HasKey_False,
]

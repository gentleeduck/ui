import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { IsMutable, IsPartial, IsReadonly, IsRequired } from '.'

// -------------------------------------------
// Test Types
// -------------------------------------------

type FullyMutable = { a: number; b: string }
type FullyReadonly = { readonly a: number; readonly b: string }
type PartiallyOptional = { a?: number; b?: string }
type FullyRequired = { a: number; b: string }

// -------------------------------------------
// IsMutable Tests
// -------------------------------------------

type Test_IsMutable_True = AssertTrue<
  Equal<IsMutable<FullyMutable>, true>,
  'Expected IsMutable to return true for fully mutable object'
>

type Test_IsMutable_False = AssertTrue<
  Equal<IsMutable<FullyReadonly>, false>,
  'Expected IsMutable to return false for fully readonly object'
>

type Test_IsMutable_Mixed = AssertTrue<
  Equal<IsMutable<{ a: number; readonly b: string }>, false>,
  'Expected IsMutable to return false when some properties are readonly'
>

// -------------------------------------------
// IsReadonly Tests
// -------------------------------------------

type Test_IsReadonly_True = AssertTrue<
  Equal<IsReadonly<FullyReadonly>, true>,
  'Expected IsReadonly to return true for fully readonly object'
>

type Test_IsReadonly_False = AssertTrue<
  Equal<IsReadonly<FullyMutable>, false>,
  'Expected IsReadonly to return false for fully mutable object'
>

type Test_IsReadonly_Mixed = AssertTrue<
  Equal<IsReadonly<{ readonly a: number; b: string }>, false>,
  'Expected IsReadonly to return false when not all properties are readonly'
>

// -------------------------------------------
// IsPartial Tests
// -------------------------------------------

type Test_IsPartial_True = AssertTrue<
  Equal<IsPartial<PartiallyOptional>, true>,
  'Expected IsPartial to return true for partially optional object'
>

type Test_IsPartial_False = AssertTrue<
  Equal<IsPartial<FullyRequired>, false>,
  'Expected IsPartial to return false for fully required object'
>

type Test_IsPartial_Empty = AssertTrue<
  Equal<IsPartial<object>, true>,
  'Expected IsPartial to return true for empty object (all keys optional)'
>

// -------------------------------------------
// IsRequired Tests
// -------------------------------------------

type Test_IsRequired_True = AssertTrue<
  Equal<IsRequired<FullyRequired>, true>,
  'Expected IsRequired to return true for fully required object'
>

type Test_IsRequired_False = AssertTrue<
  Equal<IsRequired<PartiallyOptional>, false>,
  'Expected IsRequired to return false for partially optional object'
>

type Test_IsRequired_Empty = AssertTrue<
  Equal<IsRequired<object>, true>,
  'Expected IsRequired to return true for empty object (no optional keys)'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_IsMutable_True,
  Test_IsMutable_False,
  Test_IsMutable_Mixed,
  Test_IsReadonly_True,
  Test_IsReadonly_False,
  Test_IsReadonly_Mixed,
  Test_IsPartial_True,
  Test_IsPartial_False,
  Test_IsPartial_Empty,
  Test_IsRequired_True,
  Test_IsRequired_False,
  Test_IsRequired_Empty,
]

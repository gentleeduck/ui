import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type {
  Exact,
  IsBigIntLiteral,
  IsBooleanLiteral,
  IsLiteral,
  IsNumericLiteral,
  IsStringLiteral,
  LiteralUnion,
  Widen,
} from '.'

// LiteralUnion
type Size = LiteralUnion<'sm' | 'md' | 'lg', string>
type Test_LiteralUnion_Exact = AssertTrue<
  Equal<Extract<Size, 'sm'>, 'sm'>,
  'LiteralUnion keeps literal members accessible'
>
type Test_LiteralUnion_Wider = AssertTrue<
  Equal<'custom' extends Size ? true : false, true>,
  'LiteralUnion still accepts the wider type'
>

// Exact
type Test_Exact_Match = AssertTrue<
  Equal<Exact<{ name: string }, { name: string }>, { name: string }>,
  'Exact passes when shape matches exactly'
>
type Test_Exact_Mismatch = AssertTrue<
  Equal<Exact<{ name: string; extra: 1 }, { name: string }>, never>,
  'Exact fails when extra keys present'
>

// Widen
type Test_Widen_String = AssertTrue<Equal<Widen<'hello'>, string>, 'Widen string literal to string'>
type Test_Widen_Number = AssertTrue<Equal<Widen<42>, number>, 'Widen number literal to number'>
type Test_Widen_Bool = AssertTrue<Equal<Widen<true>, boolean>, 'Widen bool literal to boolean'>

// IsLiteral
type Test_IsLiteral_Yes = AssertTrue<IsLiteral<'hello'>, "'hello' is literal">
type Test_IsLiteral_No = AssertFalse<IsLiteral<string>, 'string is not a literal'>
type Test_IsLiteral_Num = AssertTrue<IsLiteral<42>, '42 is a literal'>

// IsStringLiteral / IsNumericLiteral / IsBooleanLiteral / IsBigIntLiteral
type Test_IsStringLit_Yes = AssertTrue<IsStringLiteral<'hi'>, "'hi' is a string literal">
type Test_IsStringLit_No = AssertFalse<IsStringLiteral<string>, 'string is not a literal'>
type Test_IsNumericLit_Yes = AssertTrue<IsNumericLiteral<42>, '42 is a numeric literal'>
type Test_IsNumericLit_No = AssertFalse<IsNumericLiteral<number>, 'number is not a literal'>
type Test_IsBooleanLit_Yes = AssertTrue<IsBooleanLiteral<true>, 'true is a boolean literal'>
type Test_IsBooleanLit_No = AssertFalse<IsBooleanLiteral<boolean>, 'boolean is not a literal'>
type Test_IsBigIntLit_Yes = AssertTrue<IsBigIntLiteral<1n>, '1n is a bigint literal'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_LiteralUnion_Exact,
  Test_LiteralUnion_Wider,
  Test_Exact_Match,
  Test_Exact_Mismatch,
  Test_Widen_String,
  Test_Widen_Number,
  Test_Widen_Bool,
  Test_IsLiteral_Yes,
  Test_IsLiteral_No,
  Test_IsLiteral_Num,
  Test_IsStringLit_Yes,
  Test_IsStringLit_No,
  Test_IsNumericLit_Yes,
  Test_IsNumericLit_No,
  Test_IsBooleanLit_Yes,
  Test_IsBooleanLit_No,
  Test_IsBigIntLit_Yes,
]

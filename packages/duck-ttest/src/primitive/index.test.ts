import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type {
  Arrayable,
  Falsy,
  IsNullable,
  IsOptional,
  IsPrimitive,
  Maybe,
  MultidimensionalArray,
  NonNullish,
  Nullable,
  Nullish,
  Primitive,
  Truthy,
} from '.'

// Primitive
type Test_Primitive_String = AssertTrue<Equal<Extract<Primitive, string>, string>, 'Primitive contains string'>
type Test_Primitive_Null = AssertTrue<Equal<Extract<Primitive, null>, null>, 'Primitive contains null'>

// Falsy
type Test_Falsy_Zero = AssertTrue<Equal<Extract<Falsy, 0>, 0>, 'Falsy contains 0'>
type Test_Falsy_EmptyString = AssertTrue<Equal<Extract<Falsy, ''>, ''>, 'Falsy contains empty string'>

// Truthy
type Test_Truthy = AssertTrue<
  Equal<Truthy<string | '' | 0 | null | number>, string | number>,
  'Truthy strips falsy values'
>

// Nullish / NonNullish
type Test_Nullish = AssertTrue<Equal<Nullish, null | undefined>, 'Nullish is null | undefined'>
type Test_NonNullish = AssertTrue<Equal<NonNullish<string | null | undefined>, string>, 'NonNullish strips nullish'>

// IsPrimitive
type Test_IsPrim_String = AssertTrue<IsPrimitive<string>, 'string is primitive'>
type Test_IsPrim_Object = AssertFalse<IsPrimitive<{ a: 1 }>, 'object is not primitive'>
type Test_IsPrim_Function = AssertFalse<IsPrimitive<() => void>, 'function is not primitive'>

// Arrayable
type Test_Arrayable_Scalar = AssertTrue<
  Equal<'foo' extends Arrayable<string> ? true : false, true>,
  'Arrayable accepts scalar'
>
type Test_Arrayable_Array = AssertTrue<
  Equal<readonly string[] extends Arrayable<string> ? true : false, true>,
  'Arrayable accepts array'
>

// MultidimensionalArray
type Test_Multi_Scalar = AssertTrue<
  Equal<1 extends MultidimensionalArray<number> ? true : false, true>,
  'Multidim accepts scalar'
>
type Test_Multi_Nested = AssertTrue<
  Equal<readonly number[][][] extends MultidimensionalArray<number> ? true : false, true>,
  'Multidim accepts deep nest'
>

// Nullable / Maybe
type Test_Nullable = AssertTrue<Equal<Nullable<string>, string | null>, 'Nullable adds null'>
type Test_Maybe = AssertTrue<Equal<Maybe<string>, string | null | undefined>, 'Maybe adds null | undefined'>

// IsOptional / IsNullable
type Test_IsOptional_Yes = AssertTrue<IsOptional<string | undefined>, 'string|undefined is optional-like'>
type Test_IsOptional_No = AssertFalse<IsOptional<string>, 'plain string is not optional-like'>
type Test_IsNullable_Yes = AssertTrue<IsNullable<string | null>, 'string|null is nullable'>
type Test_IsNullable_No = AssertFalse<IsNullable<string>, 'string alone is not nullable'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Primitive_String,
  Test_Primitive_Null,
  Test_Falsy_Zero,
  Test_Falsy_EmptyString,
  Test_Truthy,
  Test_Nullish,
  Test_NonNullish,
  Test_IsPrim_String,
  Test_IsPrim_Object,
  Test_IsPrim_Function,
  Test_Arrayable_Scalar,
  Test_Arrayable_Array,
  Test_Multi_Scalar,
  Test_Multi_Nested,
  Test_Nullable,
  Test_Maybe,
  Test_IsOptional_Yes,
  Test_IsOptional_No,
  Test_IsNullable_Yes,
  Test_IsNullable_No,
]

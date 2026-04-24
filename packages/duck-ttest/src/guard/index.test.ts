import type { AssertFalse, AssertTrue } from '~/assert'
import type {
  IsArray,
  IsArrayBuffer,
  IsAsyncIterable,
  IsBigInt,
  IsBoolean,
  IsDataView,
  IsDate,
  IsEmpty,
  IsError,
  IsFalse,
  IsFixedTuple,
  IsIterable,
  IsMap,
  IsNumber,
  IsObject,
  IsPromiseLike,
  IsReadonlyArray,
  IsRecord,
  IsRegExp,
  IsSet,
  IsString,
  IsSymbol,
  IsTrue,
  IsTypedArray,
  IsWeakMap,
  IsWeakSet,
} from '.'

// Scalars
type Test_IsString = AssertTrue<IsString<string>, 'string is string'>
type Test_IsString_Literal = AssertTrue<IsString<'hi'>, "'hi' is string">

type Test_IsNumber = AssertTrue<IsNumber<number>, 'number is number'>
type Test_IsBoolean_Union = AssertTrue<IsBoolean<true | false>, 'boolean union is boolean'>
type Test_IsBigInt = AssertTrue<IsBigInt<bigint>, 'bigint is bigint'>
type Test_IsSymbol = AssertTrue<IsSymbol<symbol>, 'symbol is symbol'>
type Test_IsString_False = AssertFalse<IsString<number>, 'number is not string'>

// IsObject
type Test_IsObject_Yes = AssertTrue<IsObject<{ a: 1 }>, 'record is object'>
type Test_IsObject_Array = AssertFalse<IsObject<number[]>, 'array is not plain object'>
type Test_IsObject_Fn = AssertFalse<IsObject<() => void>, 'function is not plain object'>
type Test_IsObject_Scalar = AssertFalse<IsObject<string>, 'string is not plain object'>

// Arrays
type Test_IsArray_Mut = AssertTrue<IsArray<number[]>, 'mutable array is array'>
type Test_IsArray_Readonly = AssertTrue<IsArray<readonly number[]>, 'readonly array is array'>
type Test_IsArray_No = AssertFalse<IsArray<{ a: 1 }>, 'record is not array'>
type Test_IsReadonlyArray_Yes = AssertTrue<IsReadonlyArray<readonly number[]>, 'readonly array is readonly'>
type Test_IsReadonlyArray_No = AssertFalse<IsReadonlyArray<number[]>, 'mutable array is not readonly'>

// IsEmpty
type Test_IsEmpty_String = AssertTrue<IsEmpty<''>, "'' is empty">
type Test_IsEmpty_Tuple = AssertTrue<IsEmpty<[]>, '[] is empty'>
// biome-ignore lint/complexity/noBannedTypes: testing empty record shape
type Test_IsEmpty_Record = AssertTrue<IsEmpty<{}>, '{} is empty'>
type Test_IsEmpty_Filled = AssertFalse<IsEmpty<[1]>, '[1] is not empty'>

// IsTrue / IsFalse
type Test_IsTrue = AssertTrue<IsTrue<true>, 'true is true'>
type Test_IsTrue_Bool = AssertFalse<IsTrue<boolean>, 'boolean is not exactly true'>
type Test_IsFalse = AssertTrue<IsFalse<false>, 'false is false'>

// Built-ins
type Test_IsDate = AssertTrue<IsDate<Date>, 'Date is Date'>
type Test_IsRegExp = AssertTrue<IsRegExp<RegExp>, 'RegExp is RegExp'>
type Test_IsError = AssertTrue<IsError<TypeError>, 'TypeError is Error'>
type Test_IsMap = AssertTrue<IsMap<Map<string, number>>, 'Map is map'>
type Test_IsSet = AssertTrue<IsSet<Set<string>>, 'Set is set'>
type Test_IsPromiseLike = AssertTrue<IsPromiseLike<Promise<number>>, 'Promise is PromiseLike'>

// IsRecord — narrow plain-object predicate
type Test_IsRecord_Yes = AssertTrue<IsRecord<{ a: 1 }>, 'plain record is a record'>
type Test_IsRecord_Array = AssertFalse<IsRecord<number[]>, 'array is not a record'>
type Test_IsRecord_Fn = AssertFalse<IsRecord<() => void>, 'function is not a record'>
type Test_IsRecord_Date = AssertFalse<IsRecord<Date>, 'Date is not a plain record'>
type Test_IsRecord_Map = AssertFalse<IsRecord<Map<string, number>>, 'Map is not a plain record'>

// IsIterable / IsAsyncIterable
type Test_IsIterable_Array = AssertTrue<IsIterable<number[]>, 'array is iterable'>
type Test_IsIterable_Set = AssertTrue<IsIterable<Set<string>>, 'Set is iterable'>
type Test_IsIterable_Number = AssertFalse<IsIterable<number>, 'number is not iterable'>
type Test_IsAsyncIterable = AssertTrue<IsAsyncIterable<AsyncIterable<string>>, 'AsyncIterable is an async iterable'>

// Weak collections
type Test_IsWeakMap = AssertTrue<IsWeakMap<WeakMap<object, number>>, 'WeakMap is weak'>
type Test_IsWeakSet = AssertTrue<IsWeakSet<WeakSet<object>>, 'WeakSet is weak'>

// Binary data
type Test_IsArrayBuffer = AssertTrue<IsArrayBuffer<ArrayBuffer>, 'ArrayBuffer is ArrayBuffer'>
type Test_IsDataView = AssertTrue<IsDataView<DataView>, 'DataView is DataView'>
type Test_IsTypedArray_U8 = AssertTrue<IsTypedArray<Uint8Array>, 'Uint8Array is a typed array'>
type Test_IsTypedArray_F32 = AssertTrue<IsTypedArray<Float32Array>, 'Float32Array is a typed array'>
type Test_IsTypedArray_Regular = AssertFalse<IsTypedArray<number[]>, 'regular number[] is not a typed array'>

// IsFixedTuple
type Test_IsFixedTuple_Yes = AssertTrue<IsFixedTuple<[1, 2, 3]>, '[1,2,3] is a fixed tuple'>
type Test_IsFixedTuple_No = AssertFalse<IsFixedTuple<number[]>, 'number[] is not a fixed tuple'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_IsString,
  Test_IsString_Literal,
  Test_IsNumber,
  Test_IsBoolean_Union,
  Test_IsBigInt,
  Test_IsSymbol,
  Test_IsString_False,
  Test_IsObject_Yes,
  Test_IsObject_Array,
  Test_IsObject_Fn,
  Test_IsObject_Scalar,
  Test_IsArray_Mut,
  Test_IsArray_Readonly,
  Test_IsArray_No,
  Test_IsReadonlyArray_Yes,
  Test_IsReadonlyArray_No,
  Test_IsEmpty_String,
  Test_IsEmpty_Tuple,
  Test_IsEmpty_Record,
  Test_IsEmpty_Filled,
  Test_IsTrue,
  Test_IsTrue_Bool,
  Test_IsFalse,
  Test_IsDate,
  Test_IsRegExp,
  Test_IsError,
  Test_IsMap,
  Test_IsSet,
  Test_IsPromiseLike,
  Test_IsRecord_Yes,
  Test_IsRecord_Array,
  Test_IsRecord_Fn,
  Test_IsRecord_Date,
  Test_IsRecord_Map,
  Test_IsIterable_Array,
  Test_IsIterable_Set,
  Test_IsIterable_Number,
  Test_IsAsyncIterable,
  Test_IsWeakMap,
  Test_IsWeakSet,
  Test_IsArrayBuffer,
  Test_IsDataView,
  Test_IsTypedArray_U8,
  Test_IsTypedArray_F32,
  Test_IsTypedArray_Regular,
  Test_IsFixedTuple_Yes,
  Test_IsFixedTuple_No,
]

import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { Append, Head, Last, Length, Prepend, Tail, Zip } from '.' // or wherever your utilities are

// -------------------------------------------
// Test Data
// -------------------------------------------

type Tuple1 = [1, 2, 3]
type Tuple2 = ['a', 'b', 'c']

// -------------------------------------------
// Head<T> Tests
// -------------------------------------------

type Test_Head_NonEmpty = AssertTrue<Equal<Head<Tuple1>, 1>, 'Expected Head to return first element of non-empty tuple'>

type Test_Head_Empty = AssertTrue<Equal<Head<[]>, never>, 'Expected Head to return never for empty tuple'>

// -------------------------------------------
// Tail<T> Tests
// -------------------------------------------

type Test_Tail_NonEmpty = AssertTrue<Equal<Tail<Tuple1>, [2, 3]>, 'Expected Tail to return all but first element'>

type Test_Tail_Single = AssertTrue<Equal<Tail<[1]>, []>, 'Expected Tail to return empty tuple for single-element tuple'>

type Test_Tail_Empty = AssertTrue<Equal<Tail<[]>, never>, 'Expected Tail to return never for empty tuple'>

// -------------------------------------------
// Last<T> Tests
// -------------------------------------------

type Test_Last_NonEmpty = AssertTrue<Equal<Last<Tuple1>, 3>, 'Expected Last to return last element of non-empty tuple'>

type Test_Last_Single = AssertTrue<
  Equal<Last<[42]>, 42>,
  'Expected Last to return the element itself for single-element tuple'
>

type Test_Last_Empty = AssertTrue<Equal<Last<[]>, never>, 'Expected Last to return never for empty tuple'>

// -------------------------------------------
// Prepend<E, T> Tests
// -------------------------------------------

type Test_Prepend = AssertTrue<
  Equal<Prepend<0, Tuple1>, [0, 1, 2, 3]>,
  'Expected Prepend to add element at the start of tuple'
>

type Test_Prepend_Empty = AssertTrue<Equal<Prepend<'x', []>, ['x']>, 'Expected Prepend to add element to empty tuple'>

// -------------------------------------------
// Append<T, E> Tests
// -------------------------------------------

type Test_Append = AssertTrue<
  Equal<Append<Tuple1, 4>, [1, 2, 3, 4]>,
  'Expected Append to add element at the end of tuple'
>

type Test_Append_Empty = AssertTrue<Equal<Append<[], 'x'>, ['x']>, 'Expected Append to add element to empty tuple'>

// -------------------------------------------
// Length<T> Tests
// -------------------------------------------

type Test_Length_NonEmpty = AssertTrue<
  Equal<Length<Tuple2>, 3>,
  'Expected Length to return correct length for non-empty tuple'
>

type Test_Length_Empty = AssertTrue<Equal<Length<[]>, 0>, 'Expected Length to return 0 for empty tuple'>

// -------------------------------------------
// Zip<T, U> Tests
// -------------------------------------------

type Test_Zip_Equal = AssertTrue<
  Equal<Zip<[1, 2], ['a', 'b']>, [[1, 'a'], [2, 'b']]>,
  'Expected Zip to combine tuples of equal length into tuple of pairs'
>

type Test_Zip_ShorterLeft = AssertTrue<
  Equal<Zip<[1], ['a', 'b']>, [[1, 'a']]>,
  'Expected Zip to combine up to the shorter tuple length (left shorter)'
>

type Test_Zip_ShorterRight = AssertTrue<
  Equal<Zip<[1, 2], ['a']>, [[1, 'a']]>,
  'Expected Zip to combine up to the shorter tuple length (right shorter)'
>

type Test_Zip_Empty = AssertTrue<
  Equal<Zip<[], []>, []>,
  'Expected Zip to return empty tuple when both inputs are empty'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Head_NonEmpty,
  Test_Head_Empty,
  Test_Tail_NonEmpty,
  Test_Tail_Single,
  Test_Tail_Empty,
  Test_Last_NonEmpty,
  Test_Last_Single,
  Test_Last_Empty,
  Test_Prepend,
  Test_Prepend_Empty,
  Test_Append,
  Test_Append_Empty,
  Test_Length_NonEmpty,
  Test_Length_Empty,
  Test_Zip_Equal,
  Test_Zip_ShorterLeft,
  Test_Zip_ShorterRight,
  Test_Zip_Empty,
]

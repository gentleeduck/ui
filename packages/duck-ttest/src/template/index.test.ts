import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { CapitalizeWords, SnakeToCamel, Trim, TrimLeft, TrimRight } from '.'

// -------------------------------------------
// TrimLeft Tests
// -------------------------------------------

type Test_TrimLeft_Normal = AssertTrue<
  Equal<TrimLeft<'   hello'>, 'hello'>,
  'Expected TrimLeft to remove leading spaces'
>

type Test_TrimLeft_Tabs = AssertTrue<Equal<TrimLeft<'\t\tfoo'>, 'foo'>, 'Expected TrimLeft to remove leading tabs'>

type Test_TrimLeft_Newlines = AssertTrue<
  Equal<TrimLeft<'\n\nbar'>, 'bar'>,
  'Expected TrimLeft to remove leading newlines'
>

type Test_TrimLeft_Empty = AssertTrue<
  Equal<TrimLeft<'     '>, ''>,
  'Expected TrimLeft to return empty string when only whitespace'
>

type Test_TrimLeft_NoWhitespace = AssertTrue<
  Equal<TrimLeft<'world'>, 'world'>,
  'Expected TrimLeft to return same string when no leading whitespace'
>

// -------------------------------------------
// TrimRight Tests
// -------------------------------------------

type Test_TrimRight_Normal = AssertTrue<
  Equal<TrimRight<'hello   '>, 'hello'>,
  'Expected TrimRight to remove trailing spaces'
>

type Test_TrimRight_Tabs = AssertTrue<Equal<TrimRight<'foo\t\t'>, 'foo'>, 'Expected TrimRight to remove trailing tabs'>

type Test_TrimRight_Newlines = AssertTrue<
  Equal<TrimRight<'bar\n\n'>, 'bar'>,
  'Expected TrimRight to remove trailing newlines'
>

type Test_TrimRight_Empty = AssertTrue<
  Equal<TrimRight<'     '>, ''>,
  'Expected TrimRight to return empty string when only whitespace'
>

type Test_TrimRight_NoWhitespace = AssertTrue<
  Equal<TrimRight<'world'>, 'world'>,
  'Expected TrimRight to return same string when no trailing whitespace'
>

// -------------------------------------------
// Trim Tests
// -------------------------------------------

type Test_Trim_BothEnds = AssertTrue<
  Equal<Trim<'   hello   '>, 'hello'>,
  'Expected Trim to remove whitespace from both ends'
>

type Test_Trim_NewlinesTabs = AssertTrue<
  Equal<Trim<'\n\t goodbye\t\n'>, 'goodbye'>,
  'Expected Trim to remove tabs and newlines from both ends'
>

type Test_Trim_Empty = AssertTrue<
  Equal<Trim<'     '>, ''>,
  'Expected Trim to return empty string when input is only whitespace'
>

type Test_Trim_None = AssertTrue<Equal<Trim<'clean'>, 'clean'>, 'Expected Trim to leave clean string untouched'>

// -------------------------------------------
// CapitalizeWords Tests
// -------------------------------------------

type Test_CapitalizeWords_Simple = AssertTrue<
  Equal<CapitalizeWords<'hello world'>, 'Hello World'>,
  'Expected CapitalizeWords to capitalize first letter of each word'
>

type Test_CapitalizeWords_MixedCase = AssertTrue<
  Equal<CapitalizeWords<'GOOD night moon'>, 'Good Night Moon'>,
  'Expected CapitalizeWords to lowercase and then capitalize each word'
>

type Test_CapitalizeWords_Single = AssertTrue<
  Equal<CapitalizeWords<'typescript'>, 'Typescript'>,
  'Expected CapitalizeWords to capitalize a single word'
>

type Test_CapitalizeWords_UpperCase = AssertTrue<
  Equal<CapitalizeWords<'MAKE it WORK'>, 'Make It Work'>,
  'Expected CapitalizeWords to normalize and capitalize all words'
>

type Test_CapitalizeWords_Empty = AssertTrue<
  Equal<CapitalizeWords<''>, ''>,
  'Expected CapitalizeWords to return empty string when input is empty'
>

// -------------------------------------------
// SnakeToCamel Tests
// -------------------------------------------

type Test_SnakeToCamel_Simple = AssertTrue<
  Equal<SnakeToCamel<'hello_world'>, 'helloWorld'>,
  'Expected SnakeToCamel to convert snake_case to camelCase'
>

type Test_SnakeToCamel_Deep = AssertTrue<
  Equal<SnakeToCamel<'foo_bar_baz'>, 'fooBarBaz'>,
  'Expected SnakeToCamel to convert multiple parts into camelCase'
>

type Test_SnakeToCamel_Single = AssertTrue<
  Equal<SnakeToCamel<'one'>, 'one'>,
  'Expected SnakeToCamel to return string as-is if no underscores'
>

type Test_SnakeToCamel_Empty = AssertTrue<
  Equal<SnakeToCamel<''>, ''>,
  'Expected SnakeToCamel to return empty string when input is empty'
>

type Test_SnakeToCamel_MultipleUnderscores = AssertTrue<
  Equal<SnakeToCamel<'a_b_c_d'>, 'aBCD'>,
  'Expected SnakeToCamel to convert each segment after first to capitalized'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_TrimLeft_Normal,
  Test_TrimLeft_Tabs,
  Test_TrimLeft_Newlines,
  Test_TrimLeft_Empty,
  Test_TrimLeft_NoWhitespace,
  Test_TrimRight_Normal,
  Test_TrimRight_Tabs,
  Test_TrimRight_Newlines,
  Test_TrimRight_Empty,
  Test_TrimRight_NoWhitespace,
  Test_Trim_BothEnds,
  Test_Trim_NewlinesTabs,
  Test_Trim_Empty,
  Test_Trim_None,
  Test_CapitalizeWords_Simple,
  Test_CapitalizeWords_MixedCase,
  Test_CapitalizeWords_Single,
  Test_CapitalizeWords_UpperCase,
  Test_CapitalizeWords_Empty,
  Test_SnakeToCamel_Simple,
  Test_SnakeToCamel_Deep,
  Test_SnakeToCamel_Single,
  Test_SnakeToCamel_Empty,
  Test_SnakeToCamel_MultipleUnderscores,
]

import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { EndsAnyOf, FilterMatching, IncludesAnyOf, MatchesGlob, StartsAnyOf } from '.'

// MatchesGlob — basic `*`
type Test_Star_Ts = AssertTrue<MatchesGlob<'hello.ts', '*.ts'>, "'hello.ts' matches '*.ts'">
type Test_Star_Miss = AssertFalse<MatchesGlob<'hello.js', '*.ts'>, "'hello.js' does not match '*.ts'">

// `**` path glob
type Test_DoubleStar = AssertTrue<MatchesGlob<'src/a/b.ts', 'src/**'>, "'src/a/b.ts' matches 'src/**'">

// `?` single-char wildcard
type Test_Question = AssertTrue<MatchesGlob<'abc', 'a?c'>, "'abc' matches 'a?c'">
type Test_Question_Miss = AssertFalse<MatchesGlob<'abcd', 'a?c'>, "'abcd' does not match 'a?c'">

// Literal match
type Test_Literal = AssertTrue<MatchesGlob<'exact', 'exact'>, 'literal match'>

// StartsAnyOf / EndsAnyOf / IncludesAnyOf
type Test_StartsAnyOf_Yes = AssertTrue<
  StartsAnyOf<'hello', ['hi', 'hello', 'hey']>,
  "'hello' starts with one of the prefixes"
>
type Test_StartsAnyOf_No = AssertFalse<StartsAnyOf<'world', ['hi', 'hello']>, "'world' does not start with any prefix">
type Test_EndsAnyOf_Yes = AssertTrue<
  EndsAnyOf<'file.ts', ['.js', '.ts', '.tsx']>,
  "'file.ts' ends with one of the suffixes"
>
type Test_IncludesAnyOf_Yes = AssertTrue<
  IncludesAnyOf<'hello world', ['xyz', 'wor', 'abc']>,
  "'hello world' includes 'wor'"
>

// FilterMatching
type Test_FilterMatching = AssertTrue<
  Equal<FilterMatching<['a.ts', 'b.js', 'c.ts', 'd.tsx'], '*.ts'>, ['a.ts', 'c.ts']>,
  'FilterMatching keeps only matching files'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Star_Ts,
  Test_Star_Miss,
  Test_DoubleStar,
  Test_Question,
  Test_Question_Miss,
  Test_Literal,
  Test_StartsAnyOf_Yes,
  Test_StartsAnyOf_No,
  Test_EndsAnyOf_Yes,
  Test_IncludesAnyOf_Yes,
  Test_FilterMatching,
]

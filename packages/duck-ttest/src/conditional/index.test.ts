import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { If, IfExtends, Match, Switch } from '.'

// If
type Test_If_Then = AssertTrue<Equal<If<true, 'yes', 'no'>, 'yes'>, 'If picks Then'>
type Test_If_Else = AssertTrue<Equal<If<false, 'yes', 'no'>, 'no'>, 'If picks Else'>

// IfExtends
type Test_IfExtends_Yes = AssertTrue<Equal<IfExtends<string, unknown, 'y', 'n'>, 'y'>, 'string extends unknown'>
type Test_IfExtends_No = AssertTrue<Equal<IfExtends<string, number, 'y', 'n'>, 'n'>, 'string does not extend number'>

// Switch
type Test_Switch_Hit = AssertTrue<Equal<Switch<'a', { a: 1; b: 2 }, 0>, 1>, 'Switch hits case a'>
type Test_Switch_Default = AssertTrue<Equal<Switch<'c', { a: 1; b: 2 }, 0>, 0>, 'Switch falls through to default'>

// Match
type Test_Match_Hit = AssertTrue<Equal<Match<'b', [['a', 1], ['b', 2], ['c', 3]]>, 2>, 'Match finds b => 2'>
type Test_Match_Default = AssertTrue<
  Equal<Match<'x', [['a', 1], ['b', 2]], 'default'>, 'default'>,
  'Match falls through to default'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_If_Then,
  Test_If_Else,
  Test_IfExtends_Yes,
  Test_IfExtends_No,
  Test_Switch_Hit,
  Test_Switch_Default,
  Test_Match_Hit,
  Test_Match_Default,
]

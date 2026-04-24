import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { And, If, Not, Or, Xnor, Xor } from '.'

// And
type Test_And_TT = AssertTrue<And<true, true>, 'true AND true == true'>
type Test_And_TF = AssertFalse<And<true, false>, 'true AND false == false'>
type Test_And_FT = AssertFalse<And<false, true>, 'false AND true == false'>
type Test_And_FF = AssertFalse<And<false, false>, 'false AND false == false'>

// Or
type Test_Or_TT = AssertTrue<Or<true, true>, 'true OR true == true'>
type Test_Or_TF = AssertTrue<Or<true, false>, 'true OR false == true'>
type Test_Or_FT = AssertTrue<Or<false, true>, 'false OR true == true'>
type Test_Or_FF = AssertFalse<Or<false, false>, 'false OR false == false'>

// Not
type Test_Not_True = AssertFalse<Not<true>, 'NOT true == false'>
type Test_Not_False = AssertTrue<Not<false>, 'NOT false == true'>

// Xor
type Test_Xor_TT = AssertFalse<Xor<true, true>, 'true XOR true == false'>
type Test_Xor_TF = AssertTrue<Xor<true, false>, 'true XOR false == true'>
type Test_Xor_FT = AssertTrue<Xor<false, true>, 'false XOR true == true'>
type Test_Xor_FF = AssertFalse<Xor<false, false>, 'false XOR false == false'>

// Xnor
type Test_Xnor_TT = AssertTrue<Xnor<true, true>, 'true XNOR true == true'>
type Test_Xnor_FF = AssertTrue<Xnor<false, false>, 'false XNOR false == true'>
type Test_Xnor_TF = AssertFalse<Xnor<true, false>, 'true XNOR false == false'>

// If
type Test_If_Then = AssertTrue<Equal<If<true, 'yes', 'no'>, 'yes'>, 'If picks Then when true'>
type Test_If_Else = AssertTrue<Equal<If<false, 'yes', 'no'>, 'no'>, 'If picks Else when false'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_And_TT,
  Test_And_TF,
  Test_And_FT,
  Test_And_FF,
  Test_Or_TT,
  Test_Or_TF,
  Test_Or_FT,
  Test_Or_FF,
  Test_Not_True,
  Test_Not_False,
  Test_Xor_TT,
  Test_Xor_TF,
  Test_Xor_FT,
  Test_Xor_FF,
  Test_Xnor_TT,
  Test_Xnor_FF,
  Test_Xnor_TF,
  Test_If_Then,
  Test_If_Else,
]

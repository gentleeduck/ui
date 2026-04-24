import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { Apply, FilterTuple, Fn, FnNot, Identity, MapTuple, Reduce, Singleton, Stringify } from '.'

// Identity
type Test_Identity = AssertTrue<Equal<Apply<Identity, 'hello'>, 'hello'>, 'Identity returns input'>

// Stringify
type Test_Stringify = AssertTrue<Equal<Apply<Stringify, 42>, '42'>, 'Stringify<42> = "42"'>

// Singleton
type Test_Singleton = AssertTrue<Equal<Apply<Singleton, 'x'>, ['x']>, 'Singleton wraps in tuple'>

// FnNot
type Test_FnNot_True = AssertTrue<Equal<Apply<FnNot, true>, false>, 'FnNot(true) = false'>
type Test_FnNot_False = AssertTrue<Equal<Apply<FnNot, false>, true>, 'FnNot(false) = true'>

// MapTuple
type Test_MapTuple = AssertTrue<Equal<MapTuple<[1, 2, 3], Stringify>, ['1', '2', '3']>, 'MapTuple maps each element'>

// FilterTuple — keep truthy booleans
interface IsTrue extends Fn {
  readonly return: this['arg'] extends true ? true : false
}
type Test_FilterTuple = AssertTrue<
  Equal<FilterTuple<[true, false, true, false], IsTrue>, [true, true]>,
  'FilterTuple keeps matching elements'
>

// Reduce — append items to a tuple accumulator
interface AppendFn extends Fn {
  readonly return: this['arg'] extends [infer A extends unknown[], infer B] ? [...A, B] : never
}
type Test_Reduce = AssertTrue<Equal<Reduce<[1, 2, 3], [], AppendFn>, [1, 2, 3]>, 'Reduce folds tuple'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Identity,
  Test_Stringify,
  Test_Singleton,
  Test_FnNot_True,
  Test_FnNot_False,
  Test_MapTuple,
  Test_FilterTuple,
  Test_Reduce,
]

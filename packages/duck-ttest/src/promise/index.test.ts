import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { DeepAwaited, IsPromise, MaybePromise, Promisable, PromiseAll, UnwrapPromise } from '.'

// UnwrapPromise
type Test_Unwrap = AssertTrue<Equal<UnwrapPromise<Promise<string>>, string>, 'UnwrapPromise<Promise<string>> is string'>
type Test_Unwrap_Non = AssertTrue<Equal<UnwrapPromise<number>, number>, 'UnwrapPromise of non-promise is identity'>

// DeepAwaited
type Test_DeepAwaited = AssertTrue<
  Equal<DeepAwaited<Promise<Promise<string>>>, string>,
  'DeepAwaited unwraps recursively'
>

// MaybePromise / Promisable
type Test_MaybePromise = AssertTrue<
  Equal<MaybePromise<number>, number | Promise<number>>,
  'MaybePromise is T | Promise<T>'
>
type Test_Promisable = AssertTrue<Equal<Promisable<string>, MaybePromise<string>>, 'Promisable aliases MaybePromise'>

// PromiseAll
type Test_PromiseAll = AssertTrue<
  Equal<PromiseAll<[Promise<1>, Promise<'x'>, 3]>, [1, 'x', 3]>,
  'PromiseAll awaits each slot'
>

// IsPromise
type Test_IsPromise_Yes = AssertTrue<IsPromise<Promise<number>>, 'Promise<number> is a promise'>
type Test_IsPromise_No = AssertFalse<IsPromise<number>, 'number is not a promise'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Unwrap,
  Test_Unwrap_Non,
  Test_DeepAwaited,
  Test_MaybePromise,
  Test_Promisable,
  Test_PromiseAll,
  Test_IsPromise_Yes,
  Test_IsPromise_No,
]

// ===== Import Test Helpers =====
import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'

// ===== Import Utility Types =====
import type { Diff, Expand, Merge, OmitByValue, PickByValue } from '.'

// ===== Test: Expand =====
type Expand_Input = { a: 1 } & { b: 2 }
type Expand_Expected = { a: 1; b: 2 }

type Test_Expand = AssertTrue<
  Equal<Expand<Expand_Input>, Expand_Expected>,
  'Expected Expand to flatten intersection type to a single object'
>

// ===== Test: Merge =====
type Merge_A = { a: 1; b: 2 }
type Merge_B = { b: 3; c: 4 }
type Merge_Expected = { a: 1; b: 3; c: 4 }

type Test_Merge = AssertTrue<
  Equal<Merge<Merge_A, Merge_B>, Merge_Expected>,
  'Expected Merge to override shared keys and combine properties'
>

// ===== Test: Diff =====
type Diff_A = { a: 1; b: 2; c: 3 }
type Diff_B = { b: any; d: any }
type Diff_Expected = { a: 1; c: 3 }

type Test_Diff = AssertTrue<
  Equal<Diff<Diff_A, Diff_B>, Diff_Expected>,
  'Expected Diff to remove keys present in second type from first'
>

// ===== Test: PickByValue =====
type PBV_Input = { a: 1; b: 's'; c: 2 }
type PBV_Expected = { a: 1; c: 2 }

type Test_PickByValue = AssertTrue<
  Equal<PickByValue<PBV_Input, number>, PBV_Expected>,
  'Expected PickByValue to extract properties of matching value type'
>

// ===== Test: OmitByValue =====
type OBV_Input = { a: 1; b: 's'; c: 2 }
type OBV_Expected = { b: 's' }

type Test_OmitByValue = AssertTrue<
  Equal<OmitByValue<OBV_Input, number>, OBV_Expected>,
  'Expected OmitByValue to remove properties of given value type'
>

/* @__IGNORED__@ */ type _IGNORE = [Test_Expand, Test_Merge, Test_Diff, Test_PickByValue, Test_OmitByValue]

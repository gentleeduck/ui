// === Assertion Helpers Tests ===

import type { AssertFalse, AssertTrue } from '.'

// INFO: Should compile: `true` is assignable to `true`
type TestExpect_Pass = AssertTrue<true, 'Should be true'>

// FIX: Should error: `false` is not assignable to `true`
// type TestExpect_Fail    = Expect<false>; // ↳ Compile-time error

// INFO: Should compile: `false` is assignable to `false`
type TestExpectFalse_Pass = AssertFalse<false, 'Should be false'>

// FIX: Should error: `true` is not assignable to `false`
// type TestExpectFalse_Fail = ExpectFalse<true>; // ↳ Compile-time error

/* @__IGNORED__@ */ type _IGNORE = [TestExpect_Pass, TestExpectFalse_Pass]

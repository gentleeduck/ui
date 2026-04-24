import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { IfAny, IfNever, IfUnknown, IsAny, IsNever, IsUnknown, IsVoid, NotAny } from '.'

// IsAny
type Test_IsAny_Any = AssertTrue<IsAny<any>, 'any should be any'>
type Test_IsAny_Unknown = AssertFalse<IsAny<unknown>, 'unknown is not any'>
type Test_IsAny_Never = AssertFalse<IsAny<never>, 'never is not any'>
type Test_IsAny_String = AssertFalse<IsAny<string>, 'string is not any'>

// IsNever
type Test_IsNever_Never = AssertTrue<IsNever<never>, 'never is never'>
type Test_IsNever_Any = AssertFalse<IsNever<any>, 'any is not never'>
type Test_IsNever_String = AssertFalse<IsNever<string>, 'string is not never'>

// IsUnknown
type Test_IsUnknown_Unknown = AssertTrue<IsUnknown<unknown>, 'unknown is unknown'>
type Test_IsUnknown_Any = AssertFalse<IsUnknown<any>, 'any is not unknown'>
type Test_IsUnknown_String = AssertFalse<IsUnknown<string>, 'string is not unknown'>

// IsVoid
type Test_IsVoid_Void = AssertTrue<IsVoid<void>, 'void is void'>
type Test_IsVoid_Undefined = AssertFalse<IsVoid<undefined>, 'undefined is not void'>

// NotAny
type Test_NotAny_String = AssertTrue<NotAny<string>, 'string is not any'>
type Test_NotAny_Any = AssertFalse<NotAny<any>, 'any is any'>

// IfAny
type Test_IfAny_True = AssertTrue<Equal<IfAny<any, 'yes', 'no'>, 'yes'>, 'IfAny branches to Then on any'>
type Test_IfAny_False = AssertTrue<Equal<IfAny<string, 'yes', 'no'>, 'no'>, 'IfAny branches to Else on non-any'>

// IfNever
type Test_IfNever_True = AssertTrue<Equal<IfNever<never, 'yes', 'no'>, 'yes'>, 'IfNever branches to Then on never'>
type Test_IfNever_False = AssertTrue<Equal<IfNever<string, 'yes', 'no'>, 'no'>, 'IfNever branches to Else on non-never'>

// IfUnknown
type Test_IfUnknown_True = AssertTrue<
  Equal<IfUnknown<unknown, 'yes', 'no'>, 'yes'>,
  'IfUnknown branches to Then on unknown'
>
type Test_IfUnknown_False = AssertTrue<
  Equal<IfUnknown<string, 'yes', 'no'>, 'no'>,
  'IfUnknown branches to Else on non-unknown'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_IsAny_Any,
  Test_IsAny_Unknown,
  Test_IsAny_Never,
  Test_IsAny_String,
  Test_IsNever_Never,
  Test_IsNever_Any,
  Test_IsNever_String,
  Test_IsUnknown_Unknown,
  Test_IsUnknown_Any,
  Test_IsUnknown_String,
  Test_IsVoid_Void,
  Test_IsVoid_Undefined,
  Test_NotAny_String,
  Test_NotAny_Any,
  Test_IfAny_True,
  Test_IfAny_False,
  Test_IfNever_True,
  Test_IfNever_False,
  Test_IfUnknown_True,
  Test_IfUnknown_False,
]

import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type {
  Err,
  IsErr,
  IsNone,
  IsOk,
  IsSome,
  MapOption,
  MapResult,
  None,
  Ok,
  OkOrElse,
  Option,
  Result,
  Some,
  SomeOrElse,
  UnwrapErr,
  UnwrapOk,
  UnwrapSome,
} from '.'

// Ok / Err shape
type OkOfNumber = Ok<42>
type ErrOfString = Err<'oops'>
type Test_Ok_Tag = AssertTrue<Equal<OkOfNumber['ok'], true>, 'Ok has ok: true'>
type Test_Err_Tag = AssertTrue<Equal<ErrOfString['ok'], false>, 'Err has ok: false'>

// Result narrowing
type Parse = Result<number, 'NotANumber'>
type Test_Result_Union = AssertTrue<Equal<Parse, Ok<number> | Err<'NotANumber'>>, 'Result is union of Ok and Err'>

// IsOk / IsErr
type Test_IsOk_Yes = AssertTrue<IsOk<Ok<1>>, 'Ok<1> is ok'>
type Test_IsOk_No = AssertFalse<IsOk<Err<'e'>>, 'Err is not ok'>
type Test_IsErr_Yes = AssertTrue<IsErr<Err<'e'>>, 'Err<e> is err'>

// UnwrapOk / UnwrapErr
type Test_UnwrapOk = AssertTrue<Equal<UnwrapOk<Ok<42>>, 42>, 'UnwrapOk extracts value'>
type Test_UnwrapErr = AssertTrue<Equal<UnwrapErr<Err<'e'>>, 'e'>, 'UnwrapErr extracts error'>

// Option
type MaybeUser = Option<{ name: string }>
type Test_Option_Union = AssertTrue<Equal<MaybeUser, Some<{ name: string }> | None>, 'Option is Some | None'>

// IsSome / IsNone
type Test_IsSome_Yes = AssertTrue<IsSome<Some<1>>, 'Some<1> is some'>
type Test_IsNone_Yes = AssertTrue<IsNone<None>, 'None is none'>
type Test_IsSome_No = AssertFalse<IsSome<None>, 'None is not some'>

// UnwrapSome
type Test_UnwrapSome = AssertTrue<Equal<UnwrapSome<Some<42>>, 42>, 'UnwrapSome extracts'>

// OkOrElse / SomeOrElse
type Test_OkOrElse_Ok = AssertTrue<Equal<OkOrElse<Ok<42>, 0>, 42>, 'OkOrElse on Ok returns value'>
type Test_OkOrElse_Err = AssertTrue<Equal<OkOrElse<Err<'e'>, 0>, 0>, 'OkOrElse on Err returns default'>
type Test_SomeOrElse_None = AssertTrue<Equal<SomeOrElse<None, 'def'>, 'def'>, 'SomeOrElse on None returns default'>

// MapResult / MapOption — using the HKT encoding from ~/fp
interface Stringify {
  readonly arg: unknown
  readonly return: `${this['arg'] & (string | number | boolean | bigint)}`
}
type Test_MapResult_Ok = AssertTrue<Equal<MapResult<Ok<42>, Stringify>, Ok<'42'>>, 'MapResult applies F to Ok'>
type Test_MapResult_Err = AssertTrue<Equal<MapResult<Err<'e'>, Stringify>, Err<'e'>>, 'MapResult preserves Err'>
type Test_MapOption_Some = AssertTrue<Equal<MapOption<Some<42>, Stringify>, Some<'42'>>, 'MapOption applies F to Some'>
type Test_MapOption_None = AssertTrue<Equal<MapOption<None, Stringify>, None>, 'MapOption preserves None'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Ok_Tag,
  Test_Err_Tag,
  Test_Result_Union,
  Test_IsOk_Yes,
  Test_IsOk_No,
  Test_IsErr_Yes,
  Test_UnwrapOk,
  Test_UnwrapErr,
  Test_Option_Union,
  Test_IsSome_Yes,
  Test_IsNone_Yes,
  Test_IsSome_No,
  Test_UnwrapSome,
  Test_OkOrElse_Ok,
  Test_OkOrElse_Err,
  Test_SomeOrElse_None,
  Test_MapResult_Ok,
  Test_MapResult_Err,
  Test_MapOption_Some,
  Test_MapOption_None,
]

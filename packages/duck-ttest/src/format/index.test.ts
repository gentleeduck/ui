import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type {
  Email,
  HexColor,
  HttpUrl,
  IPv4,
  ISODate,
  ISODateTime,
  ISOTime,
  JWT,
  PhoneE164,
  RgbColor,
  Semver,
  URLString,
  UUID,
} from '.'

// UUID
type Test_UUID = AssertTrue<
  Equal<'550e8400-e29b-41d4-a716-446655440000' extends UUID ? true : false, true>,
  'literal UUID matches UUID shape'
>

// Email
type Test_Email_Yes = AssertTrue<Equal<'me@example.com' extends Email ? true : false, true>, 'simple email matches'>
type Test_Email_No = AssertTrue<Equal<'not-an-email' extends Email ? true : false, false>, 'non-email rejected'>

// HttpUrl
type Test_HttpUrl = AssertTrue<
  Equal<'https://example.com/a' extends HttpUrl ? true : false, true>,
  'https URL matches HttpUrl'
>

// URLString
type Test_URLString = AssertTrue<
  Equal<'file:///tmp/a' extends URLString ? true : false, true>,
  'any scheme matches URLString'
>

// IPv4
type Test_IPv4 = AssertTrue<Equal<'192.168.1.1' extends IPv4 ? true : false, true>, 'dotted quad matches IPv4'>

// ISO dates
type Test_ISODate = AssertTrue<Equal<'2026-04-23' extends ISODate ? true : false, true>, 'ISODate shape match'>
type Test_ISOTime = AssertTrue<Equal<'12:34:56' extends ISOTime ? true : false, true>, 'ISOTime shape match'>
type Test_ISODateTime = AssertTrue<
  Equal<'2026-04-23T12:34:56Z' extends ISODateTime ? true : false, true>,
  'ISODateTime shape match'
>

// HexColor
type Test_HexColor = AssertTrue<Equal<'#ff00aa' extends HexColor ? true : false, true>, '#ff00aa is HexColor'>

// RgbColor
type Test_RgbColor = AssertTrue<
  Equal<'rgb(255, 0, 128)' extends RgbColor ? true : false, true>,
  'rgb(…) matches RgbColor'
>

// Semver
type Test_Semver_Basic = AssertTrue<Equal<'1.2.3' extends Semver ? true : false, true>, 'basic semver matches'>
type Test_Semver_Prerelease = AssertTrue<
  Equal<'1.2.3-beta.1' extends Semver ? true : false, true>,
  'prerelease semver matches'
>

// PhoneE164
type Test_Phone = AssertTrue<Equal<'+15551234567' extends PhoneE164 ? true : false, true>, '+15551234567 is E164'>

// JWT
type Test_JWT = AssertTrue<Equal<'header.payload.signature' extends JWT ? true : false, true>, 'JWT shape match'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_UUID,
  Test_Email_Yes,
  Test_Email_No,
  Test_HttpUrl,
  Test_URLString,
  Test_IPv4,
  Test_ISODate,
  Test_ISOTime,
  Test_ISODateTime,
  Test_HexColor,
  Test_RgbColor,
  Test_Semver_Basic,
  Test_Semver_Prerelease,
  Test_Phone,
  Test_JWT,
]

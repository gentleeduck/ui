import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { Day, DaysInMonth, Hours, IsLeapYear, Milliseconds, Month, Seconds, TimeOf, Year } from '.'

// Year / Month / Day
type Test_Year = AssertTrue<Equal<Year<'2026-04-23'>, 2026>, "Year<'2026-04-23'> = 2026">
type Test_Month = AssertTrue<Equal<Month<'2026-04-23'>, 4>, "Month<'2026-04-23'> = 4">
type Test_Day = AssertTrue<Equal<Day<'2026-04-23'>, 23>, "Day<'2026-04-23'> = 23">

// TimeOf from ISO datetime
type Test_TimeOf_Z = AssertTrue<Equal<TimeOf<'2026-04-23T12:34:56Z'>, '12:34:56'>, 'TimeOf strips Z'>
type Test_TimeOf_Offset = AssertTrue<Equal<TimeOf<'2026-04-23T12:34:56+02:00'>, '12:34:56'>, 'TimeOf strips + offset'>

// IsLeapYear
type Test_Leap_2024 = AssertTrue<IsLeapYear<2024>, '2024 is leap'>
type Test_Leap_2025 = AssertFalse<IsLeapYear<2025>, '2025 is not leap'>
type Test_Leap_1900 = AssertFalse<IsLeapYear<1900>, '1900 is not leap (century not /400)'>
type Test_Leap_2000 = AssertTrue<IsLeapYear<2000>, '2000 is leap (/400)'>

// DaysInMonth
type Test_Days_Jan = AssertTrue<Equal<DaysInMonth<2025, 1>, 31>, 'January = 31'>
type Test_Days_Feb_NonLeap = AssertTrue<Equal<DaysInMonth<2025, 2>, 28>, 'Feb 2025 = 28'>
type Test_Days_Feb_Leap = AssertTrue<Equal<DaysInMonth<2024, 2>, 29>, 'Feb 2024 = 29'>
type Test_Days_Apr = AssertTrue<Equal<DaysInMonth<2025, 4>, 30>, 'April = 30'>

// Duration brand distinctness
declare const ms: Milliseconds
declare const s: Seconds
declare const h: Hours
// biome-ignore lint/correctness/noUnusedVariables: type-level check only
type _DurationsDistinct = [
  AssertTrue<Equal<Milliseconds extends Seconds ? true : false, false>, 'ms and s are nominally distinct'>,
  AssertTrue<Equal<Hours extends number ? true : false, true>, 'Hours is structurally a number'>,
]

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Year,
  Test_Month,
  Test_Day,
  Test_TimeOf_Z,
  Test_TimeOf_Offset,
  Test_Leap_2024,
  Test_Leap_2025,
  Test_Leap_1900,
  Test_Leap_2000,
  Test_Days_Jan,
  Test_Days_Feb_NonLeap,
  Test_Days_Feb_Leap,
  Test_Days_Apr,
  typeof ms,
  typeof s,
  typeof h,
]

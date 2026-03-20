# duck-calendar Implementation Plan

A headless, framework-agnostic calendar engine that replaces react-day-picker.

> This plan covers **issue #304** (package setup + date adapter) and **issue #305** (core pure functions). Issues #306–#313 (React hooks, compound components, a11y, migration, docs, bundle audit) come after.

## The big picture

This library is a **data pipeline**, not a UI component. It takes a month and some options, and returns plain objects describing what to render. Your UI component (registry-ui Calendar) consumes these objects and renders them however it wants.

```
Input:  adapter + month + selection + options
  ↓
  ┌─────────────┐
  │ Grid Builder │ → 2D array of day cells (weeks × days)
  └──────┬──────┘       also: year view (12 months), decade view (12 years)
         ↓
  ┌─────────────────┐
  │ Selection Logic  │ → marks cells as selected / range / disabled
  └──────┬──────────┘
         ↓
  ┌─────────────────┐
  │ Navigation       │ → computes next/prev month/year/decade within bounds
  └──────┬──────────┘
         ↓
Output: plain data objects → your React component renders them
```

No React. No DOM. No styling. Just pure functions: data in, data out.

## Why a DateAdapter?

The calendar grid doesn't care what date object you use. It just needs to ask "what's the first day of this month?" and "add 7 days." The adapter answers these questions for any date type.

Without it, every function is hardcoded to `new Date()` and you can never support Persian calendars, dayjs, or Temporal. With it, someone writes a 30-line adapter and the whole engine works with their date library.

Your existing calendar already supports Persian dates (react-day-picker/persian). The adapter preserves that capability.

```ts
// The adapter is just a bag of date operations
const adapter = nativeDateAdapter // uses built-in Date + Intl

adapter.startOfMonth(someDate)    // → first day of that month
adapter.addDays(someDate, 7)      // → 7 days later
adapter.format(someDate, { month: 'long' }, 'en-US') // → "March"
```

## Related issues roadmap

| Issue | What | Depends on |
|-------|------|------------|
| **#304** | Package setup + DateAdapter | — |
| **#305** | Core pure functions (grid, selection, navigation) | #304 |
| #306 | React hooks (useCalendar, useKeyboard, useAnnouncer) | #305 |
| #307 | Compound components (Calendar, CalendarGrid, CalendarDay) | #306 |
| #308 | Accessibility audit and ARIA compliance | #307 |
| #309 | Multi-month, time picker, datetime picker | #305 |
| #310 | Type-level tests and inference validation | #305 |
| #311 | Migrate registry-ui Calendar from react-day-picker | #307 |
| #312 | Documentation, examples, API reference | #311 |
| #313 | Bundle size audit and performance benchmarks | #311 |

**This plan implements #304 and #305.**

---

## File structure

Every module follows the same convention recursively:
- `module.types.ts` — types and interfaces
- `module.ts` — implementation
- `module.libs.ts` — helper/utility functions (if needed)
- `__test__/module.test.ts` — tests
- `index.ts` — barrel re-exports

```
packages/duck-calendar/src/
├── index.ts                              ← root barrel, re-exports everything
├── calendar.types.ts                     ← top-level CalendarConfig (imports from adapter + core)
│
├── adapter/
│   ├── index.ts                          ← barrel
│   ├── adapter.types.ts                  ← DateAdapter<TDate> interface, WeekStartDay
│   ├── adapter.ts                        ← nativeDateAdapter implementation
│   ├── adapter.libs.ts                   ← Intl formatter cache, date clamping helpers
│   └── __test__/
│       └── adapter.test.ts
│
├── core/
│   ├── index.ts                          ← barrel (re-exports from grid/, selection/, navigation/)
│   │
│   ├── grid/
│   │   ├── index.ts                      ← barrel
│   │   ├── grid.types.ts                 ← CalendarDay, CalendarWeek, CalendarMonth, YearEntry, DecadeEntry
│   │   ├── grid.ts                       ← buildCalendarMonth(), buildCalendarYear(), buildDecadeView()
│   │   ├── grid.libs.ts                  ← getLocalizedWeekdays(), getLocalizedMonthNames(), getWeekNumber()
│   │   └── __test__/
│   │       └── grid.test.ts
│   │
│   ├── selection/
│   │   ├── index.ts                      ← barrel
│   │   ├── selection.types.ts            ← SelectionMode, DateRange, CalendarValue
│   │   ├── selection.ts                  ← selectDay(), applySelection()
│   │   ├── selection.libs.ts             ← isDateDisabled(), isInRange()
│   │   └── __test__/
│   │       └── selection.test.ts
│   │
│   └── navigation/
│       ├── index.ts                      ← barrel
│       ├── navigation.types.ts           ← NavigationDirection, NavigationUnit
│       ├── navigation.ts                 ← navigate(), canNavigate(), goToNextMonth(), etc.
│       └── __test__/
│           └── navigation.test.ts
```

---

## Step 1: Fix package.json

**File:** `packages/duck-calendar/package.json`

- Add root `"."` export:
  ```json
  "exports": {
    ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "./*": { "types": "./dist/*/index.d.ts", "default": "./dist/*/index.js" }
  }
  ```
- Remove `react` and `react-dom` from peerDependencies — pure TS library
- Add `"module": "./dist/index.js"` and `"types": "./dist/index.d.ts"`

---

## Step 2: Adapter module (issue #304)

This is the foundation. Everything else depends on it.

### adapter/adapter.types.ts

```ts
export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6  // 0=Sunday

export interface DateAdapter<TDate> {
  // Make dates
  today(): TDate
  create(year: number, month: number, day: number): TDate  // month is 0-indexed

  // Check dates
  isValid(date: TDate): boolean
  isSameDay(a: TDate, b: TDate): boolean
  isSameMonth(a: TDate, b: TDate): boolean
  isBefore(a: TDate, b: TDate): boolean
  isAfter(a: TDate, b: TDate): boolean

  // Find boundaries
  startOfMonth(date: TDate): TDate
  endOfMonth(date: TDate): TDate
  startOfWeek(date: TDate, weekStartDay: WeekStartDay): TDate

  // Math
  addDays(date: TDate, count: number): TDate
  addMonths(date: TDate, count: number): TDate
  addYears(date: TDate, count: number): TDate

  // Read parts
  getYear(date: TDate): number
  getMonth(date: TDate): number     // 0-indexed (Jan=0)
  getDate(date: TDate): number      // 1-31
  getDayOfWeek(date: TDate): number // 0=Sunday

  // Convert (for interop)
  toDate(date: TDate): Date
  fromDate(date: Date): TDate

  // Display
  format(date: TDate, options: Intl.DateTimeFormatOptions, locale?: string): string
}
```

### adapter/adapter.ts — nativeDateAdapter

Implements `DateAdapter<Date>` using built-in JS. Zero dependencies.

Tricky parts:
- `today()` — strip time: `new Date(y, m, d)` from `new Date()`
- `addMonths(Jan 31, 1)` — must clamp to Feb 28, not overflow to March 3
- `startOfWeek` — subtract `(dayOfWeek - weekStartDay + 7) % 7` days
- `format()` — `new Intl.DateTimeFormat(locale, options).format(date)`

### adapter/__test__/adapter.test.ts

Target: 100% branch coverage on the adapter.

- Leap year: `endOfMonth(Feb 2024)` = Feb 29
- Non-leap: `endOfMonth(Feb 2025)` = Feb 28
- Month clamping: `addMonths(Jan 31, 1)` = Feb 28
- Negative arithmetic: `addMonths(Mar 15, -1)` = Feb 15
- Week start Sunday vs Monday
- Cross-year: `addMonths(Dec 2025, 1)` = Jan 2026
- DST transitions: dates around March/November clock changes
- Format with 'en-US' and 'ar-SA'

---

## Step 3: Grid module (issue #305)

The grid builder computes the data structures the UI renders.

### core/grid.types.ts

```ts
export interface CalendarDay<TDate> {
  date: TDate
  isToday: boolean
  isSelected: boolean        // filled by selection logic
  isDisabled: boolean        // filled by selection logic
  isOutside: boolean         // belongs to prev/next month
  isWeekend: boolean
  isRangeStart: boolean      // filled by selection logic
  isRangeEnd: boolean
  isRangeMiddle: boolean
}

export interface CalendarWeek<TDate> {
  weekNumber: number
  days: CalendarDay<TDate>[]  // always 7 items
}

export interface CalendarMonth<TDate> {
  month: TDate
  weeks: CalendarWeek<TDate>[]
}

export interface YearEntry {
  month: number              // 0-indexed
  label: string              // localized month name
  isCurrent: boolean         // is this the current month?
}

export interface DecadeEntry {
  year: number
  isCurrent: boolean         // is this the current year?
}
```

### core/grid.ts — building grids

```ts
// Month grid — the main one
buildCalendarMonth(adapter, viewDate, config) → CalendarMonth<TDate>

// Year view — 12 months to pick from
buildCalendarYear(adapter, viewDate) → YearEntry[]

// Decade view — 12 years to pick from (decade + 1 before/after)
buildDecadeView(adapter, viewDate) → DecadeEntry[]
```

`buildCalendarMonth` flow:
1. `startOfMonth(viewDate)` → first day (e.g. March 1)
2. `startOfWeek(firstDay, weekStartDay)` → first cell (e.g. Feb 23)
3. Fill 7 days per week, set `isOutside` for days not in target month
4. Set `isToday` by comparing to `adapter.today()`
5. Set `isWeekend` for Saturday (6) and Sunday (0)
6. Stop when past end of month (or always 6 weeks if `fixedWeeks`)
7. Selection flags default to `false` — selection module fills them

### core/grid.libs.ts — locale utilities

```ts
// 7 weekday names starting from weekStartDay
getLocalizedWeekdays(adapter, locale, weekStartDay, format?) → string[]

// 12 month names
getLocalizedMonthNames(adapter, locale, format?) → string[]

// ISO week number
getWeekNumber(adapter, date) → number
```

All use `adapter.format()` internally — no external dependencies.

### core/__test__/grid.test.ts

- March 2026 grid has correct structure
- weekStartDay=0 vs 1 shifts the grid
- Outside days flagged correctly
- fixedWeeks always gives 6 weeks
- isWeekend set for Sat/Sun
- buildCalendarYear returns 12 entries with correct labels
- buildDecadeView returns 12 entries centered on current decade
- getLocalizedWeekdays returns 7 names in correct order
- getLocalizedMonthNames returns 12 names

---

## Step 4: Selection module (issue #305)

Handles what happens when a user clicks a day.

### core/selection.types.ts

```ts
export type SelectionMode = 'single' | 'range' | 'multi'

export interface DateRange<TDate> {
  from: TDate
  to: TDate | null
}

// Resolves differently based on mode:
// single → TDate | null
// range  → DateRange<TDate> | null
// multi  → TDate[]
export type CalendarValue<TDate, M extends SelectionMode> =
  M extends 'single' ? TDate | null :
  M extends 'range' ? DateRange<TDate> | null :
  M extends 'multi' ? TDate[] :
  never
```

### core/selection.ts

```ts
// Compute next selection state when a day is clicked
selectDay(adapter, mode, currentValue, clickedDay) → newValue

// Decorate grid with selection + disabled flags
applySelection(weeks, adapter, mode, selected, constraints?) → weeks
```

Per mode:
- **Single**: click = select, click same = deselect (null)
- **Range**: 1st click = from, 2nd click = to (auto-swap if before from), 3rd click = reset
- **Multi**: toggle in/out of array

### core/selection.libs.ts — constraint helpers

```ts
// Is this date disabled? (by array, predicate, or min/max bounds)
isDateDisabled(adapter, date, constraints) → boolean

// Is this date inside a range? (inclusive)
isInRange(adapter, date, range) → boolean
```

### core/__test__/selection.test.ts

- Single: toggle on/off
- Range: from → to → reset
- Range: auto-swap when to < from
- Range: clicking before from resets
- Multi: toggle membership
- Multi: no duplicates
- Disabled dates blocked
- fromDate/toDate constraints
- isInRange inclusive boundaries
- isDateDisabled with predicate function

---

## Step 5: Navigation module (issue #305)

### core/navigation.ts

```ts
// Move viewDate by direction + unit
navigate(adapter, date, direction, unit) → TDate
// direction: 'prev' | 'next'
// unit: 'month' | 'year' | 'decade'

// Can we navigate in this direction?
canNavigate(adapter, date, direction, unit, constraints?) → boolean
```

Also export convenience wrappers:
```ts
goToNextMonth(adapter, current) → TDate
goToPrevMonth(adapter, current) → TDate
goToMonth(adapter, current, month) → TDate
goToYear(adapter, current, year) → TDate
```

### core/__test__/navigation.test.ts

- Dec → Jan wraps year
- Jan ← Dec wraps year backward
- Decade navigation moves 10 years
- canNavigate respects fromDate/toDate
- goToMonth/goToYear change the right part

---

## Step 6: Top-level config type

### calendar.types.ts

```ts
export type ViewMode = 'days' | 'months' | 'years'

export interface CalendarLocaleConfig {
  locale?: string              // BCP 47 tag
  weekStartDay?: WeekStartDay  // default 0 (Sunday)
  direction?: 'ltr' | 'rtl'
}

export interface CalendarConfig<TDate, M extends SelectionMode = 'single'> {
  adapter: DateAdapter<TDate>
  mode: M
  locale?: CalendarLocaleConfig

  month?: TDate
  defaultMonth?: TDate
  selected?: CalendarValue<TDate, M>
  onSelect?: (value: CalendarValue<TDate, M>) => void
  onMonthChange?: (month: TDate) => void

  numberOfMonths?: number      // default 1
  showOutsideDays?: boolean    // default true
  showWeekNumbers?: boolean    // default false
  fixedWeeks?: boolean         // always 6 weeks

  disabled?: TDate[] | ((date: TDate) => boolean)
  fromDate?: TDate             // min selectable
  toDate?: TDate               // max selectable
}
```

---

## Step 7: Barrels and verify

Wire up all `index.ts` files, then:

```bash
npx turbo run build --filter=@gentleduck/calendar
npx turbo run test --filter=@gentleduck/calendar
```

Verify imports:
```ts
import { nativeDateAdapter, buildCalendarMonth, selectDay } from '@gentleduck/calendar'
import type { DateAdapter, CalendarConfig } from '@gentleduck/calendar'
import { nativeDateAdapter } from '@gentleduck/calendar/adapter'
```

---

## How it all fits together (end-to-end example)

```ts
import {
  nativeDateAdapter,
  buildCalendarMonth,
  applySelection,
  selectDay,
  navigate,
  getLocalizedWeekdays,
} from '@gentleduck/calendar'

const adapter = nativeDateAdapter

// 1. Get weekday headers
const weekdays = getLocalizedWeekdays(adapter, 'en-US', 0)
// → ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// 2. Build the grid for March 2026
const grid = buildCalendarMonth(adapter, adapter.create(2026, 2, 1), {
  weekStartDay: 0,
  showOutsideDays: true,
  fixedWeeks: false,
})

// 3. Apply selection state
let selected = null
const decorated = applySelection(grid.weeks, adapter, 'single', selected)

// 4. User clicks March 15
selected = selectDay(adapter, 'single', selected, adapter.create(2026, 2, 15))
// → Date(2026, 2, 15)

// 5. Navigate to next month
const nextMonth = navigate(adapter, adapter.create(2026, 2, 1), 'next', 'month')
// → Date(2026, 3, 1) — April
```

---

## Implementation order

1. **package.json fix** — root export, remove React peer deps
2. **adapter.types.ts** → **adapter.ts** → **adapter.test.ts** — get the foundation right first
3. **grid.types.ts** → **grid.ts** + **grid.libs.ts** → **grid.test.ts** — build the grid
4. **selection.types.ts** → **selection.ts** + **selection.libs.ts** → **selection.test.ts** — add selection
5. **navigation.ts** → **navigation.test.ts** — add navigation
6. **calendar.types.ts** — top-level config
7. **barrels** (all `index.ts` files) → build → test

---

## NOT in this plan (future issues)

| What | Issue | Why later |
|------|-------|-----------|
| React hooks (useCalendar, useKeyboard) | #306 | Depends on core being solid |
| Compound components | #307 | Depends on hooks |
| Accessibility/ARIA | #308 | Depends on components |
| Multi-month, time picker | #309 | Extension of core |
| Type-level tests | #310 | After types stabilize |
| Registry-ui migration | #311 | After components |
| Docs and examples | #312 | After migration |
| Bundle audit | #313 | After everything |

---

## Checklist

### Issue #304 — Package setup + Date adapter
- [ ] Fix package.json (root export, remove React peer deps)
- [ ] `src/adapter/adapter.types.ts` — DateAdapter interface, WeekStartDay
- [ ] `src/adapter/adapter.ts` — nativeDateAdapter
- [ ] `src/adapter/adapter.libs.ts` — Intl formatter cache, clamping helpers
- [ ] `src/adapter/__test__/adapter.test.ts` — all tests passing
- [ ] `src/adapter/index.ts` — barrel

### Issue #305 — Core pure functions

**Grid sub-module:**
- [ ] `src/core/grid/grid.types.ts` — CalendarDay, CalendarWeek, CalendarMonth, YearEntry, DecadeEntry
- [ ] `src/core/grid/grid.ts` — buildCalendarMonth, buildCalendarYear, buildDecadeView
- [ ] `src/core/grid/grid.libs.ts` — getLocalizedWeekdays, getLocalizedMonthNames, getWeekNumber
- [ ] `src/core/grid/__test__/grid.test.ts` — all tests passing
- [ ] `src/core/grid/index.ts` — barrel

**Selection sub-module:**
- [ ] `src/core/selection/selection.types.ts` — SelectionMode, DateRange, CalendarValue
- [ ] `src/core/selection/selection.ts` — selectDay, applySelection
- [ ] `src/core/selection/selection.libs.ts` — isDateDisabled, isInRange
- [ ] `src/core/selection/__test__/selection.test.ts` — all tests passing
- [ ] `src/core/selection/index.ts` — barrel

**Navigation sub-module:**
- [ ] `src/core/navigation/navigation.types.ts` — NavigationDirection, NavigationUnit
- [ ] `src/core/navigation/navigation.ts` — navigate, canNavigate, goToNextMonth, etc.
- [ ] `src/core/navigation/__test__/navigation.test.ts` — all tests passing
- [ ] `src/core/navigation/index.ts` — barrel

- [ ] `src/core/index.ts` — core barrel

### Finalize
- [ ] `src/calendar.types.ts` — CalendarConfig, ViewMode, CalendarLocaleConfig
- [ ] `src/index.ts` — root barrel
- [ ] `npx turbo run build --filter=@gentleduck/calendar` passes
- [ ] `npx turbo run test --filter=@gentleduck/calendar` passes
- [ ] Import paths verified

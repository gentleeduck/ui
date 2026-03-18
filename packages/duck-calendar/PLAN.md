# duck-calendar: Type-Level Tests and Type Inference Validation

Issue #310. Verify that the generic type system works correctly at compile time using vitest's `expectTypeOf`.

> Depends on: #304–#309 — all complete.

## What was done

Added `src/__test__/types.test-d.ts` with 44 type-level assertions covering:

### CalendarValue conditional type
- `'single'` → `TDate | null`
- `'range'` → `DateRange<TDate> | null`
- `'multi'` → `TDate[]`
- Works with custom `TDate` types (e.g. `DayjsDate`)

### DateAdapter generic flow
- `NativeAdapter` implements `DateAdapter<Date>`
- All adapter methods accept/return the correct `TDate`
- Time accessors return numbers
- Boolean methods return boolean
- Custom `TDate` types propagate correctly through the interface

### CalendarConfig type
- `selected` type matches mode
- `onSelect` callback parameter matches mode
- `disabled` accepts array or predicate
- `fromDate`/`toDate` are optional `TDate`

### UseCalendarReturn type
- `state.value` type resolves fully per mode (no unresolved conditional)
- State shape: month, focusedDate, viewMode, weeks, months, weekdays, canGoNext, canGoPrevious
- Actions have correct function signatures
- Prop getters return DayProps, GridProps, NavProps, HeaderProps
- `getDayProps` accepts `CalendarDay<TDate>`

### DayProps / GridProps types
- Correct ARIA attribute types (literal strings)
- data-* attribute types (`'true' | undefined`)
- Event handler types

### Time types
- `TimeValue` has hour/minute required, second optional
- `TimeField` is the correct union
- `HourCycle` is `'12' | '24'`
- `UseTimePickerReturn` state and `TimeFieldProps` shapes

### UseDateTimeReturn type
- Has calendar and timePicker sub-returns
- `state.value` is `TDate | null`
- `actions.setValue` accepts `TDate`

### Pure function return types
- `selectDay` returns `CalendarValue` matching mode
- `buildCalendarMonth` returns `CalendarMonth<TDate>`
- `buildMultiMonth` returns `CalendarMonth<TDate>[]`
- `navigate` returns `TDate`
- `canNavigate` returns `boolean`
- `clampTime` returns `TimeValue`
- `parseTimeInput` returns `number | null`

## Configuration

Enabled vitest typecheck in `vitest.config.ts`:
```ts
typecheck: {
  enabled: true,
  include: ['src/**/*.test-d.ts'],
}
```

## Verification

```bash
npx turbo run check-types build test --filter=@gentleduck/calendar --force
```

408 tests passing (364 runtime + 44 type-level). Zero type errors.

# duck-calendar: Multi-month, Time Picker, DateTime Picker

Issue #309. Extend the calendar engine with multi-month display, time selection, and combined datetime picking.

> Depends on: #304–#308 — all complete.

## Feature 1: Multi-month

- `buildMultiMonth(adapter, startMonth, count, config)` — builds N consecutive month grids
- `useCalendar` accepts `numberOfMonths` config, returns `state.months[]` array
- `state.weeks` preserved for backward compat (first month's weeks)
- Navigation advances all months together

## Feature 2: Time Picker

### Core (`src/time/`)
- `TimeValue` — `{ hour, minute, second? }`
- `TimeField` — `'hour' | 'minute' | 'second' | 'ampm'`
- `HourCycle` — `'12' | '24'`
- Pure functions: `clampTime`, `incrementField`, `parseTimeInput`, `isValidTime`
- Formatting: `formatTimeField`, `getAmPm`, `to12Hour`, `to24Hour`

### Hook (`src/react/use-time-picker/`)
- `useTimePicker(config)` — controlled/uncontrolled time state
- Keyboard: ArrowUp/Down increment/decrement, digit typing
- `getFieldProps(field)` — spinbutton ARIA props
- Focus management with roving tabindex between fields

### DateAdapter extensions
- `getHours(date)`, `getMinutes(date)`, `getSeconds(date)`, `setTime(date, h, m, s?)`

## Feature 3: DateTime Picker

### Hook (`src/react/use-datetime/`)
- `useDateTime(config)` — composes `useCalendar` + `useTimePicker`
- Date selection preserves time, time change preserves date
- Returns combined `TDate` value

## Checklist

- [x] DateAdapter time methods + NativeAdapter impl
- [x] Time core module (types, functions, formatting)
- [x] Multi-month: `buildMultiMonth` + `useCalendar` update
- [ ] useTimePicker hook
- [ ] useDateTime hook
- [ ] Time core tests
- [ ] useTimePicker tests
- [ ] useDateTime tests
- [ ] Barrel exports
- [ ] Build passes
- [ ] All tests pass

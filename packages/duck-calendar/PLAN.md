# duck-calendar: Compound Components Plan

Issue #307. Build headless, unstyled compound components that wrap `useCalendar` hooks.

> Depends on: #304 (adapter), #305 (core), #306 (hooks) — all complete.

## Architecture

Compound components live in **`packages/duck-primitives/src/calendar/`** following the exact same patterns as Dialog, RadioGroup, and other primitives. They import the hooks and types from `@gentleduck/calendar`.

**Pattern:** Full duck-primitives compound pattern:
- `createContextScope('Calendar')` for scoped context
- `ScopedProps<P>` on every component
- `React.forwardRef` with explicit generics on all sub-components
- `Primitive.div` / `Primitive.button` for base elements
- `displayName` on every component
- `data-slot` on every root element
- `composeEventHandlers` for event composition

**Dependency direction:** `duck-primitives` → `duck-calendar` (one-way). Calendar has NO runtime dep on primitives.

## File Structure

```
packages/duck-primitives/src/calendar/
├── index.ts              ← barrel (long names + short aliases)
├── calendar.tsx          ← Root (CalendarProvider + useCalendar)
├── header.tsx            ← CalendarHeader
├── nav.tsx               ← CalendarNav (prev/next buttons)
├── grid.tsx              ← CalendarGrid (grid container)
├── weekdays.tsx          ← CalendarWeekdays (header row)
├── day.tsx               ← CalendarDay (day button)
├── month-view.tsx        ← CalendarMonthView (12-month picker)
├── year-view.tsx         ← CalendarYearView (decade picker)
└── __test__/
    └── calendar.test.tsx ← render tests
```

## Components

### Calendar (root) — `calendar.tsx`
- Accepts `UseCalendarConfig` props + `children`
- Calls `useCalendar(config)` internally
- Provides CalendarContext with full `UseCalendarReturn` + adapter + mode + locale
- Renders `AnnouncerPortal`
- Root: `<Primitive.div role="application" aria-label="Calendar" data-slot="calendar" data-view={viewMode}>`

### CalendarHeader — `header.tsx`
- `formatMonth?` prop for custom format
- Spreads `getHeaderProps()` (id, aria-live)
- Default: `adapter.format(month, { month: 'long', year: 'numeric' })`
- `<Primitive.div data-slot="calendar-header">`

### CalendarNav — `nav.tsx`
- Renders prev + next `<Primitive.button>` elements
- Spreads `getNavProps('prev')` / `getNavProps('next')`
- `data-slot="calendar-nav"`, buttons: `data-slot="calendar-nav-button"`

### CalendarGrid — `grid.tsx`
- Spreads `getGridProps()` (role="grid", aria-labelledby)
- `<Primitive.div data-slot="calendar-grid">`
- Renders rows of CalendarDay

### CalendarWeekdays — `weekdays.tsx`
- Renders `state.weekdays` headers
- `<Primitive.div data-slot="calendar-weekdays">`

### CalendarDay — `day.tsx`
- `day: CalendarDay<Date>` required prop
- Spreads `getDayProps(day)` (all ARIA + data attrs + handlers)
- `<Primitive.button data-slot="calendar-day">`

### CalendarMonthView — `month-view.tsx`
- Uses `buildCalendarYear(adapter, month)`
- Month buttons with `data-slot="calendar-month"`, `data-current`
- Click → `setMonth(goToMonth(...))` + `setViewMode('days')`

### CalendarYearView — `year-view.tsx`
- Uses `buildDecadeView(adapter, month)`
- Year buttons with `data-slot="calendar-year"`, `data-current`
- Click → `setMonth(goToYear(...))` + `setViewMode('months')`

## Checklist

- [ ] Add `@gentleduck/calendar` to duck-primitives deps
- [ ] `calendar.tsx` — root + context
- [ ] `header.tsx`
- [ ] `nav.tsx`
- [ ] `grid.tsx`
- [ ] `weekdays.tsx`
- [ ] `day.tsx`
- [ ] `month-view.tsx`
- [ ] `year-view.tsx`
- [ ] `index.ts` — barrel
- [ ] `__test__/calendar.test.tsx` — tests
- [ ] Build passes
- [ ] All tests pass

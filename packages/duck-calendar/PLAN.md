# duck-calendar: React Hooks Implementation Plan

Issue #306. Build the React hook layer that wires the core pure functions into stateful, interactive hooks.

> Depends on: #304 (adapter) and #305 (core functions) — both complete.

## What we're building

The core engine (adapter, grid, selection, navigation) is pure functions with no React. This layer adds React state management on top so consumers can build calendar UIs without wiring everything together manually.

```
Consumer code:
  const calendar = useCalendar({ adapter, mode: 'single' })

What happens internally:
  useCalendar
    ├── useControllable (month state — controlled or uncontrolled)
    ├── useControllable (selection state — controlled or uncontrolled)
    ├── buildCalendarMonth() from core/grid
    ├── applySelection() from core/selection
    ├── useKeyboard() for arrow keys, Enter, Escape
    ├── useAnnouncer() for screen reader announcements
    └── returns: { state, actions, getDayProps, getGridProps, getNavProps }
```

The consumer spreads prop getters onto their elements:
```tsx
{calendar.state.weeks.map(week =>
  week.days.map(day =>
    <button {...calendar.getDayProps(day)}>{day.date.getDate()}</button>
  )
)}
```

## Reuse from primitives

`useControllableState` already exists at `packages/duck-primitives/src/hooks/useControllableState.ts`. It handles controlled/uncontrolled with dev warnings. We import it as a peer dependency rather than duplicating. Add `@gentleduck/primitives` to duck-calendar's peer deps.

## File structure

```
packages/duck-calendar/src/
├── react/
│   ├── index.ts                            ← barrel
│   ├── use-calendar/
│   │   ├── index.ts                        ← barrel
│   │   ├── use-calendar.types.ts           ← UseCalendarConfig, UseCalendarReturn, PropGetters
│   │   ├── use-calendar.ts                 ← main hook
│   │   ├── use-calendar.libs.ts            ← prop getter builders (getDayProps, getGridProps, etc.)
│   │   └── __test__/
│   │       └── use-calendar.test.tsx
│   │
│   ├── use-keyboard/
│   │   ├── index.ts                        ← barrel
│   │   ├── use-keyboard.types.ts           ← KeyboardConfig, KEY_MAP
│   │   ├── use-keyboard.ts                 ← keyboard navigation hook
│   │   └── __test__/
│   │       └── use-keyboard.test.tsx
│   │
│   └── use-announcer/
│       ├── index.ts                        ← barrel
│       ├── use-announcer.types.ts          ← AnnouncerReturn
│       ├── use-announcer.ts                ← screen reader announcements
│       └── __test__/
│           └── use-announcer.test.tsx
│
├── index.ts                                ← updated: re-export react/ alongside core
└── ... (existing adapter/, core/, etc.)
```

## Step 1: Add React peer deps to package.json

Add to duck-calendar's package.json:
```json
"peerDependencies": {
  "react": "^19.2.4",
  "@gentleduck/primitives": "workspace:*"
},
"peerDependenciesMeta": {
  "react": { "optional": true },
  "@gentleduck/primitives": { "optional": true }
}
```

Optional because the core (adapter, grid, selection, navigation) works without React. Only `react/` subpath needs them.

## Step 2: useKeyboard hook

Start here because useCalendar depends on it.

### use-keyboard.types.ts

```ts
export interface KeyboardConfig<TDate> {
  focusedDate: TDate
  onFocusChange: (date: TDate) => void
  onSelect: (date: TDate) => void
  onDismiss?: () => void
  isDisabled: (date: TDate) => boolean
  adapter: DateAdapter<TDate>
  weekStartDay?: WeekStartDay
}

export interface KeyboardReturn {
  onKeyDown: React.KeyboardEventHandler
}
```

### use-keyboard.ts

Maps keys to navigation/selection actions:

| Key | Action |
|-----|--------|
| ArrowLeft | Focus previous day |
| ArrowRight | Focus next day |
| ArrowUp | Focus same day previous week (-7) |
| ArrowDown | Focus same day next week (+7) |
| PageUp | Focus same day previous month |
| PageDown | Focus same day next month |
| Shift+PageUp | Focus same day previous year |
| Shift+PageDown | Focus same day next year |
| Home | Focus start of week |
| End | Focus end of week |
| Enter / Space | Select focused date |
| Escape | Call onDismiss |

Use a lookup table, not if/else. When the new focused date is disabled, skip it (try the next non-disabled date in that direction).

### Tests

- Arrow keys move focus by 1 day / 7 days
- PageUp/PageDown move by month
- Shift+PageUp/PageDown move by year
- Home/End go to week boundaries
- Enter/Space trigger onSelect
- Escape triggers onDismiss
- Disabled dates are skipped
- Focus wraps across month boundaries

## Step 3: useAnnouncer hook

### use-announcer.ts

Manages an aria-live region for screen reader announcements.

```ts
export interface AnnouncerReturn {
  announce: (message: string) => void
  AnnouncerPortal: React.FC
}
```

- `announce(message)` sets the message in the live region. Debounces at 150ms so rapid keyboard navigation doesn't flood the reader.
- `AnnouncerPortal` renders a visually hidden `<div aria-live="polite" aria-atomic="true">` that contains the current message.

Announcements to make:
- Month navigation: "March 2026"
- Date selection (single): "March 14 selected"
- Range selection: "Range: March 14 to March 20"
- Disabled date: "March 14 is unavailable"

### Tests

- announce() updates the live region text
- Rapid calls are debounced (only last message shows)
- AnnouncerPortal renders a visually hidden element
- Element has aria-live="polite" and aria-atomic="true"

## Step 4: useCalendar hook (the main one)

### use-calendar.types.ts

```ts
export interface UseCalendarConfig<TDate, M extends SelectionMode = 'single'>
  extends CalendarConfig<TDate, M> {}

export interface UseCalendarReturn<TDate, M extends SelectionMode> {
  // State
  state: {
    month: TDate
    value: CalendarValue<TDate, M>
    focusedDate: TDate
    viewMode: ViewMode
    weeks: CalendarWeek<TDate>[]
    weekdays: string[]
  }

  // Actions
  actions: {
    setMonth: (month: TDate) => void
    setViewMode: (mode: ViewMode) => void
    goToNext: () => void
    goToPrevious: () => void
    selectDate: (date: TDate) => void
    focusDate: (date: TDate) => void
    canGoNext: boolean
    canGoPrevious: boolean
  }

  // Prop getters — spread onto your elements
  getDayProps: (day: CalendarDay<TDate>) => DayProps
  getGridProps: () => GridProps
  getNavProps: (direction: 'prev' | 'next') => NavProps
  getHeaderProps: () => HeaderProps

  // Screen reader
  announcer: AnnouncerReturn
}
```

### use-calendar.ts

Composes everything:

1. `useControllableState` for `month` (controlled via `config.month`, uncontrolled via `config.defaultMonth`)
2. `useControllableState` for `value` (controlled via `config.selected`, uncontrolled via `config.defaultSelected`)
3. `useState` for `focusedDate` (starts at today or defaultMonth)
4. `useState` for `viewMode` (starts at 'days')
5. `useMemo` calls `buildCalendarMonth()` + `applySelection()` to produce decorated weeks
6. `useMemo` calls `getLocalizedWeekdays()` for weekday headers
7. `useKeyboard()` for keyboard navigation
8. `useAnnouncer()` for screen reader announcements
9. Announces on month change and selection change via `useEffect`

### use-calendar.libs.ts — prop getter builders

```ts
getDayProps(day) → {
  role: 'gridcell',
  'aria-selected': day.isSelected,
  'aria-disabled': day.isDisabled,
  'aria-current': day.isToday ? 'date' : undefined,
  tabIndex: isSameDay(day.date, focusedDate) ? 0 : -1,
  'data-calendar-day': '',
  'data-selected': day.isSelected ? 'true' : undefined,
  'data-today': day.isToday ? 'true' : undefined,
  'data-disabled': day.isDisabled ? '' : undefined,
  'data-outside-month': day.isOutside ? 'true' : undefined,
  'data-in-range': day.isRangeMiddle ? 'true' : undefined,
  'data-range-start': day.isRangeStart ? 'true' : undefined,
  'data-range-end': day.isRangeEnd ? 'true' : undefined,
  'data-focused': isSameDay(day.date, focusedDate) ? 'true' : undefined,
  'data-weekend': day.isWeekend ? 'true' : undefined,
  onClick: () => selectDate(day.date),
  onMouseEnter: () => { /* range preview on hover */ },
  onKeyDown: keyboard.onKeyDown,
}

getGridProps() → {
  role: 'grid',
  'aria-labelledby': headerId,
}

getNavProps(direction) → {
  'aria-label': direction === 'prev' ? 'Go to previous month' : 'Go to next month',
  disabled: direction === 'prev' ? !canGoPrevious : !canGoNext,
  onClick: () => direction === 'prev' ? goToPrevious() : goToNext(),
}

getHeaderProps() → {
  id: headerId,
  'aria-live': 'polite',
}
```

### Tests

- **Controlled month**: passing `month` + `onMonthChange` — value follows prop
- **Uncontrolled month**: passing `defaultMonth` — internal state manages it
- **Selection single**: click → value set, click same → deselect
- **Selection range**: click → from, click → to, click → reset
- **Selection multi**: click toggles
- **Navigation**: goToNext/goToPrevious update month, trigger onMonthChange
- **canGoNext/canGoPrevious**: respect fromDate/toDate
- **Prop getters**: getDayProps returns correct ARIA attributes
- **Keyboard integration**: arrow keys move focusedDate
- **Announcer integration**: month change announces, selection announces
- **View mode**: setViewMode switches between days/months/years

## Step 5: Update root barrel

Update `src/index.ts` to re-export from `react/`:

```ts
// Existing exports...
export { useCalendar, useKeyboard, useAnnouncer } from './react'
export type { UseCalendarConfig, UseCalendarReturn, ... } from './react'
```

## Step 6: Build and test

```bash
npx turbo run build --filter=@gentleduck/calendar
npx turbo run test --filter=@gentleduck/calendar
```

## Implementation order

1. Add React peer deps to package.json
2. `use-keyboard/` — types → implementation → tests
3. `use-announcer/` — types → implementation → tests
4. `use-calendar/` — types → libs (prop getters) → implementation → tests
5. `react/index.ts` barrel
6. Update root `src/index.ts`
7. Build and test

## NOT in this plan

| What | Issue | Why later |
|------|-------|-----------|
| Compound components (Calendar, CalendarGrid) | #307 | Depends on hooks being stable |
| Accessibility audit | #308 | Depends on components |
| Multi-month, time picker | #309 | Extension of hooks |
| Type-level tests | #310 | After types stabilize |

## Checklist

### useKeyboard
- [ ] `src/react/use-keyboard/use-keyboard.types.ts`
- [ ] `src/react/use-keyboard/use-keyboard.ts`
- [ ] `src/react/use-keyboard/__test__/use-keyboard.test.tsx`
- [ ] `src/react/use-keyboard/index.ts`

### useAnnouncer
- [ ] `src/react/use-announcer/use-announcer.types.ts`
- [ ] `src/react/use-announcer/use-announcer.ts`
- [ ] `src/react/use-announcer/__test__/use-announcer.test.tsx`
- [ ] `src/react/use-announcer/index.ts`

### useCalendar
- [ ] `src/react/use-calendar/use-calendar.types.ts`
- [ ] `src/react/use-calendar/use-calendar.libs.ts` (prop getters)
- [ ] `src/react/use-calendar/use-calendar.ts`
- [ ] `src/react/use-calendar/__test__/use-calendar.test.tsx`
- [ ] `src/react/use-calendar/index.ts`

### Finalize
- [ ] `src/react/index.ts` barrel
- [ ] Update `src/index.ts` root barrel
- [ ] Update `package.json` — add React + primitives peer deps
- [ ] Build passes
- [ ] All tests pass

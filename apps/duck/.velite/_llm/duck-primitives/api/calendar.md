```tsx

```

## Anatomy

```tsx

    {/* Map over state.weeks to render Calendar.Day */}

```

---

## Example

```tsx showLineNumbers

const adapter = new NativeAdapter()

function DatePicker() {
  return (
    
        
        {/* Day cells rendered via context */}

  )
}
```

---

## API

### `Calendar.Root`

The root component. Wraps `useCalendar` and provides context to all children. Renders a `div` with `role="application"`.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `adapter` | `Adapter.IDateAdapter<Date>` | **required** | Date adapter instance |
| `mode` | `Selection.SelectionMode` | **required** | `'single'`, `'range'`, `'multi'`, or `'multi-range'` |
| `locale` | `CalendarLocaleConfig` | - | Locale, week start day, and direction |
| `month` | `Date` | - | Controlled displayed month |
| `defaultMonth` | `Date` | - | Default month (uncontrolled) |
| `selected` | `CalendarValue<Date, M>` | - | Controlled selection |
| `defaultSelected` | `CalendarValue<Date, M>` | - | Default selection (uncontrolled) |
| `onSelect` | `(value) => void` | - | Called when selection changes |
| `onMonthChange` | `(month: Date) => void` | - | Called when displayed month changes |
| `onDismiss` | `() => void` | - | Called on <Kbd>Escape</Kbd> |
| `numberOfMonths` | `number` | `1` | Months to show side by side |
| `showOutsideDays` | `boolean` | `true` | Show days from adjacent months |
| `fixedWeeks` | `boolean` | `false` | Always show 6 weeks |
| `disabled` | `Date[] \| (date) => boolean` | - | Disabled dates |
| `fromDate` | `Date` | - | Earliest selectable date |
| `toDate` | `Date` | - | Latest selectable date |

**Data attributes:**

| Attribute | Value |
| :--- | :--- |
| `data-slot` | `"calendar"` |
| `data-view` | Current `ViewMode` (`"days"`, `"months"`, or `"years"`) |

---

### `Calendar.Header`

Displays the current month and year. Renders a `div` with `aria-live="polite"`.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `formatMonth` | `(month: Date, adapter: Adapter.IDateAdapter<Date>) => string` | - | Custom formatter for the title. Defaults to `"March 2026"` format |

**Data attributes:**

| Attribute | Value |
| :--- | :--- |
| `data-slot` | `"calendar-header"` |

---

### `Calendar.Nav`

Navigation wrapper. Renders a `div` with `role="navigation"`. When no children are provided, it renders `PrevButton` and `NextButton` automatically.

**Data attributes:**

| Attribute | Value |
| :--- | :--- |
| `data-slot` | `"calendar-nav"` |

---

### `Calendar.PrevButton`

Navigates to the previous month. Renders a `button`.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| All `button` props | - | - | Standard button HTML attributes |

Automatically applies `aria-label="Go to previous month"` and `disabled` from context.

**Data attributes:**

| Attribute | Value |
| :--- | :--- |
| `data-slot` | `"calendar-nav-button"` |
| `data-direction` | `"prev"` |

---

### `Calendar.NextButton`

Navigates to the next month. Renders a `button`.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| All `button` props | - | - | Standard button HTML attributes |

Automatically applies `aria-label="Go to next month"` and `disabled` from context.

**Data attributes:**

| Attribute | Value |
| :--- | :--- |
| `data-slot` | `"calendar-nav-button"` |
| `data-direction` | `"next"` |

---

### `Calendar.Grid`

The day grid container. Renders a `div` with `role="grid"`, `aria-roledescription="calendar"`, and `aria-labelledby` pointing to the Header element (set automatically by `getGridProps()`).

**Data attributes:**

| Attribute | Value |
| :--- | :--- |
| `data-slot` | `"calendar-grid"` |

---

### `Calendar.Weekdays`

Renders the weekday header row as a `div` with `role="row"`. Each weekday renders as an `abbr` with `role="columnheader"`.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `renderWeekday` | `(weekday: string, index: number) => ReactNode` | - | Custom render function for each weekday cell |

**Data attributes:**

| Attribute | Value |
| :--- | :--- |
| `data-slot` | `"calendar-weekdays"` |
| `data-slot` (each cell) | `"calendar-weekday"` |

---

### `Calendar.Day`

A single day cell. Renders a `button` with full ARIA attributes and data attributes for styling.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `day` | `Grid.ICalendarDay<Date>` | **required** | Day data from the calendar grid |

Automatically applies all day props from context: `aria-label`, `aria-selected`, `aria-disabled`, `aria-current`, `tabIndex`, `onClick`, `onKeyDown`, `onMouseEnter`, and all `data-*` styling attributes.

**Data attributes:**

| Attribute | Value |
| :--- | :--- |
| `data-slot` | `"calendar-day"` |
| `data-calendar-day` | `""` - marker attribute used internally for focus queries |
| `data-selected` | `"true"` when selected |
| `data-today` | `"true"` for today |
| `data-disabled` | `"true"` when disabled |
| `data-outside-month` | `"true"` for adjacent month days |
| `data-hidden` | `"true"` when `showOutsideDays` is false and day is outside |
| `data-range-start` | `"true"` for range start |
| `data-range-middle` | `"true"` for range middle |
| `data-range-end` | `"true"` for range end |
| `data-focused` | `"true"` when keyboard focused |
| `data-weekend` | `"true"` for weekends |

---

### `Calendar.MonthView`

A 12-month grid for month picking. Renders a `div` with `role="grid"`. Clicking a month navigates to it and switches back to the day view.

**Data attributes:**

| Attribute | Value |
| :--- | :--- |
| `data-slot` | `"calendar-month-view"` |
| `data-slot` (each cell) | `"calendar-month"` |
| `data-current` | `"true"` on the current month |
| `data-month` (each cell) | Zero-based month index (e.g. `0` for January) |

---

### `Calendar.YearView`

A decade year grid for year picking. Renders a `div` with `role="grid"`. Clicking a year navigates to it and switches to the month view.

**Data attributes:**

| Attribute | Value |
| :--- | :--- |
| `data-slot` | `"calendar-year-view"` |
| `data-slot` (each cell) | `"calendar-year"` |
| `data-current` | `"true"` on the current year |
| `data-year` (each cell) | Four-digit year (e.g. `2026`) |

---

## Accessibility

- `Calendar.Root` renders `role="application"` with `aria-label="Calendar"`
- `Calendar.Grid` renders `role="grid"` with `aria-roledescription="calendar"` and `aria-labelledby` linked to the Header
- `Calendar.Weekdays` renders `role="row"` with each weekday cell as `role="columnheader"`
- `Calendar.Day` renders `role="gridcell"` with full ARIA labeling
- `Calendar.MonthView` and `Calendar.YearView` render each button cell with `role="gridcell"`
- `Calendar.Nav` renders `role="navigation"` with `aria-label="Calendar navigation"`
- Screen reader announcements are rendered automatically via `AnnouncerPortal`
- Keyboard navigation follows the WAI-ARIA grid pattern (<Kbd>ArrowLeft</Kbd>/<Kbd>ArrowRight</Kbd>, <Kbd>PageUp</Kbd>/<Kbd>PageDown</Kbd>, <Kbd>Home</Kbd>/<Kbd>End</Kbd>, <Kbd>Enter</Kbd>/<Kbd>Space</Kbd>, <Kbd>Escape</Kbd>)
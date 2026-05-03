## Quick comparison

| | @gentleduck/calendar | react-day-picker |
|---|---|---|
| **Bundle size (gzip)** | ~5 KB | ~20 KB |
| **Dependencies** | 0 (peer-optional: date-fns, dayjs, luxon) | date-fns (required) |
| **Tree-shaking** | Full (ESM, `sideEffects: false`) | Partial |
| **Calendar systems** | Gregorian, Hijri, Persian via adapter pattern | Gregorian default; Persian via separate `react-day-picker/persian` |
| **Selection modes** | single, multiple, range | single, multiple, range |
| **ARIA compliance** | WAI-ARIA grid pattern, live regions, roving tabindex | ARIA attributes, custom navigation |
| **CSS approach** | Headless (BYO styles), styled component uses `data-*` selectors + Tailwind | CSS modules, classNames prop, or custom styles |
| **Multi-month** | Built-in (`numberOfMonths` prop) | Built-in (`numberOfMonths` prop) |
| **Keyboard navigation** | Arrow keys, Home/End, PageUp/PageDown, Escape | Arrow keys, PageUp/PageDown |
| **Framework** | React 18+ | React 18+ |
| **Date library lock-in** | None (adapter pattern) | date-fns required |

---

## Bundle size

`@gentleduck/calendar` ships ~5 KB gzipped with zero runtime dependencies. react-day-picker pulls in date-fns, bringing total bundle impact to ~20 KB gzipped. The adapter pattern means you only pay for the date library you already use.

Both libraries cover the core calendar feature set. The key differences are in architecture:

- **Adapter pattern**: `@gentleduck/calendar` decouples date logic from the calendar engine. Swap `NativeAdapter` for `DateFnsAdapter`, `DayjsAdapter`, or `LuxonAdapter` without changing component code.
- **Headless-first**: The `useCalendar` hook exposes grid data, selection state, and navigation without rendering anything. Build any UI on top.
- **Compound primitives**: `@gentleduck/primitives/calendar` provides accessible Calendar.Root / Calendar.Grid / Calendar.Day components that map to the ARIA grid pattern.

---

## Code comparison

The same date picker built with both libraries.

### react-day-picker

```tsx

function DatePicker() {
  const [selected, setSelected] = useState

  )
}
```

### @gentleduck/calendar

```tsx

function DatePicker() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState

  )
}
```

The API surface is similar. The main differences: no CSS import, no date-fns dependency for formatting, and built-in month/year dropdowns by default.

---

## Migration guide

### 1. Remove react-day-picker

```bash
npm uninstall react-day-picker
# date-fns can also be removed if nothing else uses it
npm uninstall date-fns
```

### 2. Install @gentleduck/calendar

```bash
npm install @gentleduck/calendar
```

Or add the styled Calendar component via the CLI:

```bash
npx gentleduck add calendar
```

### 3. Update imports

```diff
- import { DayPicker } from 'react-day-picker'
- import 'react-day-picker/style.css'
+ import { Calendar } from '@gentleduck/registry-ui/calendar'
```

### 4. Map props

| react-day-picker | @gentleduck/calendar | Notes |
|---|---|---|
| `mode="single"` | `mode="single"` | Same API |
| `mode="multiple"` | `mode="multiple"` | Same API |
| `mode="range"` | `mode="range"` | Same API |
| `selected` | `selected` | Same API |
| `onSelect` | `onSelect` | Same signature |
| `disabled` | `disabled` | Accepts `Date[]` or `(date: Date) => boolean` |
| `fromDate` / `toDate` | `fromDate` / `toDate` | Same API |
| `numberOfMonths` | `numberOfMonths` | Same API |
| `fixedWeeks` | `fixedWeeks` | Same API |
| `showOutsideDays` | `showOutsideDays` | Same API |
| `locale` | `locale` | BCP 47 string instead of date-fns locale object |
| `classNames` | `className` + Tailwind | Style with `data-*` attribute selectors |
| `captionLayout="dropdown"` | `showDropdowns={true}` | Enabled by default |
| `formatters` | `renderDay`, `renderHeader`, `renderWeekday` | Render props instead of formatter functions |
| `components` | `renderDay`, `renderHeader`, `renderFooter` | Render props replace component injection |

### 5. Remove CSS imports

`@gentleduck/calendar` is headless. The styled component uses Tailwind via `data-*` selectors. Delete any `react-day-picker/style.css` or custom CSS overrides.

### 6. Date formatting

If you were using date-fns `format()` only for the calendar trigger label, you can replace it with `Date.prototype.toLocaleDateString()`:

```diff
- import { format } from 'date-fns'
- format(date, 'PPP')
+ date.toLocaleDateString(undefined, { dateStyle: 'long' })
```

---

## What gentleduck adds

Same selection modes, same numberOfMonths, same fixedWeeks. The differences are in what you get beyond the basics:

| Feature | gentleduck | react-day-picker |
|---|---|---|
| **Bundle** | ~5 KB, 0 dependencies | ~20 KB + date-fns |
| **Calendar systems** | 4 (Gregorian, Islamic, Persian, Hebrew) | 1 (Gregorian) |
| **Date adapters** | 7 (Native, date-fns, dayjs, luxon + 3 calendar-specific) | date-fns only |
| **Headless hook** | `useCalendar` returns grid data for any UI | Not available |
| **Render props** | `renderDay`, `renderHeader`, `renderWeekday`, `renderFooter` | Component injection |
| **Month/year dropdowns** | `showDropdowns` prop, built-in | `captionLayout="dropdown"` |
| **Year range** | Configurable `yearRange` for dropdown | Limited |
| **Compound primitives** | Calendar.Root / Calendar.Grid / Calendar.Day with ARIA grid | Not available |
| **Locale/RTL** | Full i18n with Arabic numerals, Persian text, Hebrew | Basic locale support |
| **CSS required** | None (headless) | CSS modules or `style.css` import |

The adapter pattern is the key architectural difference. react-day-picker locks you into date-fns. gentleduck lets you use whatever date library your project already depends on, or none at all (NativeAdapter uses the built-in Date object). If your project uses dayjs for everything else, you use DayjsAdapter. No second date library in your bundle.

For teams building products that serve Arabic, Persian, or Hebrew-speaking users, gentleduck is the only copy-paste calendar library that supports Islamic (Hijri), Persian (Jalaali), and Hebrew calendar systems through pluggable adapters. react-day-picker ships a limited Persian variant but does not support Islamic or Hebrew calendars.

---

## Why teams switch

You drop 15 KB from your bundle immediately. react-day-picker plus date-fns costs ~20 KB gzipped. gentleduck/calendar costs ~5 KB with zero dependencies. If your project already uses dayjs or luxon, the savings are even larger because you stop shipping two date libraries.

You stop being locked into date-fns. The adapter pattern means your calendar uses whatever date library the rest of your project uses. One date library in your bundle instead of two.

You get calendar systems that react-day-picker does not ship. Islamic, Persian, and Hebrew calendars work through adapters. No alternative library at this size offers this.

You get a headless hook for custom UIs. `useCalendar` returns raw grid data, selection state, and navigation functions. Build any calendar UI you want - agenda views, timeline views, booking widgets - without fighting a component's opinion about layout.

**Why some teams stay on react-day-picker:**
- Their project is deeply coupled to the react-day-picker API across many files and migration cost is high
- They need observation-based Islamic calendar rules specific to the Persian DayPicker variant
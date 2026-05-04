}>

**Lesson 3 of 8**: use `buildCalendarMonth` to generate a month grid and render it as a table.

## The grid builder

`buildCalendarMonth` is a pure function. Pass an adapter, a date, and optional config; get back a `Grid.ICalendarMonth` with weeks and day cells.

```tsx showLineNumbers

const adapter = new NativeAdapter()
const march2026 = new Date(2026, 2, 1)

const month = buildCalendarMonth(adapter, march2026, {
  showOutsideDays: true,
  fixedWeeks: false,
})

// month.weeks is an array of Grid.ICalendarWeek objects
// Each week has 7 Grid.ICalendarDay objects
```

---

## What you get back

```tsx showLineNumbers
// Grid.ICalendarMonth<Date>
{
  month: Date,          // First day of the month
  weeks: [
    {
      weekNumber: 9,    // ISO week number
      days: [
        {
          date: Date,           // The date
          isToday: false,       // Is this today?
          isOutside: true,      // From adjacent month?
          isHidden: false,      // Hidden when showOutsideDays is false?
          isWeekend: true,      // Saturday or Sunday?
          isSelected: false,    // Set by applySelection()
          isDisabled: false,    // Set by applySelection()
          isRangeStart: false,  // Set by applySelection()
          isRangeEnd: false,    // Set by applySelection()
          isRangeMiddle: false, // Set by applySelection()
        },
        // ... 6 more days
      ]
    },
    // ... more weeks
  ]
}
```

---

## Rendering the grid

A minimal React component that renders the grid:

```tsx showLineNumbers

const adapter = new NativeAdapter()

function StaticCalendar({ date }: { date: Date }) {
  const month = buildCalendarMonth(adapter, date, {
    showOutsideDays: true,
  })

  return (

          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <th key={d}>{d}</th>
          ))}

        {month.weeks.map((week, i) => (

            {week.days.map(day => (

                {day.date.getDate()}

            ))}

        ))}

  )
}
```

---

## Multi-month grids

`buildMultiMonth` generates several consecutive months:

```tsx showLineNumbers

const months = buildMultiMonth(adapter, new Date(), 3, {
  showOutsideDays: true,
})

// months[0] - current month
// months[1] - next month
// months[2] - month after next
```

---

## Grid config options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `showOutsideDays` | `boolean` | `true` | When false, outside days are hidden and disabled |
| `fixedWeeks` | `boolean` | `false` | Always produces 6 weeks |
| `locale` | `CalendarLocaleConfig` | `{}` | Locale settings (see below) |

`locale.weekStartDay` sets the first day of the week (0 = Sunday, 1 = Monday). Pass it inside `locale`:

```tsx
buildCalendarMonth(adapter, date, {
  locale: { weekStartDay: 1 }, // Monday
})
```

}>

`buildCalendarMonth` is pure — no state. The next lesson uses `useCalendar` to add interactivity.

}>

Next: [Lesson 4 - Selection Modes](/docs/packages/duck-calendar/course/04-selection-modes)
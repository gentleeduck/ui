}>

**Lesson 7 of 8**: style every part of the calendar with data attributes — no CSS imports, no specificity wars.

## The headless approach

`@gentleduck/calendar` ships zero CSS. It outputs `data-*` attributes on every element so you can hook styles in.

That means:

- No CSS imports to manage.
- No specificity wars.
- Full control over every pixel.
- Works with any CSS approach (Tailwind, CSS modules, styled-components, plain CSS).

---

## Data attributes on day cells

Every day cell gets these attributes via `getDayProps`:

| Attribute | When set |
| :--- | :--- |
| `data-calendar-day` | Always present on day cells |
| `data-selected="true"` | Day is selected |
| `data-today="true"` | Day is today |
| `data-disabled="true"` | Day is disabled |
| `data-outside-month="true"` | Day belongs to adjacent month |
| `data-hidden="true"` | Day should be hidden (`showOutsideDays` is false) |
| `data-range-start="true"` | First day in range |
| `data-range-middle="true"` | Day is within range |
| `data-range-end="true"` | Last day in range |
| `data-focused="true"` | Day has keyboard focus |
| `data-weekend="true"` | Day is Saturday or Sunday |

---

## Tailwind example

```tsx showLineNumbers
function StyledCalendar() {
  const { state, getDayProps, getGridProps } = useCalendar({
    adapter,
    mode: 'range',
  })

  return (

      {state.weeks.map(week =>
        week.days.map(day => (

            {day.date.getDate()}

        ))
      )}

  )
}
```

---

## CSS stylesheet example

```css showLineNumbers
[data-selected="true"] {
  background: var(--color-primary);
  color: white;
  border-radius: 4px;
}

[data-today="true"] {
  border: 2px solid var(--color-primary);
}

[data-disabled="true"] {
  opacity: 0.4;
  pointer-events: none;
}

[data-range-start="true"] {
  border-radius: 4px 0 0 4px;
  background: var(--color-primary);
}

[data-range-middle="true"] {
  background: var(--color-accent);
  border-radius: 0;
}

[data-range-end="true"] {
  border-radius: 0 4px 4px 0;
  background: var(--color-primary);
}
```

---

## Slot attributes (compound components)

`@gentleduck/primitives/calendar` adds a `data-slot` attribute to each component, so you can style by semantic role:

```css showLineNumbers
[data-slot="calendar"] { /* root */ }
[data-slot="calendar-header"] { /* month/year title */ }
[data-slot="calendar-nav"] { /* nav wrapper */ }
[data-slot="calendar-nav-button"] { /* prev/next buttons */ }
[data-slot="calendar-grid"] { /* day grid */ }
[data-slot="calendar-weekdays"] { /* weekday header row */ }
[data-slot="calendar-day"] { /* individual day cell */ }
```

}>

Next: [Lesson 8 - Performance](/duck-calendar/course/08-performance)
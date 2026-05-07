}>

Install, wire up `useCalendar`, render a month grid, handle selection.

## Install

  
    npm
    bun
    pnpm
  
  
```bash
npm install @gentleduck/calendar
```
  
  
```bash
bun add @gentleduck/calendar
```
  
  
```bash
pnpm add @gentleduck/calendar
```
  

For compound components (optional):

  
    npm
    bun
    pnpm
  
  
```bash
npm install @gentleduck/primitives
```
  
  
```bash
bun add @gentleduck/primitives
```
  
  
```bash
pnpm add @gentleduck/primitives
```
  

Requirements:

- React `18+`
- TypeScript optional (types are bundled)

---

## Quick start

Create an adapter instance

The adapter tells the engine how to work with dates. The built-in `NativeAdapter` uses `Date` + `Intl.DateTimeFormat` with zero dependencies.

```tsx showLineNumbers
import { NativeAdapter } from '@gentleduck/calendar'

const adapter = new NativeAdapter()
```

Wire up the hook

`useCalendar` returns state, actions, and prop getters you spread onto your elements.

```tsx showLineNumbers
import { NativeAdapter, useCalendar } from '@gentleduck/calendar'

const adapter = new NativeAdapter()

function MyCalendar() {
  const { state, getDayProps, getGridProps, getHeaderProps, getNavProps } = useCalendar({
    adapter,
    mode: 'single',
  })

  return (
    <div>
      <div {...getHeaderProps()}>
        {adapter.format(state.month, { month: 'long', year: 'numeric' })}
      </div>
      <button {...getNavProps('prev')}><-</button>
      <button {...getNavProps('next')}>-></button>
      <div {...getGridProps()}>
        {state.weeks.map(week =>
          week.days.map(day => (
            <button key={day.date.getTime()} {...getDayProps(day)}>
              {day.date.getDate()}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
```

Or use compound components

If you prefer a declarative API, use the compound components from `@gentleduck/primitives/calendar`. They compose `useCalendar` internally.

```tsx showLineNumbers
import { NativeAdapter } from '@gentleduck/calendar'
import * as CalendarPrimitive from '@gentleduck/primitives/calendar'

const adapter = new NativeAdapter()

function MyCalendar() {
  return (
    <CalendarPrimitive.Root adapter={adapter} mode="single">
      <CalendarPrimitive.Header />
      <CalendarPrimitive.Nav />
      <CalendarPrimitive.Grid>
        <CalendarPrimitive.Weekdays />
        {/* Render day cells using CalendarPrimitive.Day */}
      </CalendarPrimitive.Grid>
    </CalendarPrimitive.Root>
  )
}
```

}>

Hooks and compound components share the same engine. Pick either. You can switch later.

---

## Next pages

} className="[&_ul]:my-0">

- [Adapters](/duck-calendar/guides/adapters) - The date adapter pattern and plugging in other date libraries.
- [Selection Modes](/duck-calendar/api/use-calendar) - Single, range, and multi-select.
- [Styling](/duck-calendar/guides/styling) - Data attributes and Tailwind.
- [Course](/duck-calendar/course) - Tutorial from zero to production.
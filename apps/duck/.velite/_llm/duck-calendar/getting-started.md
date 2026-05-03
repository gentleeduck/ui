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

const adapter = new NativeAdapter()
```

Wire up the hook

`useCalendar` returns state, actions, and prop getters you spread onto your elements.

```tsx showLineNumbers

const adapter = new NativeAdapter()

function MyCalendar() {
  const { state, getDayProps, getGridProps, getHeaderProps, getNavProps } = useCalendar({
    adapter,
    mode: 'single',
  })

  return (
    
      
      
        {/* Render day cells using CalendarPrimitive.Day */}

  )
}
```

}>

Hooks and compound components share the same engine. Pick either. You can switch later.

---

## Next pages

} className="[&_ul]:my-0">

- [Adapters](/docs/packages/duck-calendar/guides/adapters) - The date adapter pattern and plugging in other date libraries.
- [Selection Modes](/docs/packages/duck-calendar/api/use-calendar) - Single, range, and multi-select.
- [Styling](/docs/packages/duck-calendar/guides/styling) - Data attributes and Tailwind.
- [Course](/docs/packages/duck-calendar/course) - Tutorial from zero to production.
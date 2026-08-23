## Quick comparison

| | @gentleduck/primitives | Radix UI Primitives |
|---|---|---|
| **API compatibility** | Same compound-component pattern | Original API |
| **Source ownership** | You own the source (monorepo package) | node\_modules dependency |
| **Customization** | Modify internals directly | Fork or wrap |
| **Bundle** | Tree-shakable ESM, built with tsdown | Tree-shakable ESM |
| **Calendar primitive** | Included (Calendar.Root, Calendar.Grid, Calendar.Day) | Not available |
| **asChild** | Supported via Slot | Supported via Slot |
| **data-state attributes** | Same pattern (`data-state="open"`, `data-state="closed"`) | Same pattern |
| **ARIA** | WAI-ARIA compliant | WAI-ARIA compliant |
| **Animation** | Presence primitive + `@gentleduck/motion` tokens | Presence primitive |
| **Direction** | Direction primitive (LTR/RTL) | Direction primitive (LTR/RTL) |
| **Framework** | React 18+ | React 18+ |

***

## What's the same

`@gentleduck/primitives` follows the same patterns as Radix UI. If you know Radix, you know gentleduck primitives.

### Compound components

Both use the Root / Trigger / Content pattern:

```tsx
// Radix UI
import * as Dialog from '@radix-ui/react-dialog'

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

// gentleduck primitives
import * as Dialog from '@gentleduck/primitives/dialog'

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### asChild pattern

Both support `asChild` via the Slot primitive to merge props onto a child element instead of rendering a wrapper:

```tsx
<Dialog.Trigger asChild>
  <button className="custom-trigger">Open</button>
</Dialog.Trigger>
```

### data-state attributes

Both expose component state through `data-*` attributes for CSS targeting:

```css
[data-state='open'] { opacity: 1; }
[data-state='closed'] { opacity: 0; }
```

### ARIA compliance

Both implement WAI-ARIA authoring practices. Dialog manages focus trapping, escape dismissal, and `aria-labelledby` / `aria-describedby`. Menus implement `role="menu"` with roving tabindex. Select implements `role="listbox"`.

***

## What's different

### Source ownership

Radix primitives live in `node_modules`. You consume them as a dependency, versioned by the Radix team. Customizing behavior means forking or wrapping.

gentleduck primitives live in your monorepo as `packages/duck-primitives/`. You can modify any internal - focus trapping logic, dismiss behavior, animation integration - directly. The build step (tsdown) produces the same ESM output.

### Calendar primitive

`@gentleduck/primitives/calendar` provides accessible Calendar.Root / Calendar.Grid / Calendar.Day compound components backed by the `@gentleduck/calendar` engine. Radix does not ship a calendar primitive.

### Animation integration

Radix provides a Presence primitive for mount/unmount animations. gentleduck extends this with two improvements:

1. **Animation interrupt** - when a user rapidly toggles a popover or dialog, Radix can glitch because the exit animation's `animationend` event fires after re-mount, unmounting the newly opened content. gentleduck's Presence cancels in-flight exit animations on re-mount by resetting `animationName` and forcing a reflow. No more toggle glitches.

2. **Motion tokens** - `@gentleduck/motion` provides prebuilt keyframe sets and reduced-motion utilities that integrate with the Presence lifecycle. Animations automatically respect `prefers-reduced-motion`.

### Tooltip improvements

gentleduck's Tooltip adds `disableCloseOnClick` on the trigger. In Radix, wrapping an interactive element (like a Toggle button) in a TooltipTrigger causes the tooltip to intercept the click and close instead of letting the toggle work. gentleduck solves this at the primitive level with one prop.

### Bundled together

Radix ships each primitive as a separate npm package (`@radix-ui/react-dialog`, `@radix-ui/react-popover`, etc.), each with their own internal utilities. Every package bundles its own copy of react-slot, react-primitive, react-context, react-dismissable-layer, and react-focus-scope. Install 5 Radix primitives and you pay ~25 KB in duplicated internals.

gentleduck ships all primitives from a single package with shared internals. Slot, Presence, Popper, focus scope, and dismissable layer load once. Every additional primitive adds only its own code.

### Bundle size

Real numbers from bundlephobia.com (Radix) and built dist measurement (gentleduck), verified 2026-03-22:

```tsx title="components/chart-benchmark-primitives-vs.tsx"
// import from your project: import Demo from '@/components/chart-benchmark-primitives-vs'
'use client'

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@gentleduck/registry-ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import data from '../../../../apps/duck/public/data/benchmarks/primitives.json'

const config = {
  gentleduck: { label: 'gentleduck (KB)', color: 'var(--chart-1)' },
  radix: { label: 'Radix UI (KB)', color: 'var(--chart-2)' },
} satisfies ChartConfig

const chartData = data.savingsVsRadix.map((s: { name: string; gentleduckKB: number; competitorKB: number }) => ({
  name: s.name,
  gentleduck: s.gentleduckKB,
  radix: s.competitorKB,
}))

export default function PrimitivesVsRadix() {
  return (
    <div className="w-full">
      <p className="mb-3 text-muted-foreground text-xs">
        {chartData.length} components with verified bundlephobia data. Per-component gzipped size (KB).
      </p>
      <ChartContainer className="aspect-[3/2] min-h-[450px] w-full" config={config}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
          <CartesianGrid horizontal={false} />
          <YAxis dataKey="name" type="category" width={110} tickLine={false} axisLine={false} fontSize={11} />
          <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} />
          <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="gentleduck" fill="var(--color-gentleduck)" radius={[0, 4, 4, 0]} barSize={10} />
          <Bar dataKey="radix" fill="var(--color-radix)" radius={[0, 4, 4, 0]} barSize={10} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
```

}>
  **Note:** Radio Group is one case where Radix is actually smaller (1.0 KB vs 1.9 KB). We include honest numbers - not every primitive is smaller.

See the full [primitives benchmark](/duck-primitives/benchmarks) for the comparison table across all libraries.

***

## Migration

For most primitives, migration is a namespace change.

### 1. Update imports

```diff
- import * as Dialog from '@radix-ui/react-dialog'
+ import * as Dialog from '@gentleduck/primitives/dialog'

- import * as Popover from '@radix-ui/react-popover'
+ import * as Popover from '@gentleduck/primitives/popover'

- import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
+ import * as DropdownMenu from '@gentleduck/primitives/dropdown-menu'
```

### 2. Remove Radix packages

```bash
npm uninstall @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-dropdown-menu
# ... and all other @radix-ui/* packages
```

### 3. Install gentleduck primitives

```bash
npm install @gentleduck/primitives
```

### 4. Verify behavior

The component API, data attributes, and ARIA patterns are the same. Run your tests. The main things to check:

* **Custom `asChild` usage**: Same API, should work identically.
* **CSS selectors targeting `data-state`**: Same attribute values.
* **Animation classes**: If you used Radix's `data-state` for CSS transitions, they still work. If you want motion tokens, add `@gentleduck/motion`.
* **TypeScript types**: Prop types match. Generic patterns are the same.

***

## Available primitives

| Primitive | gentleduck | Radix |
|---|---|---|
| Dialog | Yes | Yes |
| Alert Dialog | Yes | Yes |
| Popover | Yes | Yes |
| Tooltip | Yes | Yes |
| Hover Card | Yes | Yes |
| Dropdown Menu | Yes | Yes |
| Context Menu | Yes | Yes |
| Menubar | Yes | Yes |
| Navigation Menu | Yes | Yes |
| Select | Yes | Yes |
| Radio Group | Yes | Yes |
| Slider | Yes | Yes |
| Toggle | Yes | Yes |
| Toggle Group | Yes | Yes |
| Avatar | Yes | Yes |
| Progress | Yes | Yes |
| Calendar | Yes | No |
| Command | Yes | No (cmdk) |
| Input OTP | Yes | No (input-otp) |
| Sheet | Yes | No (Dialog variant) |
| Pagination | Yes | No |

***

## Why teams switch to gentleduck primitives

You get the same API with less code. The Dialog, Popover, Select, and Tooltip work identically to their Radix equivalents - same compound pattern, same data-state attributes, same ARIA behavior. Migration is a namespace change in your imports.

You get a smaller bundle immediately. Alert Dialog drops from 18.6 KB to 1.6 KB. Popover drops from 19.6 KB to 2.4 KB. Dialog drops from 10.6 KB to 3.1 KB. These savings compound - install 5 primitives and you save 50-70 KB of duplicated internals.

You get primitives Radix does not ship. Calendar with 4 calendar systems, Command for command palettes, Input OTP, Sheet, and Pagination are built-in. With Radix, these require separate third-party libraries.

You own the source. When a Radix primitive doesn't behave the way you need - focus trapping in a specific edge case, dismiss behavior for nested overlays, animation timing - you modify it directly in your monorepo. No fork. No wrapper hack. No waiting for an upstream release.

**Why some teams stay on Radix:**

* They prefer an externally maintained dependency over owning the source
* They need per-primitive package installs for strict dependency auditing
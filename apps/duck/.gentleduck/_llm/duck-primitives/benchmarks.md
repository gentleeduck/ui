gentleduck sizes come from the built `dist/` output via `gzip -c | wc -c`. Radix
sizes are verified via the [bundlephobia.com](https://bundlephobia.com) API on
2026-03-22. Only verified data is included.

Run `bun run benchmark` in `packages/duck-primitives` to regenerate.

***

## Library Overview

| | gentleduck | Radix UI | Base UI (MUI) | Ark UI | Headless UI |
|---|---|---|---|---|---|
| **Maintainer** | gentleduck | WorkOS | MUI / Google | Chakra | Tailwind Labs |
| **Total size (all)** | ~55 KB | ~180 KB | ~45 KB | ~95 KB | ~35 KB |
| **Component count** | 35+ | 28 | ~15 | ~30 | ~10 |
| **Package model** | Single package | Per-component packages | Single package | Single package | Single package |
| **Styling approach** | Zero CSS, data attributes | Zero CSS, data attributes | Zero CSS, class callbacks | Zero CSS, data attributes | Zero CSS, class callbacks |
| **State management** | React state + context | React state + context | React state + context | xstate / zag.js | React state |
| **Composition** | Slot / asChild | Slot / asChild | Render props | Render props | Render props |
| **Animation** | Presence primitive | Presence primitive | None built-in | Presence primitive | Transition component |
| **Calendar** | Yes (4 systems) | No | No | No | No |
| **Command palette** | Yes (cmdk-based) | No (separate cmdk) | No | No | No |
| **RTL / i18n** | Direction primitive | Direction primitive | RTL prop | Locale context | No |
| **React version** | 18+ | 18+ | 18+ | 18+ | 18+ |
| **License** | MIT | MIT | MIT | MIT | MIT |

***

## Component Coverage

Which primitives each library ships:

| Component | gentleduck | Radix | Base UI | Ark UI | Headless |
|---|:---:|:---:|:---:|:---:|:---:|
| Accordion | Yes | Yes | Yes | Yes | - |
| Alert Dialog | Yes | Yes | - | Yes | - |
| Avatar | Yes | Yes | - | Yes | - |
| Calendar | Yes | - | - | - | - |
| Checkbox | Yes | Yes | Yes | Yes | - |
| Collapsible | Yes | Yes | Yes | Yes | - |
| Color Picker | - | - | - | Yes | - |
| Combobox | - | - | - | Yes | Yes |
| Command | Yes | - | - | - | - |
| Context Menu | Yes | Yes | - | Yes | - |
| Dialog | Yes | Yes | Yes | Yes | Yes |
| Dropdown Menu | Yes | Yes | Yes | Yes | Yes |
| Hover Card | Yes | Yes | - | Yes | - |
| Input OTP | Yes | - | - | - | - |
| Menu | Yes | - | Yes | - | Yes |
| Menubar | Yes | Yes | - | - | - |
| Navigation Menu | Yes | Yes | - | - | - |
| Pagination | Yes | - | Yes | Yes | - |
| Popover | Yes | Yes | Yes | Yes | Yes |
| Progress | Yes | Yes | Yes | Yes | - |
| Radio Group | Yes | Yes | Yes | Yes | Yes |
| Select | Yes | Yes | Yes | Yes | Yes |
| Sheet | Yes | - | - | - | - |
| Slider | Yes | Yes | Yes | Yes | - |
| Switch | Yes | Yes | Yes | Yes | Yes |
| Tabs | - | Yes | Yes | Yes | Yes |
| Toast | - | Yes | - | Yes | - |
| Toggle | Yes | Yes | Yes | Yes | - |
| Toggle Group | Yes | Yes | - | Yes | - |
| Tooltip | Yes | Yes | Yes | Yes | - |
| **Total** | **35+** | **28** | **~15** | **~30** | **~10** |

***

## Bundle Size: gentleduck vs Radix

Per-component gzipped size (verified via bundlephobia API, 15 components with data from both libraries):

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

const chartData = data.savings.map((s: { name: string; gentleduckKB: number; radixKB: number }) => ({
  name: s.name,
  gentleduck: s.gentleduckKB,
  radix: s.radixKB,
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

### Verified numbers

| Component | gentleduck | Radix UI | Difference |
|---|---|---|---|
| Alert Dialog | 1.6 KB | 18.6 KB | **92% smaller** |
| Popover | 2.4 KB | 19.6 KB | **88% smaller** |
| Tooltip | 3.5 KB | 15.5 KB | **77% smaller** |
| Dialog | 3.1 KB | 10.6 KB | **71% smaller** |
| Select | 7.5 KB | 23.7 KB | **68% smaller** |
| Toggle | 0.6 KB | 1.7 KB | **65% smaller** |
| Avatar | 1.1 KB | 2.5 KB | **54% smaller** |
| Radio Group | 1.9 KB | 1.0 KB | Radix is 45% smaller |

}>
  **Radio Group** is one case where Radix is smaller (1.0 KB vs 1.9 KB). Not every
  gentleduck primitive wins on size.

***

## All Components

Every primitive from both libraries side by side. 0 KB means the library doesn't
ship that component.

```tsx title="components/chart-benchmark-primitives-all.tsx"
// import from your project: import Demo from '@/components/chart-benchmark-primitives-all'
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

const chartData = data.perComponent.map((c: { name: string; gentleduck: number; radix: number }) => ({
  name: c.name,
  gentleduck: c.gentleduck > 0 ? +(c.gentleduck / 1024).toFixed(1) : 0,
  radix: c.radix > 0 ? +(c.radix / 1024).toFixed(1) : 0,
}))

export default function PrimitivesAllComponents() {
  return (
    <div className="w-full">
      <p className="mb-3 text-muted-foreground text-xs">
        All {chartData.length} components. 0 KB means the library does not ship that primitive.
      </p>
      <ChartContainer className="aspect-[1/2] min-h-[950px] w-full" config={config}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
          <CartesianGrid horizontal={false} />
          <YAxis dataKey="name" type="category" width={110} tickLine={false} axisLine={false} fontSize={11} />
          <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} />
          <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="gentleduck" fill="var(--color-gentleduck)" radius={[0, 4, 4, 0]} barSize={9} />
          <Bar dataKey="radix" fill="var(--color-radix)" radius={[0, 4, 4, 0]} barSize={9} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
```

***

## Module Sizes + Total

```tsx title="components/chart-benchmark-primitives.tsx"
// import from your project: import Demo from '@/components/chart-benchmark-primitives'
'use client'

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@gentleduck/registry-ui/chart'
import * as React from 'react'
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis, YAxis } from 'recharts'
import data from '../../../../apps/duck/public/data/benchmarks/primitives.json'

const tabs = ['Module Sizes', 'Total'] as const
type Tab = (typeof tabs)[number]

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'hsl(200 70% 50%)',
  'hsl(280 65% 55%)',
  'hsl(340 75% 55%)',
  'hsl(160 60% 45%)',
]

const totalConfig = {
  sizeKB: { label: 'Size (KB)', color: 'var(--chart-1)' },
  components: { label: 'Components', color: 'var(--chart-3)' },
} satisfies ChartConfig

const topModules = data.allSizes.slice(0, 8)
const otherSize = data.allSizes.slice(8).reduce((sum: number, m: { sizeKB: number }) => sum + m.sizeKB, 0)
const pieData = [
  ...topModules.map((m: { name: string; sizeKB: number }, i: number) => ({
    name: m.name,
    size: m.sizeKB,
    fill: COLORS[i % COLORS.length],
  })),
  { name: 'other', size: +otherSize.toFixed(1), fill: 'var(--chart-5)' },
]
const pieConfig = {
  ...Object.fromEntries(
    topModules.map((m: { name: string }, i: number) => [m.name, { label: m.name, color: COLORS[i % COLORS.length] }]),
  ),
  other: { label: `Other (${data.allSizes.length - 8} modules)`, color: 'var(--chart-5)' },
  size: { label: 'Size (KB)' },
} as ChartConfig

const totalKB = data.allSizes.reduce((sum: number, m: { sizeKB: number }) => sum + m.sizeKB, 0)

export default function PrimitivesBenchmarkOverview() {
  const [tab, setTab] = React.useState<Tab>('Module Sizes')

  return (
    <div className="w-full space-y-4">
      <div className="flex w-fit gap-1 rounded-lg bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 font-medium text-xs transition-colors ${tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="min-h-[320px]">
        {tab === 'Module Sizes' && (
          <div>
            <p className="mb-3 text-muted-foreground text-xs">Internal module breakdown. Top 8 + rest grouped.</p>
            <ChartContainer className="mx-auto aspect-square min-h-[380px] max-w-[400px]" config={pieConfig}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel indicator="dot" />} cursor={false} />
                <Pie data={pieData} dataKey="size" nameKey="name" innerRadius={65} strokeWidth={3}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text dominantBaseline="middle" textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                            <tspan className="fill-foreground font-bold text-3xl" x={viewBox.cx} y={viewBox.cy}>
                              {totalKB.toFixed(0)}
                            </tspan>
                            <tspan className="fill-muted-foreground text-xs" x={viewBox.cx} y={(viewBox.cy || 0) + 22}>
                              KB total
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        )}

        {tab === 'Total' && (
          <div>
            <p className="mb-3 text-muted-foreground text-xs">
              Total package size vs component count across headless UI libraries.
            </p>
            <ChartContainer className="aspect-[2/1] min-h-[280px] w-full" config={totalConfig}>
              <BarChart data={data.totalComparison} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="sizeKB" fill="var(--color-sizeKB)" radius={[4, 4, 0, 0]} barSize={28} />
                <Bar dataKey="components" fill="var(--color-components)" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </div>
    </div>
  )
}
```

***

## Feature Comparison

### Detailed feature breakdown

| Feature | gentleduck | Radix | Base UI | Ark UI | Headless |
|---|:---:|:---:|:---:|:---:|:---:|
| **Single package** | Yes | No (28 packages) | Yes | Yes | Yes |
| **Slot / asChild** | Yes | Yes | No | No | No |
| **Compound components** | Yes | Yes | No | Yes | No |
| **Presence (animation)** | Yes | Yes | No | Yes | Transition |
| **Popper (positioning)** | Built-in | Built-in | Floating UI | Floating UI | Floating UI |
| **Focus scope** | Built-in | Built-in | No | Built-in | No |
| **Dismissable layer** | Built-in | Built-in | Click away | Built-in | No |
| **Direction (RTL)** | Primitive | Primitive | Prop | Context | No |
| **Calendar system** | 4 (Gregorian, Islamic, Persian, Hebrew) | - | - | - | - |
| **Roving focus** | Built-in | Built-in | No | Built-in | No |
| **Collection** | Built-in | Built-in | No | No | No |
| **Tree-shakeable** | Yes | Yes | Yes | Yes | Yes |
| **Zero CSS** | Yes | Yes | Yes | Yes | Yes |
| **SSR safe** | Yes | Yes | Yes | Yes | Yes |
| **TypeScript** | Yes | Yes | Yes | Yes | Yes |

***

## Size vs features: why some primitives are larger

Smaller isn't always better. gentleduck ships more behavior per component than the
minimal alternatives:

| Built-in capability | What it saves you | Size cost |
|---|---|---|
| **Roving focus** | No manual `tabIndex` management or arrow-key handlers | ~0.4 KB |
| **Collection** | No manual item registration or index tracking | ~0.3 KB |
| **Compound components** | No prop-drilling through `SubMenu > Item > Label` trees | ~0.2 KB |
| **Presence (animation)** | No manual mount/unmount orchestration for CSS animations | ~0.5 KB |
| **Dismissable layer** | No manual `Escape` key + click-outside + nested layer handling | ~0.3 KB |
| **Popper (positioning)** | No separate Floating UI dependency or manual positioning | ~1.2 KB |

When a gentleduck primitive is larger than a competitor (Radio Group at 1.9 KB vs
Radix at 1.0 KB), the competitor either:

1. **Delegates to separate packages**. Radix splits focus, dismissal, and collection
   into internal packages. Each looks small, but install 5 primitives and you pay
   the overhead 5 times.
2. **Skips the behavior**. Base UI and Headless UI omit compound components, roving
   focus, and presence animations. You write that code.
3. **Uses external state machines**. Ark UI offloads to xstate/zag.js — ~15 KB of
   runtime not counted in the component size.

The fair comparison is total application cost: primitive size plus the code you
write to fill the gaps.

***

## Where each library wins

### gentleduck wins on

* **Bundle size** — 50-92% smaller than Radix for most components from shared internals.
* **Component count** — 35+ primitives including Calendar, Command, Sheet, Input OTP that others don't ship.
* **Single package** — no dependency management across 28+ separate packages.
* **Calendar** — only headless library with a multi-calendar-system primitive.
* **Source ownership** — primitives live in your monorepo, not in `node_modules`.

### Radix wins on

* **Maturity** — battle-tested at thousands of companies for years.
* **Ecosystem** — shadcn/ui, Vercel, and many design systems run on Radix.
* **Radio Group size** — 1.0 KB vs 1.9 KB (one case where Radix is lighter).
* **Tabs** — gentleduck doesn't ship a Tabs primitive yet.

### Base UI wins on

* **Per-component size** — some components skip compound-component overhead, so they're slightly smaller.
* **No compound pattern overhead** — render-prop API is lighter for basic cases.
* **Google backing** — part of the MUI ecosystem.

### Ark UI wins on

* **State machines** — xstate/zag.js for deterministic transitions in complex interactions.
* **Color Picker** — ships a color picker primitive others lack.
* **Combobox** — a dedicated combobox primitive (gentleduck uses Command).

### Headless UI wins on

* **Smallest total size** — ~35 KB for the whole library, with only 10 components.
* **Tailwind integration** — class-based API designed for Tailwind CSS.

***

## Why gentleduck is smaller than Radix

Radix ships each primitive as a **separate npm package**, each bundling its own copy
of the shared internals:

| Radix internal package | Size | Duplicated per primitive |
|---|---|---|
| `@radix-ui/react-slot` | ~0.8 KB | Yes |
| `@radix-ui/react-primitive` | ~0.3 KB | Yes |
| `@radix-ui/react-compose-refs` | ~0.3 KB | Yes |
| `@radix-ui/react-context` | ~0.4 KB | Yes |
| `@radix-ui/react-use-callback-ref` | ~0.2 KB | Yes |
| `@radix-ui/react-dismissable-layer` | ~1.5 KB | Yes |
| `@radix-ui/react-focus-scope` | ~1.5 KB | Yes |
| **Total overhead per primitive** | **~5 KB** | |

Install 5 Radix primitives — ~25 KB of duplicated internals. With gentleduck, the
shared internals load once (~5 KB) and each additional primitive only adds its own
code.

***

## Methodology

* **gentleduck**: sizes from `packages/duck-primitives/dist/` — concatenate all `.js` files per primitive directory, then `gzip -c | wc -c`.
* **Radix UI**: sizes from the [bundlephobia.com API](https://bundlephobia.com), queried per-package on 2026-03-22. Only verified responses included.
* **Base UI / Ark UI / Headless UI**: component counts and feature data from the official docs. Bundle sizes excluded where bundlephobia data was unavailable.
* Sizes are **minified + gzipped**.
* Built with tsdown (`minify: true`, `treeshake: true`, `format: 'esm'`).

Regenerate:

```bash
cd packages/duck-primitives
bun run benchmark
```

Output goes to `public/benchmarks/` and `apps/duck-ui-docs/public/data/benchmarks/primitives.json`.
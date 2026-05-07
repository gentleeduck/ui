}>

`@gentleduck/calendar` is a headless calendar engine. It ships the date math, grid logic, and keyboard handling. You own the markup and styles.

## Benchmarks

Built to replace `react-day-picker`. The measurements:

```tsx title="components/chart-benchmark-calendar-vs.tsx"
// import from your project: import Demo from '@/components/chart-benchmark-calendar-vs'
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import data from '../../../../apps/duck/public/data/benchmarks/calendar.json'

const tabs = ['Bundle Size', 'Total Cost'] as const
type Tab = (typeof tabs)[number]

const bundleConfig = {
  sizeKB: { label: 'JS Size (KB)', color: 'var(--chart-1)' },
  deps: { label: 'Dependencies', color: 'var(--chart-3)' },
} satisfies ChartConfig

const totalCostConfig = {
  js: { label: 'JavaScript (KB)', color: 'var(--chart-1)' },
  css: { label: 'CSS (KB)', color: 'var(--chart-2)' },
} satisfies ChartConfig

const totalCost = (data as Record<string, unknown>)['totalCost'] as
  | { name: string; js: number; css: number }[]
  | undefined

export default function CalendarBenchmarkVs() {
  const [tab, setTab] = React.useState<Tab>('Bundle Size')

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

      <div className="h-[320px]">
        {tab === 'Bundle Size' && (
          <div>
            <p className="mb-3 text-muted-foreground text-xs">Gzipped JS bundle size + dependency count.</p>
            <ChartContainer className="aspect-[2/1] min-h-[250px] w-full" config={bundleConfig}>
              <BarChart data={data.bundleSize} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="name" type="category" width={160} tickLine={false} axisLine={false} fontSize={11} />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="sizeKB" fill="var(--color-sizeKB)" radius={[0, 4, 4, 0]} barSize={14} />
                <Bar dataKey="deps" fill="var(--color-deps)" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ChartContainer>
          </div>
        )}

        {tab === 'Total Cost' && totalCost && (
          <div>
            <p className="mb-3 text-muted-foreground text-xs">
              Total download cost: JavaScript + required CSS (stacked).
            </p>
            <ChartContainer className="aspect-[2/1] min-h-[250px] w-full" config={totalCostConfig}>
              <BarChart data={totalCost} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="name" type="category" width={160} tickLine={false} axisLine={false} fontSize={11} />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="js" fill="var(--color-js)" radius={[0, 0, 0, 0]} barSize={16} stackId="cost" />
                <Bar dataKey="css" fill="var(--color-css)" radius={[0, 4, 4, 0]} barSize={16} stackId="cost" />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </div>
    </div>
  )
}
```

```tsx title="components/chart-benchmark-calendar.tsx"
// import from your project: import Demo from '@/components/chart-benchmark-calendar'
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
import data from '../../../../apps/duck/public/data/benchmarks/calendar.json'

const tabs = ['Modules', 'Performance', 'Adapters'] as const
type Tab = (typeof tabs)[number]

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'hsl(200 70% 50%)',
  'hsl(280 65% 55%)',
]

const perfConfig = { us: { label: 'Time (μs)', color: 'var(--chart-1)' } } satisfies ChartConfig
const adapterConfig = {
  buildMonth: { label: 'buildMonth (μs)', color: 'var(--chart-1)' },
  format: { label: 'format (μs)', color: 'var(--chart-3)' },
} satisfies ChartConfig

const modules = (data as Record<string, unknown>)['moduleSizes'] as { name: string; sizeKB: number }[] | undefined
const pieData = modules
  ? modules.map((m, i) => ({ name: m.name, size: m.sizeKB, fill: COLORS[i % COLORS.length] }))
  : []
const pieConfig = {
  ...Object.fromEntries((modules ?? []).map((m, i) => [m.name, { label: m.name, color: COLORS[i % COLORS.length] }])),
  size: { label: 'Size (KB)' },
} as ChartConfig
const totalKB = modules ? modules.reduce((sum, m) => sum + m.sizeKB, 0) : 0

export default function CalendarBenchmarkSelf() {
  const [tab, setTab] = React.useState<Tab>('Modules')

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
        {tab === 'Modules' && pieData.length > 0 && (
          <div>
            <p className="mb-3 text-muted-foreground text-xs">Internal module breakdown of @gentleduck/calendar.</p>
            <ChartContainer className="mx-auto aspect-square min-h-[280px] max-w-[320px]" config={pieConfig}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel indicator="dot" />} cursor={false} />
                <Pie data={pieData} dataKey="size" nameKey="name" innerRadius={60} strokeWidth={3}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text dominantBaseline="middle" textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                            <tspan className="fill-foreground font-bold text-2xl" x={viewBox.cx} y={viewBox.cy}>
                              {totalKB.toFixed(1)}
                            </tspan>
                            <tspan className="fill-muted-foreground text-xs" x={viewBox.cx} y={(viewBox.cy || 0) + 20}>
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

        {tab === 'Performance' && (
          <div>
            <p className="mb-3 text-muted-foreground text-xs">
              Core engine operations. Average of 2,000 iterations (us).
            </p>
            <ChartContainer className="aspect-[2/1] min-h-[220px] w-full" config={perfConfig}>
              <BarChart
                data={data.corePerformance}
                layout="vertical"
                margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="label" type="category" width={160} tickLine={false} axisLine={false} fontSize={11} />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent indicator="line" labelFormatter={(_, payload) => payload[0]?.payload?.label} />
                  }
                />
                <Bar dataKey="us" fill="var(--color-us)" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ChartContainer>
          </div>
        )}

        {tab === 'Adapters' && (
          <div>
            <p className="mb-3 text-muted-foreground text-xs">buildCalendarMonth + format across 4 calendar systems.</p>
            <ChartContainer className="aspect-[2/1] min-h-[200px] w-full" config={adapterConfig}>
              <BarChart data={data.adapterPerformance} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} />
                <YAxis tickLine={false} axisLine={false} fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="buildMonth" fill="var(--color-buildMonth)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="format" fill="var(--color-format)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </div>
    </div>
  )
}
```

~5 KB gzipped. Zero dependencies. 4 calendar systems. 7 date adapters. Full keyboard navigation and WAI-ARIA grid pattern. Islamic, Persian, and Hebrew support at this size. See the [full benchmarks](/duck-calendar/benchmarks) and the [comparison with react-day-picker](/www/comparisons/vs-react-day-picker).

## The four layers

**Core** - Pure functions for grid building, selection logic, and navigation. No React, no state, no side effects.

**Adapter** - An `Adapter.IDateAdapter<TDate>` interface that abstracts date operations. Ships with a zero-dependency `NativeAdapter` for `Date`. Plug in dayjs, date-fns, or Temporal when you need it.

**React hooks** - `useCalendar`, `useTimePicker`, `useDateTime` manage state and return prop getters you spread onto your elements.

**Compound components** - Available in `@gentleduck/primitives/calendar` when you want them. The hooks are first-class.

---

## Design goals

Existing React calendar libraries bundle CSS, mandate a specific date library, or ship monolithic components you cannot tree-shake. `@gentleduck/calendar` addresses each:

- **~5 KB gzipped** - 3 to 9 times smaller than the alternatives tested.
- **Zero runtime dependencies** - `NativeAdapter` uses `Date` and `Intl.DateTimeFormat`.
- **Pluggable date backend** - swap `Date` for dayjs, date-fns, or Temporal without touching calendar code.
- **No CSS** - style with data attributes and Tailwind.
- **WAI-ARIA grid pattern** - keyboard navigation and screen reader announcements built in.

---

## What's in the package

| Export | Description |
| :--- | :--- |
| `NativeAdapter` | Zero-dep adapter for the native `Date` object |
| `buildCalendarMonth` | Build a single month grid |
| `buildMultiMonth` | Build multiple consecutive month grids |
| `buildCalendarYear` | Build a 12-month picker |
| `buildDecadeView` | Build a decade year picker |
| `selectDay` | Compute new selection value |
| `applySelection` | Decorate weeks with selection flags |
| `navigate` / `canNavigate` | Navigate and check bounds |
| `useCalendar` | Main calendar React hook |
| `useTimePicker` | Time picker React hook |
| `useDateTime` | Combined date+time React hook |

---

## Next pages

} className="[&_ul]:my-0">

- [Getting Started](/duck-calendar/getting-started) - Install and build a calendar.
- [Guides](/duck-calendar/guides) - Adapters, styling, accessibility.
- [API Reference](/duck-calendar/api) - Prop and return type reference.
- [Course](/duck-calendar/course) - Lessons from zero to production.
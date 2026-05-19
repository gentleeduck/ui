## Bundle Size + Dependencies

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

***

## Per-Library Comparisons

Feature-by-feature tables against each competitor:

```tsx title="components/chart-benchmark-calendar-compare.tsx"
// import from your project: import Demo from '@/components/chart-benchmark-calendar-compare'
'use client'

import * as React from 'react'
import data from '../../../../apps/duck/public/data/benchmarks/calendar.json'

const tabs = ['vs react-day-picker', 'vs react-aria', 'vs react-datepicker', 'vs react-calendar'] as const
type Tab = (typeof tabs)[number]

const comparisons = (data as Record<string, unknown>)['libraryComparisons'] as
  | {
      name: string
      comparison: { metric: string; gentleduck: string; competitor: string; winner: string }[]
    }[]
  | undefined

export default function CalendarComparisonTables() {
  const [tab, setTab] = React.useState<Tab>('vs react-day-picker')
  const index = tabs.indexOf(tab)
  const comp = comparisons?.[index]

  if (!comp) return null

  return (
    <div className="w-full space-y-4">
      <div className="flex w-fit flex-wrap gap-1 rounded-lg bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-2.5 py-1.5 font-medium text-[11px] transition-colors ${tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t}
          </button>
        ))}
      </div>

      <div>
        <p className="mb-3 text-muted-foreground text-xs">
          @gentleduck/calendar vs {comp.name} — feature-by-feature comparison
        </p>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Metric</th>
                <th className="px-3 py-2.5 text-left font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    gentleduck
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                    {comp.name}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comp.comparison.map((row, i) => (
                <tr key={row.metric} className={`border-b last:border-b-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                  <td className="px-3 py-2 font-medium text-muted-foreground">{row.metric}</td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        row.winner === 'gentleduck'
                          ? 'inline-flex items-center gap-1 font-semibold text-green-600 dark:text-green-400'
                          : ''
                      }>
                      {row.winner === 'gentleduck' && <span className="text-green-500">✓</span>}
                      {row.gentleduck}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        row.winner === 'competitor'
                          ? 'inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400'
                          : ''
                      }>
                      {row.winner === 'competitor' && <span className="text-blue-500">✓</span>}
                      {row.competitor}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            Winner
          </span>
          <span>
            {comp.comparison.filter((r) => r.winner === 'gentleduck').length} gentleduck ·{' '}
            {comp.comparison.filter((r) => r.winner === 'competitor').length} {comp.name} ·{' '}
            {comp.comparison.filter((r) => r.winner === 'tie').length} tie
          </span>
        </div>
      </div>
    </div>
  )
}
```

***

## Internal Breakdown

Module sizes, core engine performance, and adapter benchmarks:

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

***

## Methodology

* **gentleduck**: sizes from `packages/duck-calendar/dist/` via `gzip -c | wc -c`
* **Competitors**: bundle sizes from npm and bundlephobia.com
* **Performance**: average of 2,000 iterations per operation
* Sizes are **minified + gzipped**

Regenerate:

```bash
cd packages/duck-calendar
bun run benchmark
```
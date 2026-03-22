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
import data from '../../../../apps/duck-ui-docs/public/data/benchmarks/calendar.json'

const tabs = ['Bundle Size', 'Total Cost', 'vs RDP', 'vs Aria', 'vs Datepicker', 'vs Calendar'] as const
type Tab = (typeof tabs)[number]

const bundleConfig = {
  sizeKB: { label: 'JS Size (KB)', color: 'var(--chart-1)' },
  deps: { label: 'Dependencies', color: 'var(--chart-3)' },
} satisfies ChartConfig

const totalCostConfig = {
  js: { label: 'JavaScript (KB)', color: 'var(--chart-1)' },
  css: { label: 'CSS (KB)', color: 'var(--chart-2)' },
} satisfies ChartConfig

const comparisons = (data as Record<string, unknown>).libraryComparisons as
  | {
      name: string
      comparison: { metric: string; gentleduck: string; competitor: string; winner: string }[]
    }[]
  | undefined

const totalCost = (data as Record<string, unknown>).totalCost as { name: string; js: number; css: number }[] | undefined

const vsMap: Record<string, number> = { 'vs RDP': 0, 'vs Aria': 1, 'vs Datepicker': 2, 'vs Calendar': 3 }

function ComparisonTable({ index }: { index: number }) {
  const comp = comparisons?.[index]
  if (!comp) return <p className="text-muted-foreground text-sm">No comparison data available.</p>

  return (
    <div>
      <p className="mb-3 text-muted-foreground text-xs">@gentleduck/calendar vs {comp.name}</p>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Metric</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">gentleduck</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">{comp.name}</th>
            </tr>
          </thead>
          <tbody>
            {comp.comparison.map((row) => (
              <tr key={row.metric} className="border-b last:border-b-0">
                <td className="px-3 py-2 font-medium">{row.metric}</td>
                <td
                  className={`px-3 py-2 ${row.winner === 'gentleduck' ? 'font-semibold text-green-600 dark:text-green-400' : ''}`}>
                  {row.gentleduck}
                </td>
                <td
                  className={`px-3 py-2 ${row.winner === 'competitor' ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}>
                  {row.competitor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function CalendarBenchmarkVs() {
  const [tab, setTab] = React.useState<Tab>('Bundle Size')

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
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

      {tab in vsMap && <ComparisonTable index={vsMap[tab] ?? 0} />}
    </div>
  )
}

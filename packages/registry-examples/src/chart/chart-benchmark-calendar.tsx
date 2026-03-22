'use client'

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@gentleduck/registry-ui/chart'
import * as React from 'react'
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis, YAxis } from 'recharts'
import data from '../../../../apps/duck-ui-docs/public/data/benchmarks/calendar.json'

const tabs = ['Bundle Size', 'Modules', 'Engine Perf', 'Adapters'] as const
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

const bundleConfig = { sizeKB: { label: 'Size (KB)', color: 'var(--chart-1)' } } satisfies ChartConfig
const perfConfig = { us: { label: 'Time (us)', color: 'var(--chart-1)' } } satisfies ChartConfig
const adapterConfig = {
  buildMonth: { label: 'buildMonth (us)', color: 'var(--chart-1)' },
  format: { label: 'format (us)', color: 'var(--chart-3)' },
} satisfies ChartConfig

// Module pie data
const modules = (data as Record<string, unknown>).moduleSizes as { name: string; sizeKB: number }[] | undefined
const pieData = modules
  ? modules.map((m, i) => ({ name: m.name, size: m.sizeKB, fill: COLORS[i % COLORS.length] }))
  : []
const pieConfig = Object.fromEntries([
  ...(modules ?? []).map((m, i) => [m.name, { label: m.name, color: COLORS[i % COLORS.length] }]),
  ['size', { label: 'Size (KB)' }],
]) as ChartConfig
const totalKB = modules ? modules.reduce((sum, m) => sum + m.sizeKB, 0) : 0

export default function CalendarBenchmarkDashboard() {
  const [tab, setTab] = React.useState<Tab>('Bundle Size')

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-1 rounded-lg bg-muted p-1">
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

      {tab === 'Bundle Size' && (
        <div>
          <p className="mb-3 text-muted-foreground text-xs">
            Gzipped bundle size. @gentleduck/calendar is ~5 KB with zero dependencies.
          </p>
          <ChartContainer className="aspect-[2/1] min-h-[250px] w-full" config={bundleConfig}>
            <BarChart data={data.bundleSize} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
              <CartesianGrid horizontal={false} />
              <YAxis dataKey="name" type="category" width={160} tickLine={false} axisLine={false} fontSize={11} />
              <XAxis type="number" unit=" KB" tickLine={false} axisLine={false} fontSize={10} />
              <ChartTooltip content={<ChartTooltipContent />} formatter={(v) => `${v} KB`} />
              <Bar dataKey="sizeKB" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ChartContainer>
        </div>
      )}

      {tab === 'Modules' && pieData.length > 0 && (
        <div>
          <p className="mb-3 text-muted-foreground text-xs">Internal module breakdown of @gentleduck/calendar.</p>
          <ChartContainer className="mx-auto aspect-square min-h-[280px] max-w-[320px]" config={pieConfig}>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
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

      {tab === 'Engine Perf' && (
        <div>
          <p className="mb-3 text-muted-foreground text-xs">
            Core engine operations. Average of 2,000 iterations (microseconds per call).
          </p>
          <ChartContainer className="aspect-[2/1] min-h-[220px] w-full" config={perfConfig}>
            <BarChart data={data.corePerformance} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
              <CartesianGrid horizontal={false} />
              <YAxis dataKey="label" type="category" width={160} tickLine={false} axisLine={false} fontSize={11} />
              <XAxis type="number" unit=" us" tickLine={false} axisLine={false} fontSize={10} />
              <ChartTooltip content={<ChartTooltipContent />} formatter={(v) => `${v} us`} />
              <Bar dataKey="us" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ChartContainer>
        </div>
      )}

      {tab === 'Adapters' && (
        <div>
          <p className="mb-3 text-muted-foreground text-xs">
            buildCalendarMonth + format across all 4 calendar systems (us per call).
          </p>
          <ChartContainer className="aspect-[2/1] min-h-[200px] w-full" config={adapterConfig}>
            <BarChart data={data.adapterPerformance} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} />
              <YAxis tickLine={false} axisLine={false} fontSize={10} unit=" us" />
              <ChartTooltip content={<ChartTooltipContent />} formatter={(v) => `${v} us`} />
              <Bar dataKey="buildMonth" fill="var(--chart-1)" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="format" fill="var(--chart-3)" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ChartContainer>
        </div>
      )}
    </div>
  )
}

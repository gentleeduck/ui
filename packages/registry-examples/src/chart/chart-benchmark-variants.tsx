'use client'

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@gentleduck/registry-ui/chart'
import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import data from '../../../../apps/duck-ui-docs/public/data/benchmarks/variants.json'

const tabs = ['Bundle Size', 'Runtime'] as const
type Tab = (typeof tabs)[number]

const sizeConfig = { sizeKB: { label: 'Size (KB)', color: 'var(--chart-1)' } } satisfies ChartConfig
const runtimeConfig = { ns: { label: 'Time (ns)', color: 'var(--chart-1)' } } satisfies ChartConfig

export default function VariantsBenchmarkDashboard() {
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
            Gzipped bundle size. @gentleduck/variants is smaller than CVA and tailwind-variants.
          </p>
          <ChartContainer className="aspect-[2/1] min-h-[200px] w-full" config={sizeConfig}>
            <BarChart data={data.bundleSize} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
              <CartesianGrid horizontal={false} />
              <YAxis dataKey="name" type="category" width={180} tickLine={false} axisLine={false} fontSize={11} />
              <XAxis type="number" unit=" KB" tickLine={false} axisLine={false} fontSize={10} />
              <ChartTooltip content={<ChartTooltipContent />} formatter={(v) => `${v} KB`} />
              <Bar dataKey="sizeKB" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ChartContainer>
        </div>
      )}

      {tab === 'Runtime' && (
        <div>
          <p className="mb-3 text-muted-foreground text-xs">
            cva() call speed. Average of 10,000 iterations (nanoseconds per call).
          </p>
          <ChartContainer className="aspect-[2/1] min-h-[200px] w-full" config={runtimeConfig}>
            <BarChart
              data={data.runtimePerformance}
              layout="vertical"
              margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
              <CartesianGrid horizontal={false} />
              <YAxis dataKey="label" type="category" width={180} tickLine={false} axisLine={false} fontSize={11} />
              <XAxis type="number" unit=" ns" tickLine={false} axisLine={false} fontSize={10} />
              <ChartTooltip content={<ChartTooltipContent />} formatter={(v) => `${v} ns`} />
              <Bar dataKey="ns" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ChartContainer>
        </div>
      )}
    </div>
  )
}

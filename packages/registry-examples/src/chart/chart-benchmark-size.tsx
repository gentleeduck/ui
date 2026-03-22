'use client'

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@gentleduck/registry-ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const data = [
  { name: 'Alert Dialog', gentleduck: 1.6, radix: 18.6 },
  { name: 'Popover', gentleduck: 2.4, radix: 19.6 },
  { name: 'Tooltip', gentleduck: 3.5, radix: 15.5 },
  { name: 'Dialog', gentleduck: 3.1, radix: 10.6 },
  { name: 'Select', gentleduck: 7.5, radix: 23.7 },
  { name: 'Toggle', gentleduck: 0.6, radix: 1.7 },
  { name: 'Avatar', gentleduck: 1.1, radix: 2.5 },
  { name: 'Radio Group', gentleduck: 1.9, radix: 1.0 },
]

const config = {
  gentleduck: { label: 'gentleduck', color: 'var(--chart-1)' },
  radix: { label: 'Radix UI', color: 'var(--chart-2)' },
} satisfies ChartConfig

export default function BenchmarkSizeChart() {
  return (
    <div className="w-full">
      <h4 className="mb-1 font-semibold text-sm">Bundle Size: gentleduck vs Radix UI</h4>
      <p className="mb-4 text-muted-foreground text-xs">
        Per-component gzipped size in KB (verified via bundlephobia API, 2026-03-22)
      </p>
      <ChartContainer className="aspect-[2/1] min-h-[300px] w-full" config={config}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
          <CartesianGrid horizontal={false} />
          <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} fontSize={12} />
          <XAxis type="number" unit=" KB" tickLine={false} axisLine={false} fontSize={11} />
          <ChartTooltip content={<ChartTooltipContent className="w-[180px]" />} formatter={(value) => `${value} KB`} />
          <Bar dataKey="gentleduck" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={12} />
          <Bar dataKey="radix" fill="var(--chart-2)" radius={[0, 4, 4, 0]} barSize={12} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

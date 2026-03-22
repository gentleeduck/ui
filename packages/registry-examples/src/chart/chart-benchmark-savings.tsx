'use client'

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@gentleduck/registry-ui/chart'
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'

const data = [
  { name: 'Alert Dialog', saving: 92 },
  { name: 'Popover', saving: 88 },
  { name: 'Tooltip', saving: 77 },
  { name: 'Dialog', saving: 71 },
  { name: 'Select', saving: 68 },
  { name: 'Toggle', saving: 65 },
  { name: 'Avatar', saving: 54 },
  { name: 'Radio Group', saving: -83 },
]

const config = {
  saving: { label: 'Size reduction', color: 'var(--chart-1)' },
} satisfies ChartConfig

export default function BenchmarkSavingsChart() {
  return (
    <div className="w-full">
      <h4 className="mb-1 font-semibold text-sm">Size Savings vs Radix UI</h4>
      <p className="mb-4 text-muted-foreground text-xs">
        Percentage smaller (negative means Radix is smaller). Verified bundlephobia data.
      </p>
      <ChartContainer className="aspect-[2/1] min-h-[280px] w-full" config={config}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
          <CartesianGrid horizontal={false} />
          <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} fontSize={12} />
          <XAxis type="number" unit="%" tickLine={false} axisLine={false} fontSize={11} domain={[-100, 100]} />
          <ChartTooltip
            content={<ChartTooltipContent className="w-[200px]" />}
            formatter={(value) => `${Number(value) > 0 ? `${value}% smaller` : `${Math.abs(Number(value))}% larger`}`}
          />
          <Bar dataKey="saving" radius={[0, 4, 4, 0]} barSize={14}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.saving > 0 ? 'var(--chart-1)' : 'var(--chart-5)'} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}

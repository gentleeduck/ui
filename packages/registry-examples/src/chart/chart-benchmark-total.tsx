'use client'

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@gentleduck/registry-ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const data = [
  { name: 'Headless UI', size: 35, components: 10 },
  { name: 'Base UI', size: 45, components: 15 },
  { name: 'gentleduck', size: 55, components: 35 },
  { name: 'Ark UI', size: 95, components: 30 },
  { name: 'Radix UI', size: 180, components: 28 },
]

const config = {
  size: { label: 'Total Size (KB)', color: 'var(--chart-1)' },
  components: { label: 'Components', color: 'var(--chart-3)' },
} satisfies ChartConfig

export default function BenchmarkTotalChart() {
  return (
    <div className="w-full">
      <h4 className="mb-1 font-semibold text-sm">Total Package Size vs Component Count</h4>
      <p className="mb-4 text-muted-foreground text-xs">
        Gzipped size of all components. gentleduck ships the most primitives at a mid-range size.
      </p>
      <ChartContainer className="aspect-[2/1] min-h-[250px] w-full" config={config}>
        <BarChart data={data} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis tickLine={false} axisLine={false} fontSize={11} />
          <ChartTooltip
            content={<ChartTooltipContent className="w-[200px]" />}
            formatter={(value, name) => `${value}${name === 'size' ? ' KB' : ' components'}`}
          />
          <Bar dataKey="size" fill="var(--chart-1)" radius={[4, 4, 0, 0]} barSize={28} />
          <Bar dataKey="components" fill="var(--chart-3)" radius={[4, 4, 0, 0]} barSize={28} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

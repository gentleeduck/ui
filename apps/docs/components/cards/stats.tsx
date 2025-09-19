'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gentleduck/registry-ui-duckui/card'
import { ChartConfig, ChartContainer } from '@gentleduck/registry-ui-duckui/chart'
import { Area, AreaChart, Line, LineChart } from 'recharts'

const data = [
  {
    revenue: 10400,
    subscription: 40,
  },
  {
    revenue: 14405,
    subscription: 90,
  },
  {
    revenue: 9400,
    subscription: 200,
  },
  {
    revenue: 8200,
    subscription: 278,
  },
  {
    revenue: 7000,
    subscription: 89,
  },
  {
    revenue: 9600,
    subscription: 239,
  },
  {
    revenue: 11244,
    subscription: 78,
  },
  {
    revenue: 26475,
    subscription: 89,
  },
]

const chartConfig = {
  revenue: {
    color: 'var(--primary)',
    label: 'Revenue',
  },
  subscription: {
    color: 'var(--primary)',
    label: 'Subscriptions',
  },
} satisfies ChartConfig

export function CardsStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 h-fit">
      <Card className="h-[265px]">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-3xl">$15,231.89</CardTitle>
          <CardDescription>+20.1% from last month</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <ChartContainer className="h-[80px] w-full" config={chartConfig}>
            <LineChart
              data={data}
              margin={{
                bottom: 0,
                left: 10,
                right: 10,
                top: 5,
              }}>
              <Line
                activeDot={{
                  r: 6,
                }}
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="pb-0 lg:hidden xl:flex h-[265px]">
        <CardHeader>
          <CardDescription>Subscriptions</CardDescription>
          <CardTitle className="text-3xl">+2,350</CardTitle>
          <CardDescription>+180.1% from last month</CardDescription>
          <CardAction>
            <Button size="sm" variant="ghost">
              View More
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="mt-auto max-h-[124px] flex-1 p-0">
          <ChartContainer className="size-full" config={chartConfig}>
            <AreaChart
              data={data}
              margin={{
                left: 0,
                right: 0,
              }}>
              <Area
                dataKey="subscription"
                fill="var(--color-subscription)"
                fillOpacity={0.05}
                stroke="var(--color-subscription)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

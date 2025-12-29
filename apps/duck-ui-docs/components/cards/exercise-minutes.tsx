'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gentleduck/registry-ui-duckui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@gentleduck/registry-ui-duckui/chart'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

const data = [
  {
    average: 400,
    day: 'Monday',
    today: 240,
  },
  {
    average: 300,
    day: 'Tuesday',
    today: 139,
  },
  {
    average: 200,
    day: 'Wednesday',
    today: 980,
  },
  {
    average: 278,
    day: 'Thursday',
    today: 390,
  },
  {
    average: 189,
    day: 'Friday',
    today: 480,
  },
  {
    average: 239,
    day: 'Saturday',
    today: 380,
  },
  {
    average: 349,
    day: 'Sunday',
    today: 430,
  },
]

const chartConfig = {
  average: {
    color: 'var(--primary)',
    label: 'Average',
  },
  today: {
    color: 'var(--primary)',
    label: 'Today',
  },
} satisfies ChartConfig

export function CardsExerciseMinutes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Minutes</CardTitle>
        <CardDescription>Your exercise minutes are ahead of where you normally are.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full md:h-[200px]" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              bottom: 0,
              left: 16,
              right: 10,
              top: 5,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="day"
              tickFormatter={(value) => value.slice(0, 3)}
              tickLine={false}
              tickMargin={8}
            />
            <Line
              activeDot={{
                r: 5,
              }}
              dataKey="today"
              dot={{
                fill: 'var(--color-today)',
              }}
              stroke="var(--color-today)"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              activeDot={{
                r: 5,
              }}
              dataKey="average"
              dot={{
                fill: 'var(--color-average)',
                opacity: 0.5,
              }}
              stroke="var(--color-average)"
              strokeOpacity={0.5}
              strokeWidth={2}
              type="monotone"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

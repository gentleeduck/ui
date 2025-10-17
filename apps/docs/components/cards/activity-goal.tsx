'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gentleduck/registry-ui-duckui/card'
import { ChartConfig, ChartContainer } from '@gentleduck/registry-ui-duckui/chart'
import { MinusIcon, PlusIcon } from 'lucide-react'
import * as React from 'react'
import { Bar, BarChart } from 'recharts'

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
]

const chartConfig = {
  goal: {
    color: 'var(--primary)',
    label: 'Goal',
  },
} satisfies ChartConfig

export function CardsActivityGoal() {
  const [goal, setGoal] = React.useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Card className="h-[300px] gap-5">
      <CardHeader>
        <CardTitle>Move Goal</CardTitle>
        <CardDescription>Set your daily activity goal.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex items-center justify-center gap-4">
          <Button
            className="size-7 rounded-full"
            disabled={goal <= 200}
            onClick={() => onClick(-10)}
            size="icon"
            variant="outline">
            <MinusIcon />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="text-center">
            <div className="text-4xl font-bold tracking-tighter tabular-nums">{goal}</div>
            <div className="text-muted-foreground text-xs uppercase">Calories/day</div>
          </div>
          <Button
            className="size-7 rounded-full"
            disabled={goal >= 400}
            onClick={() => onClick(10)}
            size="icon"
            variant="outline">
            <PlusIcon />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
        <div className="flex-1">
          <ChartContainer className="aspect-auto h-[77px] w-full" config={chartConfig}>
            <BarChart data={data}>
              <Bar dataKey="goal" fill="var(--color-goal)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary">
          Set Goal
        </Button>
      </CardFooter>
    </Card>
  )
}

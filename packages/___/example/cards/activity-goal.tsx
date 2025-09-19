'use client'

import { Minus, Plus } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { Bar, BarChart, ResponsiveContainer } from 'recharts'

import { useConfig } from '@/hooks/use-config'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/registry/default/ui/'
import { Button } from '@/registry/registry-ui-components'
import { themes } from '@/registry/themes'

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

export function CardsActivityGoal() {
  const { theme: mode } = useTheme()
  const [config] = useConfig()

  const theme = themes.find((theme) => theme.name === config.theme)
  const [goal, setGoal] = React.useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Move Goal</CardTitle>
        <CardDescription>Set your daily activity goal.</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-center space-x-2">
          <Button
            className="h-8 w-8 shrink-0 rounded-full"
            disabled={goal <= 200}
            onClick={() => onClick(-10)}
            size="icon"
            variant="outline">
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="flex-1 text-center">
            <div className="text-5xl font-bold tracking-tighter">{goal}</div>
            <div className="text-[0.70rem] uppercase text-muted-foreground">Calories/day</div>
          </div>
          <Button
            className="h-8 w-8 shrink-0 rounded-full"
            disabled={goal >= 400}
            onClick={() => onClick(10)}
            size="icon"
            variant="outline">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
        <div className="my-3 h-[60px]">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={data}>
              <Bar
                dataKey="goal"
                style={
                  {
                    '--theme-primary': `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].primary})`,
                    fill: 'var(--theme-primary)',
                    opacity: 0.2,
                  } as React.CSSProperties
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Set Goal</Button>
      </CardFooter>
    </Card>
  )
}

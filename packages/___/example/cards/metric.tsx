import { useTheme } from 'next-themes'
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'

import { useConfig } from '@/hooks/use-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/default/ui/'
import { themes } from '@/registry/themes'

const data = [
  {
    average: 400,
    today: 240,
  },
  {
    average: 300,
    today: 139,
  },
  {
    average: 200,
    today: 980,
  },
  {
    average: 278,
    today: 390,
  },
  {
    average: 189,
    today: 480,
  },
  {
    average: 239,
    today: 380,
  },
  {
    average: 349,
    today: 430,
  },
]

export function CardsMetric() {
  const { theme: mode } = useTheme()
  const [config] = useConfig()

  const theme = themes.find((theme) => theme.name === config.theme)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Minutes</CardTitle>
        <CardDescription>Your exercise minutes are ahead of where you normally are.</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px]">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart
              data={data}
              margin={{
                bottom: 0,
                left: 10,
                right: 10,
                top: 5,
              }}>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Average</span>
                            <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Today</span>
                            <span className="font-bold">{payload[1].value}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return null
                }}
              />
              <Line
                activeDot={{
                  r: 6,
                  style: { fill: 'var(--theme-primary)', opacity: 0.25 },
                }}
                dataKey="average"
                strokeWidth={2}
                style={
                  {
                    '--theme-primary': `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].primary})`,
                    opacity: 0.25,
                    stroke: 'var(--theme-primary)',
                  } as React.CSSProperties
                }
                type="monotone"
              />
              <Line
                activeDot={{
                  r: 8,
                  style: { fill: 'var(--theme-primary)' },
                }}
                dataKey="today"
                strokeWidth={2}
                style={
                  {
                    '--theme-primary': `hsl(${theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].primary})`,
                    stroke: 'var(--theme-primary)',
                  } as React.CSSProperties
                }
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

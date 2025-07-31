import * as React from 'react'
import { Bar, BarChart, ResponsiveContainer } from 'recharts'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { DrawerWrapper } from '@gentleduck/registry-ui-duckui/drawer'

function generateRandomGoals(count: number, minGoal: number = 100, maxGoal: number = 500): { goal: number }[] {
  const goals: { goal: number }[] = []
  for (let i = 0; i < count; i++) {
    goals.push({
      goal: Math.floor(Math.random() * (maxGoal - minGoal + 1)) + minGoal,
    })
  }
  return goals
}

const goals = generateRandomGoals(20)

export default function DrawerDemo7() {
  const [open, setOpen] = React.useState<boolean>(false)
  const [goal, setGoal] = React.useState<number>(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <DrawerWrapper
      modal={false}
      open={open}
      trigger={{
        children: (
          <Button onClick={() => setOpen(true)} variant="outline">
            Open New Drawer
          </Button>
        ),
      }}
      content={{
        className: 'h-[480px] [&>div]:max-w-sm [&>div]:mx-auto',
        children: <ContentComponent goal={goal} onClick={onClick} />,
        _header: {
          _title: { children: <>Goal</> },
          _description: { children: <>Set your daily calorie goal</> },
        },
        _footer: {
          className: 'flex-row',
          _submit: {
            children: (
              <Button variant="default" className="w-full" onClick={() => setOpen(false)}>
                Close Drawer
              </Button>
            ),
          },
        },
      }}
    />
  )
}

export const ContentComponent = ({ goal, onClick }: { goal: number; onClick: (adjustment: number) => void }) => {
  return (
    <div className="flex w-full items-start justify-center pt-4 pb-2">
      <div className="p-4 pb-0">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => onClick(-10)}
            disabled={goal <= 200}>
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="flex-1 text-center">
            <div className="font-bold text-7xl tracking-tighter">{goal}</div>
            <div className="text-[0.70rem] text-muted-foreground uppercase">Calories/day</div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => onClick(10)}
            disabled={goal >= 400}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
        <div className="mt-3 h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%" className={'!w-[368px]'}>
            <BarChart data={goals}>
              <Bar
                dataKey="goal"
                style={
                  {
                    width: '50px',
                    fill: 'hsl(var(--foreground))',
                    opacity: 0.9,
                  } as React.CSSProperties
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

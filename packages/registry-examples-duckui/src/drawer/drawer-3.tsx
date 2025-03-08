import React from 'react'
import { Button } from '@/registry/registry-ui-components/button'
import { Inbox } from 'lucide-react'

export default function Button17Demo() {
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <>
      <Button
        aria-label="Inbox button with 23 notifications"
        type="button"
        role="button"
        isCollapsed={open}
        icon={{ children: Inbox }}
        onClick={() => setOpen(!open)}
      >
        Button
      </Button>
    </>
  )
}
export default function DrawerDemo3() {
  const [goal, setGoal] = React.useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <DrawerWrapper
      trigger={{ children: <Button variant="outline">Open New Drawer</Button> }}
      content={{
        className: 'h-[450px] [&>div]:max-w-sm [&>div]:mx-auto',
        children: <ContentComponent goal={goal} onClick={onClick} />,
      }}
    />
  )
}

export const ContentComponent = ({
  goal,
  onClick,
}: { goal: number; onClick: (adjustment: number) => void }) => {
  return (
    <div className="w-full flex items-start justify-center pt-4 pb-2">
      <div className="p-4 pb-0">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => onClick(-10)}
            disabled={goal <= 200}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="flex-1 text-center">
            <div className="text-7xl font-bold tracking-tighter">{goal}</div>
            <div className="text-[0.70rem] uppercase text-muted-foreground">
              Calories/day
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => onClick(10)}
            disabled={goal >= 400}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
        <div className="mt-3 h-[120px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
            className={'!w-[368px]'}
          >
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

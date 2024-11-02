import React from 'react'
import { ArrowBigUpDash, ShieldAlert } from 'lucide-react'
import { TooltipProvider } from '@/registry/default/ui'
import { toast } from 'sonner'
import { Button } from '@/registry/registry-ui-components'

export default function ButtonAdvancedDemo() {
  const [open, setOpen] = React.useState<boolean>(false)
  return (
    <>
      {/* You should use one TooltipProvider that's gonna wrap your application */}
      <TooltipProvider>
        <Button
          isCollapsed={open}
          icon={{
            children: ArrowBigUpDash,
            className: 'size-4',
          }}
          aria-label={'button'}
          aria-expanded={open}
          tabIndex={0}
          loading={false}
          onClick={() => setOpen(prev => !prev)}
          label={{
            children: 'Normal Button',
            showCommand: true,
            showLabel: true,
            side: 'top',
            delayDuration: 0,
          }}
          command={{
            label: '⇧+o',
            key: 'shift+o',
            action: () =>
              toast('Actions have been triggered', {
                className: 'gap-3',
                description: `you have clicked the 'super button' button, and btw i can be loading.`,
                icon: <ShieldAlert />,
                action: {
                  label: 'Undo',
                  onClick: () => console.log('Undo'),
                },
              }),
          }}
        >
          Button
        </Button>
      </TooltipProvider>
    </>
  )
}

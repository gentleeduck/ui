import React from 'react'
import { Inbox } from 'lucide-react'
import { TooltipProvider } from '@/registry/default/ui'
import { toast } from 'sonner'
import { Button } from '@/registry/registry-ui-components'

export default function ButtonAdvancedDemo() {
  const [open, setOpen] = React.useState<boolean>(false)
  return (
    <>
      <TooltipProvider>
        <Button
          isCollapsed={open}
          icon={{
            children: Inbox,
          }}
          title={'click me'}
          variant={'default'}
          size={'sm'}
          role="button"
          aria-label={'click me'}
          aria-expanded={open}
          tabIndex={0}
          loading={false}
          label={{
            children: 'Click me',
            showCommand: true,
            delayDuration: 0,
          }}
          command={{
            label: 'click me',
            key: 'k',
            action: () =>
              toast('Your inbox has been updated', {
                description: `you have clicked the 'click me' button`,
              }),
          }}
        />
      </TooltipProvider>
    </>
  )
}

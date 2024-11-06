import React from 'react'
import { Inbox } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/registry/registry-ui-components'

export default function Button24Demo() {
  const [open, setOpen] = React.useState<boolean>(false)

  const handleClick = () => {
    setOpen(!open)
    toast('Your inbox has been updated', {
      description: `You clicked the 'click me' button`,
    })
  }

  return (
    <Button
      role="button"
      aria-label="Inbox button"
      aria-expanded={open}
      aria-pressed={open}
      isCollapsed={open}
      icon={{ children: Inbox }}
      variant="default"
      size="sm"
      tabIndex={0}
      loading={false}
      onClick={handleClick}
      label={{
        children: 'Click me',
        showCommand: true,
        showLabel: true,
        delayDuration: 0,
      }}
      command={{
        label: 'click me',
        key: 'k',
        action: handleClick,
      }}
    >
      Button
    </Button>
  )
}

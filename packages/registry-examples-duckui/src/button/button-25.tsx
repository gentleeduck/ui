import React from 'react'
import { Inbox } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@duck/registry-ui-duckui/button'

export default function Button24Demo() {
  const [open, setOpen] = React.useState<boolean>(false)

  const handleClick = () => {
    setOpen(!open)
    toast('Your inbox has been updated', {
      description: `You clicked the 'click me 🎉' button`,
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
      tabIndex={0}
      loading={false}
      type="button"
      onClick={handleClick}
      label={{
        children: 'Click me 🎉',
        showCommand: true,
        showLabel: true,
        delayDuration: 0,
      }}
      command={{
        label: '⇧+k',
        key: 'shift+k',
        action: handleClick,
      }}
    >
      Button
    </Button>
  )
}

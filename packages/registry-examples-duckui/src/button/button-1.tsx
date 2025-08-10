import { Button } from '@gentleduck/registry-ui-duckui/button'
import { CommandShortcut } from '@gentleduck/registry-ui-duckui/command'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import { useKeyCommands } from '@gentleduck/vim/react'
import { ArrowBigUpDash, Command, ShieldAlert } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function ButtonDemo() {
  const [open, setOpen] = React.useState<boolean>(false)

  useKeyCommands({
    'ctrl+m': {
      name: 'ctrl+m',
      description: 'a command that will open the advanced button',
      execute: () => {},
    },
  })

  return (
    <Tooltip placement="top">
      <TooltipTrigger asChild>
        <Button
          isCollapsed={open}
          icon={<ArrowBigUpDash />}
          aria-label={'advanced button'}
          size="default"
          aria-expanded={open}
          loading={false}
          onClick={() => setOpen((prev) => !prev)}>
          Button
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2">
        <CommandShortcut
          variant="secondary"
          keys="ctrl+m"
          onKeysPressed={() => {
            setOpen((prev) => !prev)
            toast.success('Advanced button')
          }}>
          <Command />
          +m
        </CommandShortcut>
        <p>Advanced button</p>
      </TooltipContent>
    </Tooltip>
  )
}

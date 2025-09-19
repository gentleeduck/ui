import { Button } from '@gentleduck/registry-ui-duckui/button'
import { CommandShortcut } from '@gentleduck/registry-ui-duckui/command'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import { useKeyCommands } from '@gentleduck/vim/react'
import { ArrowBigUpDash, Command } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function ButtonDemo() {
  const [open, setOpen] = React.useState<boolean>(false)

  useKeyCommands({
    'ctrl+m': {
      description: 'a command that will open the advanced button',
      execute: () => {},
      name: 'ctrl+m',
    },
  })

  return (
    <Tooltip placement="top">
      <TooltipTrigger asChild>
        <Button
          aria-expanded={open}
          aria-label={'advanced button'}
          icon={<ArrowBigUpDash />}
          isCollapsed={open}
          loading={false}
          onClick={() => setOpen((prev) => !prev)}
          size="default">
          Button
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2">
        <CommandShortcut
          keys="ctrl+m"
          onKeysPressed={() => {
            setOpen((prev) => !prev)
            toast.success('Advanced button')
          }}
          variant="secondary">
          <Command />
          +m
        </CommandShortcut>
        <p>Advanced button</p>
      </TooltipContent>
    </Tooltip>
  )
}

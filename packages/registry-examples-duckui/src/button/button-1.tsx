import { Button } from '@gentleduck/registry-ui-duckui/button'
import { CommandShortcut } from '@gentleduck/registry-ui-duckui/command'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import { useKeyCommands } from '@gentleduck/vim/react'
import { ArrowBigUpDash, Command, ShieldAlert } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function Button1Demo() {
  const [open, setOpen] = React.useState<boolean>(false)

  useKeyCommands({
    ['ctrl+m']: {
      name: 'ctrl+m',
      description: 'a command that will open the advanced button',
      execute: () => {
        setOpen((prev) => !prev)
        toast.success('Advanced button')
      },
    },
  })

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
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
        <TooltipContent className="flex items-center gap-2" side={'right'}>
          <CommandShortcut variant="secondary">
            <Command />
            +m
          </CommandShortcut>
          <p>Advanced button</p>
        </TooltipContent>
      </Tooltip>
    </>
  )
}

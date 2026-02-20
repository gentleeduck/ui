'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { CommandShortcut } from '@gentleduck/registry-ui-duckui/command'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import { ArrowBigUpDash, Command } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function ButtonDemo() {
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <TooltipProvider>
      <Tooltip>
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
        <TooltipContent forceMount side="top" className="flex items-center gap-2">
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
    </TooltipProvider>
  )
}

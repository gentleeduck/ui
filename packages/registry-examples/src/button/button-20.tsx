'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { CommandShortcut } from '@gentleduck/registry-ui/command'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'
import { ArrowBigUpDash, Command } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function Demo() {
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <div dir="rtl">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-expanded={open}
              aria-label={'زر متقدم'}
              icon={<ArrowBigUpDash />}
              isCollapsed={open}
              loading={false}
              onClick={() => setOpen((prev) => !prev)}
              size="default">
              زر
            </Button>
          </TooltipTrigger>
          <TooltipContent forceMount side="top" className="flex items-center gap-2">
            <CommandShortcut
              keys="ctrl+m"
              onKeysPressed={() => {
                setOpen((prev) => !prev)
                toast.success('زر متقدم')
              }}
              variant="secondary">
              <Command />
              +m
            </CommandShortcut>
            <p>زر متقدم</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

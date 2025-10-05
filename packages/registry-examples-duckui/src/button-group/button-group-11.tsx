'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { ButtonGroup } from '@gentleduck/registry-ui-duckui/button-group'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import { Textarea } from '@gentleduck/registry-ui-duckui/textarea'
import { BotIcon, ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

export function ButtonGroupPopover() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <BotIcon /> Copilot
      </Button>
      <Popover placement="bottom-end">
        <PopoverTrigger asChild>
          <Button aria-label="Open Popover" size="icon" variant="outline">
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-xl p-0 text-sm">
          <div className="px-4 py-3">
            <div className="font-medium text-sm">Agent Tasks</div>
          </div>
          <Separator />
          <div className="p-4 text-sm *:[p:not(:last-child)]:mb-2">
            <Textarea className="mb-4 resize-none" placeholder="Describe your task in natural language." />
            <p className="font-medium">Start a new task with Copilot</p>
            <p className="text-muted-foreground">
              Describe your task in natural language. Copilot will work in the background and open a pull request for
              your review.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  )
}

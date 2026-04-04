'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { ButtonGroup } from '@gentleduck/registry-ui/button-group'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { Separator } from '@gentleduck/registry-ui/separator'
import { Textarea } from '@gentleduck/registry-ui/textarea'
import { BotIcon, ChevronDownIcon } from 'lucide-react'

export default function Demo() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <BotIcon aria-hidden="true" /> Copilot
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button aria-label="Open Popover" size="icon" variant="outline">
            <ChevronDownIcon aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" className="rounded-xl p-0 text-sm">
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

'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui-duckui/dropdown-menu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@gentleduck/registry-ui-duckui/input-group'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import { IconCheck, IconInfoCircle, IconPaperclip } from '@tabler/icons-react'
import { ArrowUpIcon, FilterIcon } from 'lucide-react'

export default function InputGroupDemo() {
  return (
    <TooltipProvider>
      <div className="grid w-full max-w-sm gap-6">
        <InputGroup>
          <InputGroupInput placeholder="Filter logs..." />
          <InputGroupAddon>
            <FilterIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">24 entries</InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput className="!pl-1" placeholder="github.com/acme/repo" />
          <InputGroupAddon>
            <InputGroupText>git clone </InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton className="rounded-full" size="icon-xs">
                  <IconInfoCircle />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Repository will be cloned to ~/projects.</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupTextarea placeholder="Describe your issue..." />
          <InputGroupAddon align="block-end">
            <InputGroupButton className="rounded-full" size="icon-xs" variant="outline">
              <IconPaperclip />
            </InputGroupButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton variant="ghost">Low</InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="[--radius:0.95rem]" side="top">
                <DropdownMenuItem>Low</DropdownMenuItem>
                <DropdownMenuItem>Medium</DropdownMenuItem>
                <DropdownMenuItem>High</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupText className="ml-auto">3 attachments</InputGroupText>
            <Separator className="!h-4" orientation="vertical" />
            <InputGroupButton className="rounded-full" disabled size="icon-xs" variant="default">
              <ArrowUpIcon />
              <span className="sr-only">Submit</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="team-alpha" />
          <InputGroupAddon align="inline-end">
            <div className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <IconCheck className="size-3" />
            </div>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </TooltipProvider>
  )
}

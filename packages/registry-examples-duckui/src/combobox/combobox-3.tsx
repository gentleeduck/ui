'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui-duckui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'
import * as React from 'react'

type Status = {
  value: string
  label: string
}
const statuses: Status[] = [
  {
    label: 'Backlog',
    value: 'backlog',
  },
  {
    label: 'Todo',
    value: 'todo',
  },
  {
    label: 'In Progress',
    value: 'in progress',
  },
  {
    label: 'Done',
    value: 'done',
  },
  {
    label: 'Canceled',
    value: 'canceled',
  },
]
export default function ComboboxPopover() {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null)
  return (
    <div className="flex items-center space-x-4">
      <p className="text-muted-foreground text-sm">Status</p>
      <Popover onOpenChange={setOpen} open={open} placement="bottom-end">
        <PopoverTrigger asChild>
          <Button className="w-[150px] justify-start" variant="outline">
            {selectedStatus ? selectedStatus.label : '+ Set status'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    onSelect={(value) => {
                      setSelectedStatus(statuses.find((priority) => priority.value === value) || null)
                      setOpen(false)
                    }}
                    value={status.value}>
                    {status.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

'use client'

import { useMediaQuery } from '@gentleduck/hooks/use-media-query'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui-duckui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@gentleduck/registry-ui-duckui/drawer'
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

export default function ComboBoxResponsive() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null)

  if (isDesktop) {
    return (
      <Popover onOpenChange={setOpen} open={open} placement="bottom-start">
        <PopoverTrigger asChild>
          <Button className="w-[150px] justify-start" variant="outline">
            {selectedStatus ? selectedStatus.label : '+ Set status'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button className="w-[150px] justify-start" variant="outline">
          {selectedStatus ? selectedStatus.label : '+ Set status'}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void
  setSelectedStatus: (status: Status | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
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
  )
}

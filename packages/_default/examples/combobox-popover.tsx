'use client'

import { ArrowUpCircle, CheckCircle2, Circle, HelpCircle, LucideIcon, XCircle } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/registry/default/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/default/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover'

type Status = {
  value: string
  label: string
  icon: LucideIcon
}

const statuses: Status[] = [
  {
    icon: HelpCircle,
    label: 'Backlog',
    value: 'backlog',
  },
  {
    icon: Circle,
    label: 'Todo',
    value: 'todo',
  },
  {
    icon: ArrowUpCircle,
    label: 'In Progress',
    value: 'in progress',
  },
  {
    icon: CheckCircle2,
    label: 'Done',
    value: 'done',
  },
  {
    icon: XCircle,
    label: 'Canceled',
    value: 'canceled',
  },
]

export default function ComboboxPopover() {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null)

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Status</p>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button className="w-[150px] justify-start" size="sm" variant="outline">
            {selectedStatus ? (
              <>
                <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                {selectedStatus.label}
              </>
            ) : (
              <>+ Set status</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0" side="right">
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
                    <status.icon
                      className={cn(
                        'mr-2 h-4 w-4',
                        status.value === selectedStatus?.value ? 'opacity-100' : 'opacity-40',
                      )}
                    />
                    <span>{status.label}</span>
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

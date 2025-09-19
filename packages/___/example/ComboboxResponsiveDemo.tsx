'use client'

import * as React from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'

import {
  Button,
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandListGroup,
  CommandListGroupDataType,
  Drawer,
  DrawerContent,
  DrawerTrigger,
  OnSelectType,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TooltipProvider,
} from '@/registry/default/ui/'

const data: CommandListGroupDataType[] = [
  {
    element: { children: 'Ubuntu' },
    label: 'Ubuntu',
  },
  {
    element: { children: 'Debian' },
    label: 'Debian',
  },
  {
    element: { children: 'Fedora' },
    label: 'Fedora',
  },
  {
    element: { children: 'Arch Linux' },
    label: 'Arch Linux',
  },
]

export default function ComboBoxResponsive() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null)

  if (isDesktop) {
    return (
      <TooltipProvider>
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger asChild>
            <Button className="w-[150px] justify-start" variant="outline">
              {selectedStatus ? <>{selectedStatus}</> : <>+ Set status</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[200px] p-0">
            <StatusList setSelectedStatus={setSelectedStatus} />
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Drawer onOpenChange={setOpen} open={open}>
        <DrawerTrigger asChild>
          <Button className="w-[150px] justify-start" variant="outline">
            {selectedStatus ? <>{selectedStatus}</> : <>+ Set Distro</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <StatusList setSelectedStatus={setSelectedStatus} />
          </div>
        </DrawerContent>
      </Drawer>
    </TooltipProvider>
  )
}

function StatusList({ setSelectedStatus }: { setSelectedStatus: (status: string | null) => void }) {
  return (
    <Command>
      <CommandInput placeholder="Filter distros..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandListGroup
          className="h-[166px]"
          data={data}
          group={[data.length]}
          groupheading={['Suggestions', 'Settings']}
          onSelect={{
            key: (value) => setSelectedStatus(value as string),
          }}
          selected={['']}
        />
      </CommandList>
    </Command>
  )
}

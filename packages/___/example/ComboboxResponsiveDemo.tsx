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
    label: 'Ubuntu',
    element: { children: 'Ubuntu' },
  },
  {
    label: 'Debian',
    element: { children: 'Debian' },
  },
  {
    label: 'Fedora',
    element: { children: 'Fedora' },
  },
  {
    label: 'Arch Linux',
    element: { children: 'Arch Linux' },
  },
]

export default function ComboBoxResponsive() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null)

  if (isDesktop) {
    return (
      <TooltipProvider>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start">
              {selectedStatus ? <>{selectedStatus}</> : <>+ Set status</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <StatusList setSelectedStatus={setSelectedStatus} />
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
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
          data={data}
          group={[data.length]}
          className="h-[166px]"
          groupheading={['Suggestions', 'Settings']}
          selected={['']}
          onSelect={{
            key: (value) => setSelectedStatus(value as string),
          }}
        />
      </CommandList>
    </Command>
  )
}

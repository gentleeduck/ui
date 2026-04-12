'use client'

import { cn } from '@gentleduck/libs/cn'
import { MotionButton } from '@gentleduck/registry-ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import { MotionPopover, MotionPopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

const frameworks = [
  { label: 'Next.js', value: 'next.js' },
  { label: 'SvelteKit', value: 'sveltekit' },
  { label: 'Nuxt.js', value: 'nuxt.js' },
  { label: 'Remix', value: 'remix' },
  { label: 'Astro', value: 'astro' },
]

export default function Demo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <MotionPopover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <MotionButton aria-expanded={open} className="w-57.5 justify-between" role="combobox" variant="outline">
          {value ? frameworks.find((f) => f.value === value)?.label : 'Select framework...'}
          <ChevronsUpDown className="opacity-50" />
        </MotionButton>
      </PopoverTrigger>
      <MotionPopoverContent className="w-57.5 min-w-auto p-0">
        <Command>
          <CommandInput className="h-9" placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework, _i) => (
                <CommandItem
                  key={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                  value={framework.value}>
                  {framework.label}
                  <Check className={cn('ml-auto', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </MotionPopoverContent>
    </MotionPopover>
  )
}

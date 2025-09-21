'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
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

const frameworks = [
  {
    label: 'Next.js',
    value: 'next.js',
  },
  {
    label: 'SvelteKit',
    value: 'sveltekit',
  },
  {
    label: 'Nuxt.js',
    value: 'nuxt.js',
  },
  {
    label: 'Remix',
    value: 'remix',
  },
  {
    label: 'Astro',
    value: 'astro',
  },
]

export default function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} className="w-[200px] justify-between" role="combobox" variant="outline">
          {value ? frameworks.find((framework) => framework.value === value)?.label : 'Select framework...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
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
      </PopoverContent>
    </Popover>
  )
}

import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui-duckui/command'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import React from 'react'

export default function PopoverDemo() {
  const [open, setOpen] = React.useState(true)
  return <ComboboxDemo />
}

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
]
export function ComboboxDemo() {
  const [open, setOpen] = React.useState(true)
  const [value, setValue] = React.useState('')
  // console.log(open)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-[200px]" onClick={() => setOpen(!open)}>
        {value ? frameworks.find((framework) => framework.value === value)?.label : 'Select framework...'}
        <ChevronsUpDown className="opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-8 [&_svg]:size-[18px] px-2" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup heading="Frameworks">
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}>
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

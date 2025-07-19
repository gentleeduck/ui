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
import { Popover, PopoverContent, PopoverTrigger } from './ggpop'
import { Check, ChevronsUpDown } from 'lucide-react'
import React from 'react'
import { computePosition, offset } from '@gentleduck/duck-float'
import { Provider } from '@gentleduck/state/primitive'

export default function PopoverDemo() {
  // const [open, setOpen] = React.useState(false)
  return (
    <div className="h-[2000px] mt-[400px] flex gap-[400px]">
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent placement="top" className="w-80 border-transparent">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label
                  htmlFor="width"
                  onClick={() => {
                    // setOpen(false)
                  }}>
                  Width
                </Label>
                <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">Max. width</Label>
                <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">Height</Label>
                <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxHeight">Max. height</Label>
                <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
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
      <PopoverTrigger className="w-[200px]">
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

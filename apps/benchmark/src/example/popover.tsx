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
  const [open, setOpen] = React.useState(false)

  return (
    <div className="h-[2000px] mt-[400px] flex gap-[400px]">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent className="w-80">
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
                <Input className="col-span-2 h-8" defaultValue="100%" id="width" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">Max. width</Label>
                <Input className="col-span-2 h-8" defaultValue="300px" id="maxWidth" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">Height</Label>
                <Input className="col-span-2 h-8" defaultValue="25px" id="height" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxHeight">Max. height</Label>
                <Input className="col-span-2 h-8" defaultValue="none" id="maxHeight" />
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
export function ComboboxDemo() {
  const [open, setOpen] = React.useState(true)
  const [value, setValue] = React.useState('')
  // console.log(open)
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger className="w-[200px]">
        {value ? frameworks.find((framework) => framework.value === value)?.label : 'Select framework...'}
        <ChevronsUpDown className="opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput className="h-8 [&_svg]:size-[18px] px-2" placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup heading="Frameworks">
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

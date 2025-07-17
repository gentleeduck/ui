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
import { computePosition, offset } from '@gentleduck/duck-float/core'
import { platform } from '@gentleduck/duck-float/dom'

export default function PopoverDemo() {
  const referenceEl = React.useRef<HTMLDivElement | null>(null)
  const floatingEl = React.useRef<HTMLDivElement | null>(null)

  React.useLayoutEffect(() => {
    if (!open || !referenceEl.current || !floatingEl.current) return

    computePosition(referenceEl.current, floatingEl.current, {
      platform: platform,
      placement: 'left',
      middleware: [offset(10)],
    }).then((result) => {
      console.log('Position result:', result)
      Object.assign(floatingEl.current!.style, {
        left: `${result.x}px`,
        top: `${result.y}px`,
        position: 'absolute',
      })
    })
  }, [])

  return (
    <div className="h-[2000px] mt-[400px] relative">
      <div
        className="mx-auto grid h-32 w-32 place-items-center border-2 border-dashed border-gray-1000"
        ref={referenceEl}>
        <p>right</p>
      </div>

      <div ref={floatingEl} className="z-10 grid place-items-center bg-rose-500 text-base font-semibold text-gray-50">
        <div className="px-2 py-2">Floating</div>
      </div>
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

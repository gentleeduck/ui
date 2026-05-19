'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

const options = [
  { label: 'صفحة هبوط', value: 'landing' },
  { label: 'لوحة تحكم', value: 'dashboard' },
  { label: 'متجر إلكتروني', value: 'ecommerce' },
  { label: 'مدونة', value: 'blog' },
  { label: 'معرض أعمال', value: 'portfolio' },
  { label: 'نظام حجوزات', value: 'booking' },
]

export default function Demo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  const selectedLabel = value ? options.find((x) => x.value === value)?.label : undefined

  return (
    <Popover dir="rtl" onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} className="w-57.5 justify-between text-start" role="combobox" variant="outline">
          {selectedLabel ?? 'اختر نوع المشروع...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent dir="rtl" className="w-57.5 min-w-auto p-0">
        <Command dir="rtl">
          <CommandInput className="h-9 text-start" placeholder="ابحث عن نوع المشروع..." />

          <CommandList>
            <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>

            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  className="text-start"
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}>
                  {item.label}

                  {/* logical margin so it works for RTL/LTR */}
                  <Check className={cn('ms-auto', value === item.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import { Label } from '@gentleduck/registry-ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

export default function Demo() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const locale = 'ar-SA-u-nu-arab'

  return (
    <div className="flex flex-col gap-3" dir="rtl">
      <Label className="px-1" htmlFor="date">
        تاريخ الميلاد
      </Label>
      <Popover dir="rtl" onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button className="w-48 justify-between font-normal" id="date" variant="outline">
            {date ? date.toLocaleDateString(locale) : 'اختر التاريخ'}
            <ChevronDownIcon aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-auto p-0">
          <Calendar
            showDropdowns={false}
            dir="rtl"
            locale="ar-SA"
            mode="single"
            onSelect={(d) => {
              if (d instanceof Date) setDate(d)
              requestAnimationFrame(() => setOpen(false))
            }}
            selected={date}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

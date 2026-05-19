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

  return (
    <div className="flex flex-col gap-3">
      <Label className="px-1" htmlFor="date">
        Date of birth
      </Label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button className="w-48 justify-between font-normal" id="date" variant="outline">
            {date ? date.toLocaleDateString() : 'Select date'}
            <ChevronDownIcon aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-auto p-0">
          <Calendar
            showDropdowns={false}
            mode="single"
            onSelect={(date) => {
              setDate(date ?? undefined)
              requestAnimationFrame(() => setOpen(false))
            }}
            selected={date}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

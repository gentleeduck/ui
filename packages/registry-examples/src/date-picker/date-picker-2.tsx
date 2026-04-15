'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import { Label } from '@gentleduck/registry-ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { ChevronDownIcon, XIcon } from 'lucide-react'
import * as React from 'react'

export default function Demo() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex flex-col gap-3">
      <Label className="px-1" htmlFor="date-preselected">
        Event date
      </Label>
      <div className="flex items-center gap-2">
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger asChild>
            <Button className="w-48 justify-between font-normal" id="date-preselected" variant="outline">
              {date ? date.toLocaleDateString() : 'Select date'}
              <ChevronDownIcon aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end" className="w-auto p-0">
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
        {date && (
          <Button variant="ghost" size="icon" aria-label="Clear date" onClick={() => setDate(undefined)}>
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

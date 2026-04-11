'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import { MotionCalendar } from '@gentleduck/registry-ui/calendar'
import { Label } from '@gentleduck/registry-ui/label'
import { MotionPopover, MotionPopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

export default function Demo() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex flex-col gap-3">
      <Label className="px-1" htmlFor="motion-date">
        Pick a date
      </Label>
      <MotionPopover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <MotionButton className="w-48 justify-between font-normal" id="motion-date" variant="outline">
            {date ? date.toLocaleDateString() : 'Select date'}
            <ChevronDownIcon aria-hidden="true" />
          </MotionButton>
        </PopoverTrigger>
        <MotionPopoverContent side="top" align="start" className="w-auto p-0">
          <MotionCalendar
            mode="single"
            onSelect={(d) => {
              setDate(d)
              requestAnimationFrame(() => setOpen(false))
            }}
            selected={date}
          />
        </MotionPopoverContent>
      </MotionPopover>
    </div>
  )
}

'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Calendar } from '@gentleduck/registry-ui-duckui/calendar'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

export default function CalendarDemo() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Date of birth
      </Label>
      <Popover open={open} onOpenChange={setOpen} placement="top-start">
        <PopoverTrigger asChild>
          <Button variant="outline" id="date" className="w-48 justify-between font-normal">
            {date ? date.toLocaleDateString() : 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

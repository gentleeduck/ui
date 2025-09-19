'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Calendar } from '@gentleduck/registry-ui-duckui/calendar'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

export default function CalendarDemo() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label className="px-1" htmlFor="date-picker">
          Date
        </Label>
        <Popover onOpenChange={setOpen} open={open} placement="top-start">
          <PopoverTrigger asChild>
            <Button className="w-34 justify-between font-normal" id="date-picker" variant="outline">
              {date ? date.toLocaleDateString() : 'Select date'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0">
            <Calendar
              captionLayout="dropdown"
              mode="single"
              onSelect={(date) => {
                setDate(date)
                setOpen(false)
              }}
              selected={date}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label className="px-1" htmlFor="time-picker">
          Time
        </Label>
        <Input
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          defaultValue="10:30:00"
          id="time-picker"
          step="1"
          type="time"
        />
      </div>
    </div>
  )
}

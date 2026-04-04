'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

export default function Demo() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | null>(null)

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label className="px-1" htmlFor="date-picker">
          Date
        </Label>
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger asChild>
            <Button className="w-34 justify-between font-normal" id="date-picker" variant="outline">
              {date ? date.toLocaleDateString() : 'Select date'}
              <ChevronDownIcon aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-auto p-0">
            <Calendar
              showDropdowns={false}
              mode="single"
              onSelect={(date) => {
                setDate(date)
                requestAnimationFrame(() => setOpen(false))
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

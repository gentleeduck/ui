'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Calendar } from '@gentleduck/registry-ui-duckui/calendar'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'

function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !Number.isNaN(date.getTime())
}

export default function CalendarDemo() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(new Date('2025-06-01'))
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [value, setValue] = React.useState(formatDate(date))

  return (
    <div className="flex flex-col gap-3">
      <Label className="px-1" htmlFor="date">
        Subscription Date
      </Label>
      <div className="relative flex gap-2">
        <Input
          className="bg-background pr-10"
          id="date"
          onChange={(e) => {
            const date = new Date(e.currentTarget.value)
            setValue(e.currentTarget.value)
            if (isValidDate(date)) {
              setDate(date)
              setMonth(date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
          }}
          placeholder="June 01, 2025"
          value={value}
        />
        <Popover onOpenChange={setOpen} open={open} placement="top" sideOffset={10}>
          <PopoverTrigger asChild>
            <Button
              className="-translate-y-1/2 absolute top-1/2 right-1 h-fit p-1 px-1.5 [&_svg]:w-4"
              id="date-picker"
              variant="ghost">
              <CalendarIcon />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0">
            <Calendar
              captionLayout="dropdown"
              mode="single"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date)
                setValue(formatDate(date))
                setOpen(false)
              }}
              selected={date}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

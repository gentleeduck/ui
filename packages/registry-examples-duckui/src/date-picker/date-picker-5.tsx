'use client'

import { parseDate } from '@gentleduck/duck-libs/parse-date'
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

export default function CalendarDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('In 2 days')
  const [date, setDate] = React.useState<Date | undefined>(parseDate(value) || undefined)
  const [month, setMonth] = React.useState<Date | undefined>(date)

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Schedule Date
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder="Tomorrow or next week"
          className="bg-background pr-10"
          onChange={(e) => {
            setValue(e.currentTarget.value)
            const date = parseDate(e.currentTarget.value)
            if (date) {
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
        />
        <Popover open={open} onOpenChange={setOpen} placement="top-end">
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="-translate-y-1/2 absolute top-1/2 right-1 h-fit p-1 px-1.5 [&_svg]:w-4">
              <CalendarIcon />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date)
                setValue(formatDate(date))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="px-1 text-muted-foreground text-sm">
        Your post will be published on <span className="font-medium">{formatDate(date)}</span>.
      </div>
    </div>
  )
}

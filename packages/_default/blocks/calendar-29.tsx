'use client'

import { parseDate } from 'chrono-node'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/registry/default/ui/button'
import { Calendar } from '@/registry/default/ui/calendar'
import { Input } from '@/registry/default/ui/input'
import { Label } from '@/registry/default/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover'

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

export default function Calendar29() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('In 2 days')
  const [date, setDate] = React.useState<Date | undefined>(parseDate(value) || undefined)
  const [month, setMonth] = React.useState<Date | undefined>(date)

  return (
    <div className="flex flex-col gap-3">
      <Label className="px-1" htmlFor="date">
        Schedule Date
      </Label>
      <div className="relative flex gap-2">
        <Input
          className="bg-background pr-10"
          id="date"
          onChange={(e) => {
            setValue(e.target.value)
            const date = parseDate(e.target.value)
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
          placeholder="Tomorrow or next week"
          value={value}
        />
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger asChild>
            <Button className="absolute top-1/2 right-2 size-6 -translate-y-1/2" id="date-picker" variant="ghost">
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto overflow-hidden p-0">
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
      <div className="text-muted-foreground px-1 text-sm">
        Your post will be published on <span className="font-medium">{formatDate(date)}</span>.
      </div>
    </div>
  )
}

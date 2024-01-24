'use client'
import { cn } from '@/lib'
import { Calendar, Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui'
import Upload1Demo from '@/registry/registry-examples-components/upload/upload-1'
import { Button } from '@/registry/registry-ui-components/button'
import { trpc } from '@/trpc/react'
import { addDays, format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { DateRange } from 'react-day-picker'
// import IndexPage from '@/test/test'

// async
export default function index() {
  // <Upload1Demo />
  return (
    <div className="container xl:border-x  max-w-screen-2xl border-b h-screen pt-8">
      <div className="w-fit">
        <DatePickerWithRange />
      </div>
    </div>
  )
}

export function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<Date[] | undefined>([new Date(2022, 0, 20), new Date(2022, 0, 25)])

  return (
    <div className={cn('grid gap-2 border', className)}>
      <Calendar
        // initialFocus
        mode="multiple"
        // defaultMonth={da}
        selected={date}
        onSelect={setDate}
        numberOfMonths={1}
      />
    </div>
  )
}

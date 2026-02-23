'use client'

import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'
import { type DateRange } from 'react-day-picker'

import { Button } from '@/registry/default/ui/button'
import { Calendar } from '@/registry/default/ui/calendar'
import { Label } from '@/registry/default/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover'

export default function Calendar23() {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined)

  return (
    <div className="flex flex-col gap-3">
      <Label className="px-1" htmlFor="dates">
        Select your stay
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-56 justify-between font-normal" id="dates" variant="outline">
            {range?.from && range?.to
              ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
              : 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto overflow-hidden p-0">
          <Calendar
            captionLayout="dropdown"
            mode="range"
            onSelect={(range) => {
              setRange(range)
            }}
            selected={range}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

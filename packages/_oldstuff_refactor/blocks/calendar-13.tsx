'use client'

import * as React from 'react'

import { Calendar } from '@/registry/default/ui/calendar'
import { Label } from '@/registry/default/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/default/ui/select'

export default function Calendar13() {
  const [dropdown, setDropdown] = React.useState<React.ComponentProps<typeof Calendar>['captionLayout']>('dropdown')
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12))

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        captionLayout={dropdown}
        className="rounded-lg border shadow-sm"
        defaultMonth={date}
        mode="single"
        onSelect={setDate}
        selected={date}
      />
      <div className="flex flex-col gap-3">
        <Label className="px-1" htmlFor="dropdown">
          Dropdown
        </Label>
        <Select
          onValueChange={(value) => setDropdown(value as React.ComponentProps<typeof Calendar>['captionLayout'])}
          value={dropdown}>
          <SelectTrigger className="bg-background w-full" id="dropdown">
            <SelectValue placeholder="Dropdown" />
          </SelectTrigger>
          <SelectContent align="center">
            <SelectItem value="dropdown">Month and Year</SelectItem>
            <SelectItem value="dropdown-months">Month Only</SelectItem>
            <SelectItem value="dropdown-years">Year Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

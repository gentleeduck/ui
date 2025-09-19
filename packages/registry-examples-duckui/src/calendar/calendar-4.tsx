'use client'

import { Calendar } from '@gentleduck/registry-ui-duckui/calendar'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui-duckui/select'
import * as React from 'react'

export default function CalendarDemo() {
  const [dropdown, setDropdown] = React.useState<React.ComponentProps<typeof Calendar>['captionLayout']>()
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
          placement="top-start"
          value={dropdown}>
          <SelectTrigger className="w-full bg-background" id="dropdown">
            <SelectValue placeholder="Month and Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dropdown">Month and Year</SelectItem>
            <SelectItem value="dropdown-months">Month Only</SelectItem>
            <SelectItem value="dropdown-years">Year Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

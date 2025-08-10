'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Calendar } from '@gentleduck/registry-ui-duckui/calendar'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui-duckui/select'
import * as React from 'react'

export default function CalendarDemo() {
  const [dropdown, setDropdown] = React.useState<React.ComponentProps<typeof Calendar>['captionLayout']>('dropdown')
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12))

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        captionLayout={dropdown}
        className="rounded-lg border shadow-sm"
      />
      <div className="flex flex-col gap-3">
        <Label htmlFor="dropdown" className="px-1">
          Dropdown
        </Label>
        <Select
          value={dropdown}
          onValueChange={(value) => setDropdown(value as React.ComponentProps<typeof Calendar>['captionLayout'])}
          placement="top-start">
          <SelectTrigger asChild>
            <Button id="dropdown" size="sm" className="w-full bg-background">
              <SelectValue placeholder="Dropdown" />
            </Button>
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

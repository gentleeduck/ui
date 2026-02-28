'use client'

import { Clock2Icon } from 'lucide-react'
import * as React from 'react'

import { Calendar } from '@/registry/default/ui/calendar'
import { Card, CardContent, CardFooter } from '@/registry/default/ui/card'
import { Input } from '@/registry/default/ui/input'
import { Label } from '@/registry/default/ui/label'

export default function Calendar16() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12))

  return (
    <Card className="w-fit py-4">
      <CardContent className="px-4">
        <Calendar className="bg-transparent p-0" mode="single" onSelect={setDate} selected={date} />
      </CardContent>
      <CardFooter className="flex flex-col gap-6 border-t px-4 pb-0 pt-4">
        <div className="flex w-full flex-col gap-3">
          <Label htmlFor="time-from">Start Time</Label>
          <div className="relative flex w-full items-center gap-2">
            <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
            <Input
              className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              defaultValue="10:30:00"
              id="time-from"
              step="1"
              type="time"
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <Label htmlFor="time-to">End Time</Label>
          <div className="relative flex w-full items-center gap-2">
            <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
            <Input
              className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              defaultValue="12:30:00"
              id="time-to"
              step="1"
              type="time"
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

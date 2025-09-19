"use client"

import * as React from "react"

import { Calendar } from "@/registry/default/ui/calendar"
import { Card, CardContent, CardFooter } from "@/registry/default/ui/card"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"

export default function Calendar17() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <Card className="w-fit py-4">
      <CardContent className="px-4">
        <Calendar
          className="bg-transparent p-0 [--cell-size:2.8rem]"
          mode="single"
          onSelect={setDate}
          selected={date}
        />
      </CardContent>
      <CardFooter className="*:[div]:w-full flex gap-2 border-t px-4 pb-0 pt-4">
        <div className="flex-1">
          <Label className="sr-only" htmlFor="time-from">
            Start Time
          </Label>
          <Input
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            defaultValue="10:30:00"
            id="time-from"
            step="1"
            type="time"
          />
        </div>
        <span>-</span>
        <div className="flex-1">
          <Label className="sr-only" htmlFor="time-to">
            End Time
          </Label>
          <Input
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            defaultValue="12:30:00"
            id="time-to"
            step="1"
            type="time"
          />
        </div>
      </CardFooter>
    </Card>
  )
}

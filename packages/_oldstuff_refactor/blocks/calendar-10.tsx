'use client'

import * as React from 'react'

import { Button } from '@/registry/default/ui/button'
import { Calendar } from '@/registry/default/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/default/ui/card'

export default function Calendar10() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12))
  const [month, setMonth] = React.useState<Date | undefined>(new Date())

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Appointment</CardTitle>
        <CardDescription>Find a date</CardDescription>
        <Button
          className="absolute right-4 top-4"
          onClick={() => {
            setMonth(new Date())
            setDate(new Date())
          }}
          size="sm"
          variant="outline">
          Today
        </Button>
      </CardHeader>
      <CardContent>
        <Calendar
          className="bg-transparent p-0"
          mode="single"
          month={month}
          onMonthChange={setMonth}
          onSelect={setDate}
          selected={date}
        />
      </CardContent>
    </Card>
  )
}

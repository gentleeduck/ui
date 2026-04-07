'use client'

import { MotionCalendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

export default function Demo() {
  const [date, setDate] = React.useState<Date | null>(new Date())

  return <MotionCalendar className="rounded-md border shadow-sm" mode="single" onSelect={setDate} selected={date} />
}

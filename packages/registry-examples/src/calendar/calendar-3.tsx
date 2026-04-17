'use client'

import type { Selection } from '@gentleduck/calendar'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

export default function Demo() {
  const [date, setDate] = React.useState<Selection.DateRange<Date> | null>(null)

  return <Calendar className="rounded-md border shadow-sm" mode="range" selected={date} onSelect={setDate} />
}

'use client'

import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

export default function Demo() {
  const [dates, setDates] = React.useState<Date[]>([])

  return (
    <div className="space-y-4">
      <Calendar className="rounded-md border shadow-sm" mode="multi" selected={dates} onSelect={setDates} />
      <p className="text-muted-foreground text-sm">
        {dates.length} date{dates.length !== 1 ? 's' : ''} selected
      </p>
    </div>
  )
}

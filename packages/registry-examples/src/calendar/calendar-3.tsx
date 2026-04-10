'use client'

import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

export default function Demo() {
  const [date, setDate] = React.useState<{ from: Date; to: Date | null } | undefined>()

  return <Calendar className="rounded-md border shadow-sm" mode="range" selected={date} onSelect={setDate} />
}

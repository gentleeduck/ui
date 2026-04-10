'use client'

import { DIRECTION_DICTIONARY, DirectionProvider, useDirection } from '@gentleduck/registry-ui/direction'

function DirectionStatus() {
  const dir = useDirection()
  return (
    <div className="rounded-md border bg-card px-4 py-2 text-card-foreground text-sm">
      Resolved direction: <span className="font-mono">{dir}</span>
    </div>
  )
}

export default function Demo() {
  return (
    <DirectionProvider dir={DIRECTION_DICTIONARY.rtl}>
      <DirectionStatus />
    </DirectionProvider>
  )
}

import React from 'react'

let globalIdCounter = 0

/** Stable unique ID for ARIA/label associations when `React.useId` is unavailable or a custom prefix is needed. */
export function useStableId(prefix = 'id'): string {
  const idRef = React.useRef<string>(null)
  if (!idRef.current) {
    idRef.current = `${prefix}-${++globalIdCounter}`
  }
  return idRef.current
}

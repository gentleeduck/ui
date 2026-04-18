import React from 'react'

/** @internal */
let globalIdCounter = 0

/**
 * Generate a stable, unique ID that persists across re-renders.
 *
 * Useful for associating labels with inputs or ARIA attributes
 * when `React.useId` is not available or a custom prefix is needed.
 */
export function useStableId(prefix = 'id'): string {
  const idRef = React.useRef<string>(null)
  if (!idRef.current) {
    idRef.current = `${prefix}-${++globalIdCounter}`
  }
  return idRef.current
}

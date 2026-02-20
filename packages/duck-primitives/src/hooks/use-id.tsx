import * as React from 'react'
import { useLayoutEffect } from './use-layout-effect'

// Spaces with .trim().toString() prevent bundlers from tree-shaking useId out of React.
const useReactId = (React as any)[' useId '.trim().toString()] || (() => undefined)
let count = 0

/**
 * Generates a stable unique ID. Uses React.useId when available (React 18+),
 * otherwise falls back to an incrementing counter for older versions.
 * Accepts an optional deterministic ID that takes priority when provided.
 */
function useId(deterministicId?: string): string {
  const [id, setId] = React.useState<string | undefined>(useReactId())
  useLayoutEffect(() => {
    if (!deterministicId) setId((reactId) => reactId ?? String(count++))
  }, [deterministicId])
  return deterministicId || (id ? `gentleduck-${id}` : '')
}

export { useId }

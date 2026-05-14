import * as React from 'react'
import { useLayoutEffect } from './use-layout-effect'

// `.trim().toString()` indirection prevents bundlers from tree-shaking useId out of React
const useReactId =
  ((React as Record<string, unknown>)[' useId '.trim().toString()] as () => string | undefined) || (() => undefined)
let count = 0

/** Stable id; React 18 useId when available, otherwise incrementing counter. `deterministicId` wins. */
function useId(deterministicId?: string): string {
  const [id, setId] = React.useState<string | undefined>(useReactId())
  useLayoutEffect(() => {
    if (!deterministicId) setId((reactId) => reactId ?? String(count++))
  }, [deterministicId])
  return deterministicId || (id ? `gentleduck-${id}` : '')
}

export { useId }

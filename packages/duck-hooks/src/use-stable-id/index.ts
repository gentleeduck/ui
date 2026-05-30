import * as React from 'react'

/**
 * Stable, SSR-safe unique ID for ARIA/label associations. Delegates to
 * React 19's built-in `useId`; an optional `prefix` is prepended so the
 * full id has a human-readable namespace.
 *
 * Returns e.g. `"id-:r1:"` (default prefix) or `"label-:r1:"`.
 */
export function useStableId(prefix: string = 'id'): string {
  const id = React.useId()
  return `${prefix}-${id}`
}

import * as React from 'react'
import type { IComposeRefs } from './use-composed-refs.types'

export type { IComposeRefs } from './use-composed-refs.types'

/**
 * Assign `value` to a single ref, handling both callback and object refs.
 * @internal
 */
function setRef<T>(ref: IComposeRefs.PossibleRef<T>, value: T): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null && ref !== undefined) {
    ;(ref as React.RefObject<T>).current = value
  }
}

/**
 * Compose multiple refs into a single callback ref.
 *
 * Accepts callback refs and RefObject(s) and returns a stable
 * callback that forwards the node to every ref in the list.
 */
export function composeRefs<T>(...refs: IComposeRefs.PossibleRef<T>[]): (node: T) => void {
  return (node: T) =>
    refs.forEach((ref) => {
      setRef(ref, node)
    })
}

/**
 * A hook that composes multiple refs into a single memoised callback ref.
 *
 * Accepts callback refs and RefObject(s).
 */
export function useComposedRefs<T>(...refs: IComposeRefs.PossibleRef<T>[]): (node: T) => void {
  // biome-ignore lint/correctness/useExhaustiveDependencies: refs are spread as dependencies intentionally
  return React.useCallback(composeRefs(...refs), refs)
}

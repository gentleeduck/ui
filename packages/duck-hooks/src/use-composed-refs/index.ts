import * as React from 'react'
import type { IComposeRefs } from './use-composed-refs.types'

export type { IComposeRefs } from './use-composed-refs.types'

function setRef<T>(ref: IComposeRefs.PossibleRef<T>, value: T): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null && ref !== undefined) {
    ;(ref as React.RefObject<T>).current = value
  }
}

/** Compose multiple refs (callback or RefObject) into a single callback ref. */
export function composeRefs<T>(...refs: IComposeRefs.PossibleRef<T>[]): (node: T) => void {
  return (node: T) =>
    refs.forEach((ref) => {
      setRef(ref, node)
    })
}

/** Hook variant of {@link composeRefs}, memoised. */
export function useComposedRefs<T>(...refs: IComposeRefs.PossibleRef<T>[]): (node: T) => void {
  // biome-ignore lint/correctness/useExhaustiveDependencies: refs are spread as dependencies intentionally
  return React.useCallback(composeRefs(...refs), refs)
}

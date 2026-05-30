import * as React from 'react'
import type { IComposeRefs } from './use-composed-refs.types'

export type { IComposeRefs } from './use-composed-refs.types'

function setRef<T>(ref: IComposeRefs.PossibleRef<T>, value: T): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null && ref !== undefined && typeof ref === 'object') {
    // Narrowed by the typeof check: only RefObject / MutableRefObject have `.current`.
    ;(ref as React.MutableRefObject<T | null>).current = value
  }
}

/** Compose multiple refs (callback or RefObject) into a single callback ref. */
export function composeRefs<T>(...refs: IComposeRefs.PossibleRef<T>[]): (node: T) => void {
  return (node: T) =>
    refs.forEach((ref) => {
      setRef(ref, node)
    })
}

/** Hook variant of {@link composeRefs}, memoised on the spread refs array. */
export function useComposedRefs<T>(...refs: IComposeRefs.PossibleRef<T>[]): (node: T) => void {
  return React.useCallback(
    (node: T) => {
      refs.forEach((ref) => {
        setRef(ref, node)
      })
    },
    // biome-ignore lint/correctness/useExhaustiveDependencies: spread refs intentionally form the dep array — the callback must update when any ref identity changes
    refs,
  )
}

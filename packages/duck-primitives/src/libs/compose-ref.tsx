import * as React from 'react'

type PossibleRef<T> = React.Ref<T> | undefined

/**
 * Sets a single ref to a value. Handles both callback refs and RefObject(s).
 * Returns the cleanup function from callback refs (React 19+) if present.
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    return ref(value)
  } else if (ref !== null && ref !== undefined) {
    ref.current = value
  }
}

/**
 * Composes multiple refs into a single callback ref.
 * Supports React 19 cleanup functions: if any ref returns a cleanup,
 * the composed ref will return a combined cleanup.
 */
function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node) => {
    let hasCleanup = false
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node)
      if (!hasCleanup && typeof cleanup === 'function') {
        hasCleanup = true
      }
      return cleanup
    })

    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i]
          if (typeof cleanup === 'function') {
            cleanup()
          } else {
            setRef(refs[i], null)
          }
        }
      }
    }
  }
}

/**
 * Hook version of composeRefs. Memoizes the composed ref callback
 * so it remains stable across renders when the input refs do not change.
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  // biome-ignore lint/correctness/useExhaustiveDependencies: refs spread is intentionally used as deps — the composed callback must update when any ref changes
  return React.useCallback(composeRefs(...refs), refs)
}

export { composeRefs, useComposedRefs }

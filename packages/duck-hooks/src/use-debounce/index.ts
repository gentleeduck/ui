import * as React from 'react'

/** Non-hook debounce. Delays `callback` until `delay` ms after last call. */
export const debounce = <T extends (...args: never[]) => unknown>(
  callback: T,
  delay?: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

/** Debounced wrapper with stable identity, latest-callback/delay, unmount cancel. */
export function useDebounce<T extends (...args: never[]) => unknown>(
  callback: T,
  delay?: number,
): (...args: Parameters<T>) => void {
  const callbackRef = React.useRef(callback)
  const delayRef = React.useRef(delay)
  const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Always invoke the most recent callback/delay without changing identity.
  React.useEffect(() => {
    callbackRef.current = callback
    delayRef.current = delay
  }, [callback, delay])

  // Cancel pending invocations on unmount.
  React.useEffect(() => {
    return () => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = null
      }
    }
  }, [])

  return React.useCallback((...args: Parameters<T>): void => {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current)
    }
    timeoutIdRef.current = setTimeout(() => {
      callbackRef.current(...args)
    }, delayRef.current)
  }, [])
}

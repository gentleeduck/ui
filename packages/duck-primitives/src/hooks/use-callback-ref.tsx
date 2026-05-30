import * as React from 'react'

/** Stable function identity that always invokes the latest `callback`. Safe in deps. */
function useCallbackRef<T extends (...args: never[]) => unknown>(callback: T | undefined): T {
  const callbackRef = React.useRef(callback)

  // useInsertionEffect runs synchronously before child effects fire, so the latest
  // callback is in place by the time any consumer's effect reads it. Using useEffect
  // here means children's effects could read a stale callback in the same render.
  React.useInsertionEffect(() => {
    callbackRef.current = callback
  })

  // https://github.com/facebook/react/issues/19240
  return React.useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, [])
}

export { useCallbackRef }

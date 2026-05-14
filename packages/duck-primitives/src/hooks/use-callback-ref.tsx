import * as React from 'react'

/** Stable function identity that always invokes the latest `callback`. Safe in deps. */
function useCallbackRef<T extends (...args: never[]) => unknown>(callback: T | undefined): T {
  const callbackRef = React.useRef(callback)

  React.useEffect(() => {
    callbackRef.current = callback
  })

  // https://github.com/facebook/react/issues/19240
  return React.useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, [])
}

export { useCallbackRef }

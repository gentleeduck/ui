import * as React from 'react'

/**
 * Converts a callback to a stable ref so it never triggers re-renders when
 * passed as a prop or re-executes effects when listed as a dependency.
 * The returned function always calls the latest callback.
 */
function useCallbackRef<T extends (...args: any[]) => any>(callback: T | undefined): T {
  const callbackRef = React.useRef(callback)

  React.useEffect(() => {
    callbackRef.current = callback
  })

  // https://github.com/facebook/react/issues/19240
  return React.useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, [])
}

export { useCallbackRef }

import * as React from 'react'

export function useMediaQuery(query: string): boolean {
  // Lazy initializer: read the actual match on the client to avoid the
  // one-frame "non-matching" flash on mount. Falls back to `false` during SSR.
  const [value, setValue] = React.useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false
    }
    return window.matchMedia(query).matches
  })

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent): void {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener('change', onChange)
    setValue(result.matches)

    return () => result.removeEventListener('change', onChange)
  }, [query])

  return value
}

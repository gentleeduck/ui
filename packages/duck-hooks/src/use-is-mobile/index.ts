import * as React from 'react'

/** @internal */
const MOBILE_BREAKPOINT = 768

/**
 * Reactively track whether the viewport is narrower than the mobile breakpoint (768 px).
 *
 * Uses `matchMedia` under the hood and subscribes to changes so the
 * value stays in sync without polling.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile ?? false
}

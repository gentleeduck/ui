import * as React from 'react'

/**
 * Server-safe useLayoutEffect. Returns a no-op on the server to suppress
 * the React warning, since layout effects do not run during SSR.
 */
const useLayoutEffect = globalThis?.document ? React.useLayoutEffect : () => {}

export { useLayoutEffect }

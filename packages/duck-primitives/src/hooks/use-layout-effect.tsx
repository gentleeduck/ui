import * as React from 'react'

/** SSR-safe useLayoutEffect: no-op on the server to silence the React warning. */
const useLayoutEffect = globalThis?.document ? React.useLayoutEffect : () => {}

export { useLayoutEffect }

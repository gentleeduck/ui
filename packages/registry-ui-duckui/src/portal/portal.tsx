import * as React from 'react'
import ReactDOM from 'react-dom'

/**
 * On the server, React emits a warning when calling `useLayoutEffect`.
 * This is because neither `useLayoutEffect` nor `useEffect` run on the server.
 * We use this safe version which suppresses the warning by replacing it with a noop on the server.
 *
 * See: https://reactjs.org/docs/hooks-reference.html#uselayouteffect
 */
const useLayoutEffect = globalThis?.document ? React.useLayoutEffect : () => {}

interface PortalProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * An optional container where the portaled content should be appended.
   */
  container?: Element | DocumentFragment | null
}

const Portal = React.forwardRef<HTMLDivElement, PortalProps>((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props
  const [mounted, setMounted] = React.useState(false)
  useLayoutEffect(() => setMounted(true), [])
  const container = containerProp || (mounted && globalThis?.document?.body)
  return container ? ReactDOM.createPortal(<div {...portalProps} ref={forwardedRef} />, container) : null
})

export { Portal }

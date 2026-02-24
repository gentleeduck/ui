import * as React from 'react'
import ReactDOM from 'react-dom'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { Primitive } from '../primitive-elements'

/* -------------------------------------------------------------------------------------------------
 * Portal
 *
 * Renders children into a DOM node outside the parent hierarchy using
 * ReactDOM.createPortal. Defaults to document.body. Waits until after
 * the first layout effect to mount, ensuring SSR compatibility.
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'Portal'

type PortalElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface PortalProps extends PrimitiveDivProps {
  /** The container element to portal into. Defaults to document.body. */
  container?: Element | DocumentFragment | null
}

const Portal = React.forwardRef<PortalElement, PortalProps>((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props
  const [mounted, setMounted] = React.useState(false)
  useLayoutEffect(() => setMounted(true), [])
  const container = containerProp || (mounted && globalThis?.document?.body)
  return container
    ? ReactDOM.createPortal(<Primitive.div data-slot="portal" {...portalProps} ref={forwardedRef} />, container)
    : null
})

Portal.displayName = PORTAL_NAME

export { Portal }
export type { PortalProps }

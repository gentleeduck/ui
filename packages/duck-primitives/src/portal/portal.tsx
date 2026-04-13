import * as React from 'react'
import ReactDOM from 'react-dom'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { Primitive } from '../primitive-elements'

const PORTAL_NAME = 'Portal'

type PortalElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface IPortalProps extends PrimitiveDivProps {
  /** The container element to portal into. Defaults to document.body. */
  container?: Element | DocumentFragment | null
}

const Portal = React.forwardRef<PortalElement, IPortalProps>((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props
  const [mounted, setMounted] = React.useState(false)
  useLayoutEffect(() => setMounted(true), [])
  const container = containerProp || (mounted && globalThis?.document?.body)
  return container
    ? ReactDOM.createPortal(<Primitive.div data-slot="portal" {...portalProps} ref={forwardedRef} />, container)
    : null
})

Portal.displayName = PORTAL_NAME

export type { IPortalProps }
export { Portal }

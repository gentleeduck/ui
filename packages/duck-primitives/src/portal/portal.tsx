import * as React from 'react'
import ReactDOM from 'react-dom'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { Primitive } from '../primitive-elements'
import type { IPortal } from './portal.types'

const PORTAL_NAME = 'Portal'

type PortalElement = React.ComponentRef<typeof Primitive.div>

const Portal = React.forwardRef<PortalElement, IPortal.IProps>((props, forwardedRef) => {
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

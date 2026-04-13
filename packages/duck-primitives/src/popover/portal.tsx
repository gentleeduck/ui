import type * as React from 'react'
import { Portal as PortalPrimitive } from '../portal'
import { Presence } from '../presence/presence'
import { createPopoverContext, type ScopedProps, usePopoverContext } from './popover'

const PORTAL_NAME = 'PopoverPortal'

type PortalContextValue = { forceMount?: true }

export const [PortalProvider, usePortalContext] = createPopoverContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
})

export interface IPopoverPortalProps {
  children?: React.ReactNode
  /** The container element to portal into. Defaults to document.body. */
  container?: React.ComponentPropsWithoutRef<typeof PortalPrimitive>['container']
  /** Force mounting for animation control. */
  forceMount?: true
}

/**
 * Portals popover content into a specified container (or document.body).
 * Wraps children in Presence so content only mounts when open or force-mounted.
 */
export function PopoverPortal(props: ScopedProps<IPopoverPortalProps>) {
  const { __scopePopover, forceMount, children, container } = props
  const context = usePopoverContext(PORTAL_NAME, __scopePopover)

  return (
    <PortalProvider scope={__scopePopover} forceMount={forceMount}>
      <Presence present={forceMount || context.open}>
        <PortalPrimitive asChild container={container}>
          {children}
        </PortalPrimitive>
      </Presence>
    </PortalProvider>
  )
}

PopoverPortal.displayName = PORTAL_NAME

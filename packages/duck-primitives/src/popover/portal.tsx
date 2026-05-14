import { Portal as PortalPrimitive } from '../portal'
import { Presence } from '../presence/presence'
import { createPopoverContext, usePopoverContext } from './popover'
import type { IPopover } from './popover.types'

const PORTAL_NAME = 'PopoverPortal'

export const [PortalProvider, usePortalContext] = createPopoverContext<IPopover.IPortalContext>(PORTAL_NAME, {
  forceMount: undefined,
})

export function PopoverPortal(props: IPopover.IScoped<IPopover.IPortalProps>) {
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

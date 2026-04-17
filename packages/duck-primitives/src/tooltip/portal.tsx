import type * as React from 'react'
import { Portal as PortalPrimitive } from '../portal'
import { Presence } from '../presence'
import { useTooltipContext } from './tooltip'
import { createTooltipContext } from './tooltip.libs'
import type { ITooltip } from './tooltip.types'

const PORTAL_NAME = 'TooltipPortal'

export const [PortalProvider, usePortalContext] = createTooltipContext<ITooltip.IPortalContext>(PORTAL_NAME, {
  forceMount: undefined,
})

export const TooltipPortal: React.FC<ITooltip.IPortalProps> = (
  props: ITooltip.IScoped<ITooltip.IPortalProps>,
) => {
  const { __scopeTooltip, forceMount, children, container } = props
  const context = useTooltipContext(PORTAL_NAME, __scopeTooltip)
  return (
    <PortalProvider scope={__scopeTooltip} forceMount={forceMount}>
      <Presence present={forceMount || context.open}>
        <PortalPrimitive asChild container={container}>
          {children}
        </PortalPrimitive>
      </Presence>
    </PortalProvider>
  )
}

TooltipPortal.displayName = PORTAL_NAME

import type * as React from 'react'
import { Portal as PortalPrimitive } from '../portal'
import { Presence } from '../presence'
import { useTooltipContext } from './tooltip'
import { createTooltipContext, type ScopedProps } from './tooltip.libs'

const PORTAL_NAME = 'TooltipPortal'

type PortalContextValue = { forceMount?: true }

export const [PortalProvider, usePortalContext] = createTooltipContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
})

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>

export interface ITooltipPortalProps {
  children?: React.ReactNode
  /**
   * Specify a container element to portal the content into.
   */
  container?: PortalProps['container']
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

export const TooltipPortal: React.FC<ITooltipPortalProps> = (props: ScopedProps<ITooltipPortalProps>) => {
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

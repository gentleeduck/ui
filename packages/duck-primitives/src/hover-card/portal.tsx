import type * as React from 'react'
import { Portal as PortalPrimitive } from '../portal'
import { Presence } from '../presence'
import { createHoverCardContext, useHoverCardContext } from './hover-card'
import type { IHoverCard } from './hover-card.types'

const PORTAL_NAME = 'HoverCardPortal'

export const [PortalProvider, usePortalContext] = createHoverCardContext<IHoverCard.IPortalContext>(PORTAL_NAME, {
  forceMount: undefined,
})

/** Portals hover card content into a specified container or document.body. */
export const HoverCardPortal: React.FC<IHoverCard.IPortalProps> = (
  props: IHoverCard.IScoped<IHoverCard.IPortalProps>,
) => {
  const { __scopeHoverCard, forceMount, children, container } = props
  const context = useHoverCardContext(PORTAL_NAME, __scopeHoverCard)
  return (
    <PortalProvider scope={__scopeHoverCard} forceMount={forceMount}>
      <Presence present={forceMount || context.open}>
        <PortalPrimitive asChild container={container}>
          {children}
        </PortalPrimitive>
      </Presence>
    </PortalProvider>
  )
}

HoverCardPortal.displayName = PORTAL_NAME

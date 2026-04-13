import type * as React from 'react'
import { Portal as PortalPrimitive } from '../portal'
import { Presence } from '../presence'
import { createHoverCardContext, type ScopedProps, useHoverCardContext } from './hover-card'

const PORTAL_NAME = 'HoverCardPortal'

type PortalContextValue = { forceMount?: true }

export const [PortalProvider, usePortalContext] = createHoverCardContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
})

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>

export interface IHoverCardPortalProps {
  children?: React.ReactNode
  /** Specify a container element to portal the content into. */
  container?: PortalProps['container']
  /** Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries. */
  forceMount?: true
}

/** Portals hover card content into a specified container or document.body. */
export const HoverCardPortal: React.FC<IHoverCardPortalProps> = (props: ScopedProps<IHoverCardPortalProps>) => {
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

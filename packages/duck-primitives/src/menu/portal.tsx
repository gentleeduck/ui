/** MenuPortal component - portals menu content into a specified container. */
import type * as React from 'react'
import { Portal as PortalPrimitive } from '../portal'
import { Presence } from '../presence'

import { createMenuContext, type ScopedProps, useMenuContext } from './menu'

const PORTAL_NAME = 'MenuPortal'

type PortalContextValue = { forceMount?: true }
const [PortalProvider, usePortalContext] = createMenuContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
})

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>
interface IMenuPortalProps {
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

const MenuPortal: React.FC<IMenuPortalProps> = (props: ScopedProps<IMenuPortalProps>) => {
  const { __scopeMenu, forceMount, children, container } = props
  const context = useMenuContext(PORTAL_NAME, __scopeMenu)
  return (
    <PortalProvider scope={__scopeMenu} forceMount={forceMount}>
      <Presence present={forceMount || context.open}>
        <PortalPrimitive asChild container={container}>
          {children}
        </PortalPrimitive>
      </Presence>
    </PortalProvider>
  )
}

MenuPortal.displayName = PORTAL_NAME

export type { IMenuPortalProps }
export { MenuPortal, PortalProvider, usePortalContext }

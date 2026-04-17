import type * as React from 'react'
import { Portal as PortalPrimitive } from '../portal'
import { Presence } from '../presence'
import { createMenuContext, useMenuContext } from './menu'
import type { IMenu } from './menu.types'

const PORTAL_NAME = 'MenuPortal'

const [PortalProvider, usePortalContext] = createMenuContext<IMenu.IPortalContext>(PORTAL_NAME, {
  forceMount: undefined,
})

const MenuPortal: React.FC<IMenu.IPortalProps> = (props: IMenu.IScoped<IMenu.IPortalProps>) => {
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

export { MenuPortal, PortalProvider, usePortalContext }

import type * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const PORTAL_NAME = 'MenubarPortal'

const MenubarPortal: React.FC<IMenubar.IPortalProps> = (props: IMenubar.IScoped<IMenubar.IPortalProps>) => {
  const { __scopeMenubar, ...portalProps } = props
  const menuScope = useMenuScope(__scopeMenubar)
  return <MenuPrimitive.Portal {...menuScope} {...portalProps} />
}

MenubarPortal.displayName = PORTAL_NAME

export { MenubarPortal }

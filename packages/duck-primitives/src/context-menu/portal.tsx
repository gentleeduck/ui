import type * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const PORTAL_NAME = 'ContextMenuPortal'

const ContextMenuPortal: React.FC<IContextMenu.IPortalProps> = (
  props: IContextMenu.IScoped<IContextMenu.IPortalProps>,
) => {
  const { __scopeContextMenu, ...portalProps } = props
  const menuScope = useMenuScope(__scopeContextMenu)
  return <MenuPrimitive.Portal {...menuScope} {...portalProps} />
}

ContextMenuPortal.displayName = PORTAL_NAME

export { ContextMenuPortal }

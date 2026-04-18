import type * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './dropdown-menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const PORTAL_NAME = 'DropdownMenuPortal'

const DropdownMenuPortal: React.FC<IDropdownMenu.IPortalProps> = (
  props: IDropdownMenu.IScoped<IDropdownMenu.IPortalProps>,
) => {
  const { __scopeDropdownMenu, ...portalProps } = props
  const menuScope = useMenuScope(__scopeDropdownMenu)
  return <MenuPrimitive.Portal {...menuScope} {...portalProps} />
}

DropdownMenuPortal.displayName = PORTAL_NAME

export { DropdownMenuPortal }

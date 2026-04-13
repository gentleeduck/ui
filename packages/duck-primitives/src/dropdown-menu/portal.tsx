/** DropdownMenuPortal -- renders menu content into a React portal. */
import type * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const PORTAL_NAME = 'DropdownMenuPortal'

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>
interface IDropdownMenuPortalProps extends MenuPortalProps {}

const DropdownMenuPortal: React.FC<IDropdownMenuPortalProps> = (props: ScopedProps<IDropdownMenuPortalProps>) => {
  const { __scopeDropdownMenu, ...portalProps } = props
  const menuScope = useMenuScope(__scopeDropdownMenu)
  return <MenuPrimitive.Portal {...menuScope} {...portalProps} />
}

DropdownMenuPortal.displayName = PORTAL_NAME

export type { IDropdownMenuPortalProps }
export { DropdownMenuPortal }

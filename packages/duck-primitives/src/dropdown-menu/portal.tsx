/** DropdownMenuPortal -- renders menu content into a React portal. */
import type * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const PORTAL_NAME = 'DropdownMenuPortal'

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>
interface DropdownMenuPortalProps extends MenuPortalProps {}

const DropdownMenuPortal: React.FC<DropdownMenuPortalProps> = (props: ScopedProps<DropdownMenuPortalProps>) => {
  const { __scopeDropdownMenu, ...portalProps } = props
  const menuScope = useMenuScope(__scopeDropdownMenu)
  return <MenuPrimitive.Portal {...menuScope} {...portalProps} />
}

DropdownMenuPortal.displayName = PORTAL_NAME

export type { DropdownMenuPortalProps }
export { DropdownMenuPortal }

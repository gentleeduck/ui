/** MenubarPortal renders menu content into a React portal. */
import type * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const PORTAL_NAME = 'MenubarPortal'

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>
interface IMenubarPortalProps extends MenuPortalProps {}

const MenubarPortal: React.FC<IMenubarPortalProps> = (props: ScopedProps<IMenubarPortalProps>) => {
  const { __scopeMenubar, ...portalProps } = props
  const menuScope = useMenuScope(__scopeMenubar)
  return <MenuPrimitive.Portal {...menuScope} {...portalProps} />
}

MenubarPortal.displayName = PORTAL_NAME

export type { IMenubarPortalProps }
export { MenubarPortal }

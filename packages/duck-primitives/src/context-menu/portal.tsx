/** ContextMenuPortal -- renders menu content into a React portal. */
import type * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const PORTAL_NAME = 'ContextMenuPortal'

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>
interface IContextMenuPortalProps extends MenuPortalProps {}

const ContextMenuPortal: React.FC<IContextMenuPortalProps> = (props: ScopedProps<IContextMenuPortalProps>) => {
  const { __scopeContextMenu, ...portalProps } = props
  const menuScope = useMenuScope(__scopeContextMenu)
  return <MenuPrimitive.Portal {...menuScope} {...portalProps} />
}

ContextMenuPortal.displayName = PORTAL_NAME

export type { IContextMenuPortalProps }
export { ContextMenuPortal }

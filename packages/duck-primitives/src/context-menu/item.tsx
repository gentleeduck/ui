/** ContextMenuItem -- an interactive item within the context menu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const ITEM_NAME = 'ContextMenuItem'

type ContextMenuItemElement = React.ComponentRef<typeof MenuPrimitive.Item>
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
interface IContextMenuItemProps extends MenuItemProps {}

const ContextMenuItem = React.forwardRef<ContextMenuItemElement, IContextMenuItemProps>(
  (props: ScopedProps<IContextMenuItemProps>, forwardedRef) => {
    const { __scopeContextMenu, ...itemProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />
  },
)

ContextMenuItem.displayName = ITEM_NAME

export type { IContextMenuItemProps }
export { ContextMenuItem }

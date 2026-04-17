import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const ITEM_NAME = 'ContextMenuItem'

type ContextMenuItemElement = React.ComponentRef<typeof MenuPrimitive.Item>

const ContextMenuItem = React.forwardRef<ContextMenuItemElement, IContextMenu.IItemProps>(
  (props: IContextMenu.IScoped<IContextMenu.IItemProps>, forwardedRef) => {
    const { __scopeContextMenu, ...itemProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />
  },
)

ContextMenuItem.displayName = ITEM_NAME

export { ContextMenuItem }

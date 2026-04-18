import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './dropdown-menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const ITEM_NAME = 'DropdownMenuItem'

type DropdownMenuItemElement = React.ComponentRef<typeof MenuPrimitive.Item>

const DropdownMenuItem = React.forwardRef<DropdownMenuItemElement, IDropdownMenu.IItemProps>(
  (props: IDropdownMenu.IScoped<IDropdownMenu.IItemProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...itemProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />
  },
)

DropdownMenuItem.displayName = ITEM_NAME

export { DropdownMenuItem }

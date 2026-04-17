import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const ITEM_NAME = 'MenubarItem'

type MenubarItemElement = React.ComponentRef<typeof MenuPrimitive.Item>

const MenubarItem = React.forwardRef<MenubarItemElement, IMenubar.IItemProps>(
  (props: IMenubar.IScoped<IMenubar.IItemProps>, forwardedRef) => {
    const { __scopeMenubar, ...itemProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />
  },
)

MenubarItem.displayName = ITEM_NAME

export { MenubarItem }

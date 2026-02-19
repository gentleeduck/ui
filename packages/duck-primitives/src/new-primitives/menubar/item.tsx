/** MenubarItem renders an interactive item within a menu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const ITEM_NAME = 'MenubarItem'

type MenubarItemElement = React.ElementRef<typeof MenuPrimitive.Item>
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
interface MenubarItemProps extends MenuItemProps {}

const MenubarItem = React.forwardRef<MenubarItemElement, MenubarItemProps>(
  (props: ScopedProps<MenubarItemProps>, forwardedRef) => {
    const { __scopeMenubar, ...itemProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />
  },
)

MenubarItem.displayName = ITEM_NAME

export { MenubarItem }
export type { MenubarItemProps }

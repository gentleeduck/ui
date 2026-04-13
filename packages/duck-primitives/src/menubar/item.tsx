/** MenubarItem renders an interactive item within a menu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const ITEM_NAME = 'MenubarItem'

type MenubarItemElement = React.ComponentRef<typeof MenuPrimitive.Item>
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
interface IMenubarItemProps extends MenuItemProps {}

const MenubarItem = React.forwardRef<MenubarItemElement, IMenubarItemProps>(
  (props: ScopedProps<IMenubarItemProps>, forwardedRef) => {
    const { __scopeMenubar, ...itemProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />
  },
)

MenubarItem.displayName = ITEM_NAME

export type { IMenubarItemProps }
export { MenubarItem }

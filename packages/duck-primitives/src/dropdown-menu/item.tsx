/** DropdownMenuItem -- an interactive item within the dropdown menu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const ITEM_NAME = 'DropdownMenuItem'

type DropdownMenuItemElement = React.ComponentRef<typeof MenuPrimitive.Item>
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
interface IDropdownMenuItemProps extends MenuItemProps {}

const DropdownMenuItem = React.forwardRef<DropdownMenuItemElement, IDropdownMenuItemProps>(
  (props: ScopedProps<IDropdownMenuItemProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...itemProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />
  },
)

DropdownMenuItem.displayName = ITEM_NAME

export type { IDropdownMenuItemProps }
export { DropdownMenuItem }

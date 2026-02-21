/** DropdownMenuItem -- an interactive item within the dropdown menu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const ITEM_NAME = 'DropdownMenuItem'

type DropdownMenuItemElement = React.ComponentRef<typeof MenuPrimitive.Item>
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
interface DropdownMenuItemProps extends MenuItemProps {}

const DropdownMenuItem = React.forwardRef<DropdownMenuItemElement, DropdownMenuItemProps>(
  (props: ScopedProps<DropdownMenuItemProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...itemProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />
  },
)

DropdownMenuItem.displayName = ITEM_NAME

export { DropdownMenuItem }
export type { DropdownMenuItemProps }

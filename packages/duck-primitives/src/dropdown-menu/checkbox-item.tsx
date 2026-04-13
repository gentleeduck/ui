/** DropdownMenuCheckboxItem -- a menu item that toggles a checked state. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const CHECKBOX_ITEM_NAME = 'DropdownMenuCheckboxItem'

type DropdownMenuCheckboxItemElement = React.ComponentRef<typeof MenuPrimitive.CheckboxItem>
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
interface IDropdownMenuCheckboxItemProps extends MenuCheckboxItemProps {}

const DropdownMenuCheckboxItem = React.forwardRef<DropdownMenuCheckboxItemElement, IDropdownMenuCheckboxItemProps>(
  (props: ScopedProps<IDropdownMenuCheckboxItemProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...checkboxItemProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.CheckboxItem {...menuScope} {...checkboxItemProps} ref={forwardedRef} />
  },
)

DropdownMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME

export type { IDropdownMenuCheckboxItemProps }
export { DropdownMenuCheckboxItem }

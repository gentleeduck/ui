import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './dropdown-menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const CHECKBOX_ITEM_NAME = 'DropdownMenuCheckboxItem'

type DropdownMenuCheckboxItemElement = React.ComponentRef<typeof MenuPrimitive.CheckboxItem>

const DropdownMenuCheckboxItem = React.forwardRef<DropdownMenuCheckboxItemElement, IDropdownMenu.ICheckboxItemProps>(
  (props: IDropdownMenu.IScoped<IDropdownMenu.ICheckboxItemProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...checkboxItemProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.CheckboxItem {...menuScope} {...checkboxItemProps} ref={forwardedRef} />
  },
)

DropdownMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME

export { DropdownMenuCheckboxItem }

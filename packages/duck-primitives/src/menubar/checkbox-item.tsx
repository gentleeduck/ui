import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const CHECKBOX_ITEM_NAME = 'MenubarCheckboxItem'

type MenubarCheckboxItemElement = React.ComponentRef<typeof MenuPrimitive.CheckboxItem>

const MenubarCheckboxItem = React.forwardRef<MenubarCheckboxItemElement, IMenubar.ICheckboxItemProps>(
  (props: IMenubar.IScoped<IMenubar.ICheckboxItemProps>, forwardedRef) => {
    const { __scopeMenubar, ...checkboxItemProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.CheckboxItem {...menuScope} {...checkboxItemProps} ref={forwardedRef} />
  },
)

MenubarCheckboxItem.displayName = CHECKBOX_ITEM_NAME

export { MenubarCheckboxItem }

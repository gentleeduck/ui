/** MenubarCheckboxItem renders a toggleable checkbox item within a menu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const CHECKBOX_ITEM_NAME = 'MenubarCheckboxItem'

type MenubarCheckboxItemElement = React.ElementRef<typeof MenuPrimitive.CheckboxItem>
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
interface MenubarCheckboxItemProps extends MenuCheckboxItemProps {}

const MenubarCheckboxItem = React.forwardRef<MenubarCheckboxItemElement, MenubarCheckboxItemProps>(
  (props: ScopedProps<MenubarCheckboxItemProps>, forwardedRef) => {
    const { __scopeMenubar, ...checkboxItemProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.CheckboxItem {...menuScope} {...checkboxItemProps} ref={forwardedRef} />
  },
)

MenubarCheckboxItem.displayName = CHECKBOX_ITEM_NAME

export { MenubarCheckboxItem }
export type { MenubarCheckboxItemProps }

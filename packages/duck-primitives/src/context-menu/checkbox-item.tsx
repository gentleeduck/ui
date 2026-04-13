/** ContextMenuCheckboxItem -- a toggleable checkbox item in the context menu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const CHECKBOX_ITEM_NAME = 'ContextMenuCheckboxItem'

type ContextMenuCheckboxItemElement = React.ComponentRef<typeof MenuPrimitive.CheckboxItem>
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
interface IContextMenuCheckboxItemProps extends MenuCheckboxItemProps {}

const ContextMenuCheckboxItem = React.forwardRef<ContextMenuCheckboxItemElement, IContextMenuCheckboxItemProps>(
  (props: ScopedProps<IContextMenuCheckboxItemProps>, forwardedRef) => {
    const { __scopeContextMenu, ...checkboxItemProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.CheckboxItem {...menuScope} {...checkboxItemProps} ref={forwardedRef} />
  },
)

ContextMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME

export type { IContextMenuCheckboxItemProps }
export { ContextMenuCheckboxItem }

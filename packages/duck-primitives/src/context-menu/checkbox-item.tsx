import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const CHECKBOX_ITEM_NAME = 'ContextMenuCheckboxItem'

type ContextMenuCheckboxItemElement = React.ComponentRef<typeof MenuPrimitive.CheckboxItem>

const ContextMenuCheckboxItem = React.forwardRef<ContextMenuCheckboxItemElement, IContextMenu.ICheckboxItemProps>(
  (props: IContextMenu.IScoped<IContextMenu.ICheckboxItemProps>, forwardedRef) => {
    const { __scopeContextMenu, ...checkboxItemProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.CheckboxItem {...menuScope} {...checkboxItemProps} ref={forwardedRef} />
  },
)

ContextMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME

export { ContextMenuCheckboxItem }

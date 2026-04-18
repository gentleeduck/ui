import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const INDICATOR_NAME = 'ContextMenuItemIndicator'

type ContextMenuItemIndicatorElement = React.ComponentRef<typeof MenuPrimitive.ItemIndicator>

const ContextMenuItemIndicator = React.forwardRef<ContextMenuItemIndicatorElement, IContextMenu.IItemIndicatorProps>(
  (props: IContextMenu.IScoped<IContextMenu.IItemIndicatorProps>, forwardedRef) => {
    const { __scopeContextMenu, ...itemIndicatorProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.ItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />
  },
)

ContextMenuItemIndicator.displayName = INDICATOR_NAME

export { ContextMenuItemIndicator }

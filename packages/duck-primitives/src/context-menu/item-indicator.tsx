/** ContextMenuItemIndicator -- renders when a checkbox or radio item is active. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const INDICATOR_NAME = 'ContextMenuItemIndicator'

type ContextMenuItemIndicatorElement = React.ComponentRef<typeof MenuPrimitive.ItemIndicator>
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>
interface IContextMenuItemIndicatorProps extends MenuItemIndicatorProps {}

const ContextMenuItemIndicator = React.forwardRef<ContextMenuItemIndicatorElement, IContextMenuItemIndicatorProps>(
  (props: ScopedProps<IContextMenuItemIndicatorProps>, forwardedRef) => {
    const { __scopeContextMenu, ...itemIndicatorProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.ItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />
  },
)

ContextMenuItemIndicator.displayName = INDICATOR_NAME

export type { IContextMenuItemIndicatorProps }
export { ContextMenuItemIndicator }

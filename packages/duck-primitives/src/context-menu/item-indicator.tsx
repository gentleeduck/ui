/** ContextMenuItemIndicator -- renders when a checkbox or radio item is active. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const INDICATOR_NAME = 'ContextMenuItemIndicator'

type ContextMenuItemIndicatorElement = React.ElementRef<typeof MenuPrimitive.ItemIndicator>
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>
interface ContextMenuItemIndicatorProps extends MenuItemIndicatorProps {}

const ContextMenuItemIndicator = React.forwardRef<ContextMenuItemIndicatorElement, ContextMenuItemIndicatorProps>(
  (props: ScopedProps<ContextMenuItemIndicatorProps>, forwardedRef) => {
    const { __scopeContextMenu, ...itemIndicatorProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.ItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />
  },
)

ContextMenuItemIndicator.displayName = INDICATOR_NAME

export { ContextMenuItemIndicator }
export type { ContextMenuItemIndicatorProps }

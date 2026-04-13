/** DropdownMenuItemIndicator -- renders when the parent item is checked. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const INDICATOR_NAME = 'DropdownMenuItemIndicator'

type DropdownMenuItemIndicatorElement = React.ComponentRef<typeof MenuPrimitive.ItemIndicator>
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>
interface IDropdownMenuItemIndicatorProps extends MenuItemIndicatorProps {}

const DropdownMenuItemIndicator = React.forwardRef<DropdownMenuItemIndicatorElement, IDropdownMenuItemIndicatorProps>(
  (props: ScopedProps<IDropdownMenuItemIndicatorProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...itemIndicatorProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.ItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />
  },
)

DropdownMenuItemIndicator.displayName = INDICATOR_NAME

export type { IDropdownMenuItemIndicatorProps }
export { DropdownMenuItemIndicator }

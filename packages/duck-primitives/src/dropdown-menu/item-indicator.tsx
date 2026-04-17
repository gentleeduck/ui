import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './dropdown-menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const INDICATOR_NAME = 'DropdownMenuItemIndicator'

type DropdownMenuItemIndicatorElement = React.ComponentRef<typeof MenuPrimitive.ItemIndicator>

const DropdownMenuItemIndicator = React.forwardRef<
  DropdownMenuItemIndicatorElement,
  IDropdownMenu.IItemIndicatorProps
>((props: IDropdownMenu.IScoped<IDropdownMenu.IItemIndicatorProps>, forwardedRef) => {
  const { __scopeDropdownMenu, ...itemIndicatorProps } = props
  const menuScope = useMenuScope(__scopeDropdownMenu)
  return <MenuPrimitive.ItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />
})

DropdownMenuItemIndicator.displayName = INDICATOR_NAME

export { DropdownMenuItemIndicator }

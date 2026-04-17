import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const INDICATOR_NAME = 'MenubarItemIndicator'

type MenubarItemIndicatorElement = React.ComponentRef<typeof MenuPrimitive.ItemIndicator>

const MenubarItemIndicator = React.forwardRef<MenubarItemIndicatorElement, IMenubar.IItemIndicatorProps>(
  (props: IMenubar.IScoped<IMenubar.IItemIndicatorProps>, forwardedRef) => {
    const { __scopeMenubar, ...itemIndicatorProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.ItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />
  },
)

MenubarItemIndicator.displayName = INDICATOR_NAME

export { MenubarItemIndicator }

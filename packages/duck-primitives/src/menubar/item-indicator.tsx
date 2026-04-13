/** MenubarItemIndicator renders when a checkbox or radio item is active. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const INDICATOR_NAME = 'MenubarItemIndicator'

type MenubarItemIndicatorElement = React.ComponentRef<typeof MenuPrimitive.ItemIndicator>
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>
interface IMenubarItemIndicatorProps extends MenuItemIndicatorProps {}

const MenubarItemIndicator = React.forwardRef<MenubarItemIndicatorElement, IMenubarItemIndicatorProps>(
  (props: ScopedProps<IMenubarItemIndicatorProps>, forwardedRef) => {
    const { __scopeMenubar, ...itemIndicatorProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.ItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />
  },
)

MenubarItemIndicator.displayName = INDICATOR_NAME

export type { IMenubarItemIndicatorProps }
export { MenubarItemIndicator }

/** MenubarSeparator renders a visual divider between menu items. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const SEPARATOR_NAME = 'MenubarSeparator'

type MenubarSeparatorElement = React.ElementRef<typeof MenuPrimitive.Separator>
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
interface MenubarSeparatorProps extends MenuSeparatorProps {}

const MenubarSeparator = React.forwardRef<MenubarSeparatorElement, MenubarSeparatorProps>(
  (props: ScopedProps<MenubarSeparatorProps>, forwardedRef) => {
    const { __scopeMenubar, ...separatorProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />
  },
)

MenubarSeparator.displayName = SEPARATOR_NAME

export { MenubarSeparator }
export type { MenubarSeparatorProps }

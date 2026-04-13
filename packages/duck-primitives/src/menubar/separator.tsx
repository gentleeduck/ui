/** MenubarSeparator renders a visual divider between menu items. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const SEPARATOR_NAME = 'MenubarSeparator'

type MenubarSeparatorElement = React.ComponentRef<typeof MenuPrimitive.Separator>
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
interface IMenubarSeparatorProps extends MenuSeparatorProps {}

const MenubarSeparator = React.forwardRef<MenubarSeparatorElement, IMenubarSeparatorProps>(
  (props: ScopedProps<IMenubarSeparatorProps>, forwardedRef) => {
    const { __scopeMenubar, ...separatorProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />
  },
)

MenubarSeparator.displayName = SEPARATOR_NAME

export type { IMenubarSeparatorProps }
export { MenubarSeparator }

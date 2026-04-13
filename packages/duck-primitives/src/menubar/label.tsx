/** MenubarLabel renders a non-interactive label within a menu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const LABEL_NAME = 'MenubarLabel'

type MenubarLabelElement = React.ComponentRef<typeof MenuPrimitive.Label>
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>
interface IMenubarLabelProps extends MenuLabelProps {}

const MenubarLabel = React.forwardRef<MenubarLabelElement, IMenubarLabelProps>(
  (props: ScopedProps<IMenubarLabelProps>, forwardedRef) => {
    const { __scopeMenubar, ...labelProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Label {...menuScope} {...labelProps} ref={forwardedRef} />
  },
)

MenubarLabel.displayName = LABEL_NAME

export type { IMenubarLabelProps }
export { MenubarLabel }

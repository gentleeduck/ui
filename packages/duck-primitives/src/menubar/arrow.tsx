/** MenubarArrow renders a directional arrow pointing toward the trigger. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const ARROW_NAME = 'MenubarArrow'

type MenubarArrowElement = React.ElementRef<typeof MenuPrimitive.Arrow>
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>
interface MenubarArrowProps extends MenuArrowProps {}

const MenubarArrow = React.forwardRef<MenubarArrowElement, MenubarArrowProps>(
  (props: ScopedProps<MenubarArrowProps>, forwardedRef) => {
    const { __scopeMenubar, ...arrowProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Arrow {...menuScope} {...arrowProps} ref={forwardedRef} />
  },
)

MenubarArrow.displayName = ARROW_NAME

export { MenubarArrow }
export type { MenubarArrowProps }

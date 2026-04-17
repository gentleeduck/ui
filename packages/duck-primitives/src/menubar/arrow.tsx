import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const ARROW_NAME = 'MenubarArrow'

type MenubarArrowElement = React.ComponentRef<typeof MenuPrimitive.Arrow>

const MenubarArrow = React.forwardRef<MenubarArrowElement, IMenubar.IArrowProps>(
  (props: IMenubar.IScoped<IMenubar.IArrowProps>, forwardedRef) => {
    const { __scopeMenubar, ...arrowProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return <MenuPrimitive.Arrow {...menuScope} {...arrowProps} ref={forwardedRef} />
  },
)

MenubarArrow.displayName = ARROW_NAME

export { MenubarArrow }

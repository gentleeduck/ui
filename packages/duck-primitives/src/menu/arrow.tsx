import * as React from 'react'
import * as PopperPrimitive from '../popper'
import { usePopperScope } from './menu'
import type { IMenu } from './menu.types'

const ARROW_NAME = 'MenuArrow'

type MenuArrowElement = React.ComponentRef<typeof PopperPrimitive.PopperArrow>

const MenuArrow = React.forwardRef<MenuArrowElement, IMenu.IArrowProps>(
  (props: IMenu.IScoped<IMenu.IArrowProps>, forwardedRef) => {
    const { __scopeMenu, ...arrowProps } = props
    const popperScope = usePopperScope(__scopeMenu)
    return <PopperPrimitive.PopperArrow {...popperScope} {...arrowProps} ref={forwardedRef} />
  },
)

MenuArrow.displayName = ARROW_NAME

export { MenuArrow }

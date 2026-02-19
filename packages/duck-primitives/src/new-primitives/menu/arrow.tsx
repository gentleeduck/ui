/** MenuArrow component - an optional arrow pointing from the menu to its anchor. */
import * as React from 'react'
import * as PopperPrimitive from '../popper'

import { type ScopedProps, usePopperScope } from './menu'

const ARROW_NAME = 'MenuArrow'

type MenuArrowElement = React.ElementRef<typeof PopperPrimitive.PopperArrow>
type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperArrow>
interface MenuArrowProps extends PopperArrowProps {}

const MenuArrow = React.forwardRef<MenuArrowElement, MenuArrowProps>(
  (props: ScopedProps<MenuArrowProps>, forwardedRef) => {
    const { __scopeMenu, ...arrowProps } = props
    const popperScope = usePopperScope(__scopeMenu)
    return <PopperPrimitive.PopperArrow {...popperScope} {...arrowProps} ref={forwardedRef} />
  },
)

MenuArrow.displayName = ARROW_NAME

export { MenuArrow }
export type { MenuArrowProps, MenuArrowElement }

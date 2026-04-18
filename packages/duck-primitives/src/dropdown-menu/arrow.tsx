import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './dropdown-menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const ARROW_NAME = 'DropdownMenuArrow'

type DropdownMenuArrowElement = React.ComponentRef<typeof MenuPrimitive.Arrow>

const DropdownMenuArrow = React.forwardRef<DropdownMenuArrowElement, IDropdownMenu.IArrowProps>(
  (props: IDropdownMenu.IScoped<IDropdownMenu.IArrowProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...arrowProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.Arrow {...menuScope} {...arrowProps} ref={forwardedRef} />
  },
)

DropdownMenuArrow.displayName = ARROW_NAME

export { DropdownMenuArrow }

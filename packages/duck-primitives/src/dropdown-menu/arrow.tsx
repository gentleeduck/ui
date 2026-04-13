/** DropdownMenuArrow -- optional arrow pointing to the trigger. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const ARROW_NAME = 'DropdownMenuArrow'

type DropdownMenuArrowElement = React.ComponentRef<typeof MenuPrimitive.Arrow>
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>
interface IDropdownMenuArrowProps extends MenuArrowProps {}

const DropdownMenuArrow = React.forwardRef<DropdownMenuArrowElement, IDropdownMenuArrowProps>(
  (props: ScopedProps<IDropdownMenuArrowProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...arrowProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.Arrow {...menuScope} {...arrowProps} ref={forwardedRef} />
  },
)

DropdownMenuArrow.displayName = ARROW_NAME

export type { IDropdownMenuArrowProps }
export { DropdownMenuArrow }

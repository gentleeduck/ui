/** ContextMenuArrow -- optional arrow pointing to the trigger. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const ARROW_NAME = 'ContextMenuArrow'

type ContextMenuArrowElement = React.ComponentRef<typeof MenuPrimitive.Arrow>
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>
interface IContextMenuArrowProps extends MenuArrowProps {}

const ContextMenuArrow = React.forwardRef<ContextMenuArrowElement, IContextMenuArrowProps>(
  (props: ScopedProps<IContextMenuArrowProps>, forwardedRef) => {
    const { __scopeContextMenu, ...arrowProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.Arrow {...menuScope} {...arrowProps} ref={forwardedRef} />
  },
)

ContextMenuArrow.displayName = ARROW_NAME

export type { IContextMenuArrowProps }
export { ContextMenuArrow }

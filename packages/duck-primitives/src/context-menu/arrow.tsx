import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const ARROW_NAME = 'ContextMenuArrow'

type ContextMenuArrowElement = React.ComponentRef<typeof MenuPrimitive.Arrow>

const ContextMenuArrow = React.forwardRef<ContextMenuArrowElement, IContextMenu.IArrowProps>(
  (props: IContextMenu.IScoped<IContextMenu.IArrowProps>, forwardedRef) => {
    const { __scopeContextMenu, ...arrowProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.Arrow {...menuScope} {...arrowProps} ref={forwardedRef} />
  },
)

ContextMenuArrow.displayName = ARROW_NAME

export { ContextMenuArrow }

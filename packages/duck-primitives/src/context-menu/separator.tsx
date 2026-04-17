import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const SEPARATOR_NAME = 'ContextMenuSeparator'

type ContextMenuSeparatorElement = React.ComponentRef<typeof MenuPrimitive.Separator>

const ContextMenuSeparator = React.forwardRef<ContextMenuSeparatorElement, IContextMenu.ISeparatorProps>(
  (props: IContextMenu.IScoped<IContextMenu.ISeparatorProps>, forwardedRef) => {
    const { __scopeContextMenu, ...separatorProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.Separator {...menuScope} {...separatorProps} ref={forwardedRef} />
  },
)

ContextMenuSeparator.displayName = SEPARATOR_NAME

export { ContextMenuSeparator }

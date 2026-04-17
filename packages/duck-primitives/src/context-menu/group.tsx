import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const GROUP_NAME = 'ContextMenuGroup'

type ContextMenuGroupElement = React.ComponentRef<typeof MenuPrimitive.Group>

const ContextMenuGroup = React.forwardRef<ContextMenuGroupElement, IContextMenu.IGroupProps>(
  (props: IContextMenu.IScoped<IContextMenu.IGroupProps>, forwardedRef) => {
    const { __scopeContextMenu, ...groupProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />
  },
)

ContextMenuGroup.displayName = GROUP_NAME

export { ContextMenuGroup }

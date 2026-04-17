import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './context-menu'
import type { IContextMenu } from './context-menu.types'

const SUB_TRIGGER_NAME = 'ContextMenuSubTrigger'

type ContextMenuSubTriggerElement = React.ComponentRef<typeof MenuPrimitive.SubTrigger>

const ContextMenuSubTrigger = React.forwardRef<ContextMenuSubTriggerElement, IContextMenu.ISubTriggerProps>(
  (props: IContextMenu.IScoped<IContextMenu.ISubTriggerProps>, forwardedRef) => {
    const { __scopeContextMenu, ...subTriggerProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return (
      <MenuPrimitive.SubTrigger
        data-slot="context-menu-subtrigger"
        {...menuScope}
        {...subTriggerProps}
        ref={forwardedRef}
      />
    )
  },
)

ContextMenuSubTrigger.displayName = SUB_TRIGGER_NAME

export { ContextMenuSubTrigger }

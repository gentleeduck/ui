import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './dropdown-menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const SUB_TRIGGER_NAME = 'DropdownMenuSubTrigger'

type DropdownMenuSubTriggerElement = React.ComponentRef<typeof MenuPrimitive.SubTrigger>

const DropdownMenuSubTrigger = React.forwardRef<DropdownMenuSubTriggerElement, IDropdownMenu.ISubTriggerProps>(
  (props: IDropdownMenu.IScoped<IDropdownMenu.ISubTriggerProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...subTriggerProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return (
      <MenuPrimitive.SubTrigger
        data-slot="dropdown-menu-subtrigger"
        {...menuScope}
        {...subTriggerProps}
        ref={forwardedRef}
      />
    )
  },
)

DropdownMenuSubTrigger.displayName = SUB_TRIGGER_NAME

export { DropdownMenuSubTrigger }

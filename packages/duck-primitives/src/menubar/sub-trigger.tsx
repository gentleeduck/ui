import * as React from 'react'
import * as MenuPrimitive from '../menu'
import { useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const SUB_TRIGGER_NAME = 'MenubarSubTrigger'

type MenubarSubTriggerElement = React.ComponentRef<typeof MenuPrimitive.SubTrigger>

const MenubarSubTrigger = React.forwardRef<MenubarSubTriggerElement, IMenubar.ISubTriggerProps>(
  (props: IMenubar.IScoped<IMenubar.ISubTriggerProps>, forwardedRef) => {
    const { __scopeMenubar, ...subTriggerProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return (
      <MenuPrimitive.SubTrigger data-slot="menubar-subtrigger" {...menuScope} {...subTriggerProps} ref={forwardedRef} />
    )
  },
)

MenubarSubTrigger.displayName = SUB_TRIGGER_NAME

export { MenubarSubTrigger }

/** MenubarSubTrigger opens a nested submenu on hover or keyboard interaction. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const SUB_TRIGGER_NAME = 'MenubarSubTrigger'

type MenubarSubTriggerElement = React.ComponentRef<typeof MenuPrimitive.SubTrigger>
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>
interface IMenubarSubTriggerProps extends MenuSubTriggerProps {}

const MenubarSubTrigger = React.forwardRef<MenubarSubTriggerElement, IMenubarSubTriggerProps>(
  (props: ScopedProps<IMenubarSubTriggerProps>, forwardedRef) => {
    const { __scopeMenubar, ...subTriggerProps } = props
    const menuScope = useMenuScope(__scopeMenubar)
    return (
      <MenuPrimitive.SubTrigger data-slot="menubar-subtrigger" {...menuScope} {...subTriggerProps} ref={forwardedRef} />
    )
  },
)

MenubarSubTrigger.displayName = SUB_TRIGGER_NAME

export type { IMenubarSubTriggerProps }
export { MenubarSubTrigger }

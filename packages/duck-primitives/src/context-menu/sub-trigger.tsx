/** ContextMenuSubTrigger -- trigger that opens a nested submenu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const SUB_TRIGGER_NAME = 'ContextMenuSubTrigger'

type ContextMenuSubTriggerElement = React.ComponentRef<typeof MenuPrimitive.SubTrigger>
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>
interface ContextMenuSubTriggerProps extends MenuSubTriggerProps {}

const ContextMenuSubTrigger = React.forwardRef<ContextMenuSubTriggerElement, ContextMenuSubTriggerProps>(
  (props: ScopedProps<ContextMenuSubTriggerProps>, forwardedRef) => {
    const { __scopeContextMenu, ...triggerItemProps } = props
    const menuScope = useMenuScope(__scopeContextMenu)
    return <MenuPrimitive.SubTrigger {...menuScope} {...triggerItemProps} ref={forwardedRef} />
  },
)

ContextMenuSubTrigger.displayName = SUB_TRIGGER_NAME

export { ContextMenuSubTrigger }
export type { ContextMenuSubTriggerProps }

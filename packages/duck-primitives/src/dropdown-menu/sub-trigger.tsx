/** DropdownMenuSubTrigger -- trigger that opens a nested submenu. */
import * as React from 'react'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const SUB_TRIGGER_NAME = 'DropdownMenuSubTrigger'

type DropdownMenuSubTriggerElement = React.ComponentRef<typeof MenuPrimitive.SubTrigger>
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>
interface IDropdownMenuSubTriggerProps extends MenuSubTriggerProps {}

const DropdownMenuSubTrigger = React.forwardRef<DropdownMenuSubTriggerElement, IDropdownMenuSubTriggerProps>(
  (props: ScopedProps<IDropdownMenuSubTriggerProps>, forwardedRef) => {
    const { __scopeDropdownMenu, ...subTriggerProps } = props
    const menuScope = useMenuScope(__scopeDropdownMenu)
    return <MenuPrimitive.SubTrigger {...menuScope} {...subTriggerProps} ref={forwardedRef} />
  },
)

DropdownMenuSubTrigger.displayName = SUB_TRIGGER_NAME

export type { IDropdownMenuSubTriggerProps }
export { DropdownMenuSubTrigger }

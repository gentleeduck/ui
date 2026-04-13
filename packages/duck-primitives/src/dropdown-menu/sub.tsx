/** DropdownMenuSub -- manages open state for a nested submenu. */
import type * as React from 'react'
import { useControllableState } from '../hooks/use-controllable-state'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './dropdown-menu'
import { useMenuScope } from './dropdown-menu'

const SUB_NAME = 'DropdownMenuSub'

interface IDropdownMenuSubProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
}

const DropdownMenuSub: React.FC<IDropdownMenuSubProps> = (props: ScopedProps<IDropdownMenuSubProps>) => {
  const { __scopeDropdownMenu, children, onOpenChange, open: openProp, defaultOpen } = props
  const menuScope = useMenuScope(__scopeDropdownMenu)
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: SUB_NAME,
  })

  return (
    <MenuPrimitive.Sub {...menuScope} open={open} onOpenChange={setOpen}>
      {children}
    </MenuPrimitive.Sub>
  )
}

DropdownMenuSub.displayName = SUB_NAME

export type { IDropdownMenuSubProps }
export { DropdownMenuSub }

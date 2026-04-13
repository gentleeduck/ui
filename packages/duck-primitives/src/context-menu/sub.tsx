/** ContextMenuSub -- manages open state for a nested submenu. */
import type * as React from 'react'
import { useControllableState } from '../hooks/use-controllable-state'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './context-menu'
import { useMenuScope } from './context-menu'

const SUB_NAME = 'ContextMenuSub'

interface IContextMenuSubProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
}

const ContextMenuSub: React.FC<IContextMenuSubProps> = (props: ScopedProps<IContextMenuSubProps>) => {
  const { __scopeContextMenu, children, onOpenChange, open: openProp, defaultOpen } = props
  const menuScope = useMenuScope(__scopeContextMenu)
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

ContextMenuSub.displayName = SUB_NAME

export type { IContextMenuSubProps }
export { ContextMenuSub }

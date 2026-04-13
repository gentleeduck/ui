/** MenubarSub manages open state for a nested submenu. */
import type * as React from 'react'
import { useControllableState } from '../hooks/use-controllable-state'
import * as MenuPrimitive from '../menu'
import type { ScopedProps } from './menubar'
import { useMenuScope } from './menubar'

const SUB_NAME = 'MenubarSub'

interface IMenubarSubProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
}

const MenubarSub: React.FC<IMenubarSubProps> = (props: ScopedProps<IMenubarSubProps>) => {
  const { __scopeMenubar, children, open: openProp, onOpenChange, defaultOpen } = props
  const menuScope = useMenuScope(__scopeMenubar)
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

MenubarSub.displayName = SUB_NAME

export type { IMenubarSubProps }
export { MenubarSub }

/** Root ContextMenu component, scope factory, and shared context. */
import * as React from 'react'
import { useCallbackRef } from '../hooks/use-callback-ref'
import type { Direction } from '../hooks/direction'
import { useDirection } from '../hooks/direction'
import { createContextScope, type Scope } from '../libs/create-context'
import * as MenuPrimitive from '../menu'
import { createMenuScope } from '../menu'

const CONTEXT_MENU_NAME = 'ContextMenu'

type ScopedProps<P> = P & { __scopeContextMenu?: Scope }
const [createContextMenuContext, createContextMenuScope] = createContextScope(CONTEXT_MENU_NAME, [createMenuScope])
const useMenuScope = createMenuScope()

type ContextMenuContextValue = {
  open: boolean
  onOpenChange(open: boolean): void
  dir: Direction
  modal: boolean
}

const [ContextMenuProvider, useContextMenuContext] =
  createContextMenuContext<ContextMenuContextValue>(CONTEXT_MENU_NAME)

interface ContextMenuProps {
  children?: React.ReactNode
  onOpenChange?(open: boolean): void
  dir?: Direction
  modal?: boolean
}

const ContextMenu: React.FC<ContextMenuProps> = (props: ScopedProps<ContextMenuProps>) => {
  const { __scopeContextMenu, children, onOpenChange, dir, modal = true } = props
  const direction = useDirection(dir)
  const [open, setOpen] = React.useState(false)
  const menuScope = useMenuScope(__scopeContextMenu)
  const handleOpenChangeProp = useCallbackRef(onOpenChange)

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open)
      handleOpenChangeProp(open)
    },
    [handleOpenChangeProp],
  )

  return (
    <ContextMenuProvider
      scope={__scopeContextMenu}
      open={open}
      onOpenChange={handleOpenChange}
      dir={direction}
      modal={modal}>
      <MenuPrimitive.Root {...menuScope} dir={direction} open={open} onOpenChange={handleOpenChange} modal={modal}>
        {children}
      </MenuPrimitive.Root>
    </ContextMenuProvider>
  )
}

ContextMenu.displayName = CONTEXT_MENU_NAME

export {
  CONTEXT_MENU_NAME,
  createContextMenuScope,
  useMenuScope,
  ContextMenuProvider,
  useContextMenuContext,
  ContextMenu,
}
export type { ScopedProps, ContextMenuProps, ContextMenuContextValue, Direction }

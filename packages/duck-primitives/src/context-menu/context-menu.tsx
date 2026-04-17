/** Root ContextMenu component, scope factory, and shared context. */
import * as React from 'react'
import type { IDirection } from '../direction'
import { useDirection } from '../direction'
import { useCallbackRef } from '../hooks/use-callback-ref'
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
  dir: IDirection.Kind
  modal: boolean
}

const [ContextMenuProvider, useContextMenuContext] =
  createContextMenuContext<ContextMenuContextValue>(CONTEXT_MENU_NAME)

interface IContextMenuProps {
  children?: React.ReactNode
  onOpenChange?(open: boolean): void
  dir?: IDirection.Kind
  modal?: boolean
}

const ContextMenu: React.FC<IContextMenuProps> = (props: ScopedProps<IContextMenuProps>) => {
  const { __scopeContextMenu, children, onOpenChange, dir, modal = true } = props
  const direction = useDirection(dir)
  const [open, setOpen] = React.useState(false)
  const menuScope = useMenuScope(__scopeContextMenu)
  const handleOpenChangeProp = useCallbackRef(onOpenChange)
  const skipNextOpenRef = React.useRef(false)

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next && skipNextOpenRef.current) {
        // A close just happened in this frame (DismissableLayer pointerdown),
        // skip the immediate reopen from the contextmenu event.
        skipNextOpenRef.current = false
        return
      }
      setOpen(next)
      handleOpenChangeProp(next)
      if (!next) {
        skipNextOpenRef.current = true
        requestAnimationFrame(() => {
          skipNextOpenRef.current = false
        })
      }
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

export type { ContextMenuContextValue, IContextMenuProps, IDirection, ScopedProps }
export {
  CONTEXT_MENU_NAME,
  ContextMenu,
  ContextMenuProvider,
  createContextMenuScope,
  useContextMenuContext,
  useMenuScope,
}

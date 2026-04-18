import * as React from 'react'
import { useDirection } from '../direction'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { createContextScope } from '../libs/create-context'
import * as MenuPrimitive from '../menu'
import { createMenuScope } from '../menu'
import type { IContextMenu } from './context-menu.types'

const CONTEXT_MENU_NAME = 'ContextMenu'

const [createContextMenuContext, createContextMenuScope] = createContextScope(CONTEXT_MENU_NAME, [createMenuScope])
const useMenuScope = createMenuScope()

const [ContextMenuProvider, useContextMenuContext] = createContextMenuContext<IContextMenu.IContext>(CONTEXT_MENU_NAME)

const ContextMenu: React.FC<IContextMenu.IProps> = (props: IContextMenu.IScoped<IContextMenu.IProps>) => {
  const { __scopeContextMenu, children, onOpenChange, dir, modal = true } = props
  const direction = useDirection(dir)
  const [open, setOpen] = React.useState(false)
  const menuScope = useMenuScope(__scopeContextMenu)
  const handleOpenChangeProp = useCallbackRef(onOpenChange)
  const skipNextOpenRef = React.useRef(false)

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next && skipNextOpenRef.current) {
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

export {
  CONTEXT_MENU_NAME,
  ContextMenu,
  ContextMenuProvider,
  createContextMenuScope,
  useContextMenuContext,
  useMenuScope,
}

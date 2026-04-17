import * as React from 'react'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import { createContextScope } from '../libs/create-context'
import * as MenuPrimitive from '../menu'
import { createMenuScope } from '../menu'
import type { IDropdownMenu } from './dropdown-menu.types'

const DROPDOWN_MENU_NAME = 'DropdownMenu'

const [createDropdownMenuContext, createDropdownMenuScope] = createContextScope(DROPDOWN_MENU_NAME, [createMenuScope])
const useMenuScope = createMenuScope()

const [DropdownMenuProvider, useDropdownMenuContext] =
  createDropdownMenuContext<IDropdownMenu.IContext>(DROPDOWN_MENU_NAME)

const DropdownMenu: React.FC<IDropdownMenu.IProps> = (props: IDropdownMenu.IScoped<IDropdownMenu.IProps>) => {
  const { __scopeDropdownMenu, children, dir, open: openProp, defaultOpen, onOpenChange, modal = true } = props
  const direction = useDirection(dir)
  const menuScope = useMenuScope(__scopeDropdownMenu)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DROPDOWN_MENU_NAME,
  })

  return (
    <DropdownMenuProvider
      scope={__scopeDropdownMenu}
      triggerId={useId()}
      triggerRef={triggerRef}
      contentId={useId()}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
      dir={direction}
      modal={modal}>
      <MenuPrimitive.Root {...menuScope} open={open} onOpenChange={setOpen} dir={direction} modal={modal}>
        {children}
      </MenuPrimitive.Root>
    </DropdownMenuProvider>
  )
}

DropdownMenu.displayName = DROPDOWN_MENU_NAME

export {
  createDropdownMenuScope,
  DROPDOWN_MENU_NAME,
  DropdownMenu,
  DropdownMenuProvider,
  useDropdownMenuContext,
  useMenuScope,
}

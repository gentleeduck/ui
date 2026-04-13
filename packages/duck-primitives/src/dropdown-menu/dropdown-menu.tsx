/** Root DropdownMenu component, scope factory, and shared context. */
import * as React from 'react'
import type { Direction } from '../direction'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import { createContextScope, type Scope } from '../libs/create-context'
import * as MenuPrimitive from '../menu'
import { createMenuScope } from '../menu'

const DROPDOWN_MENU_NAME = 'DropdownMenu'

type ScopedProps<P> = P & { __scopeDropdownMenu?: Scope }
const [createDropdownMenuContext, createDropdownMenuScope] = createContextScope(DROPDOWN_MENU_NAME, [createMenuScope])
const useMenuScope = createMenuScope()

type DropdownMenuContextValue = {
  triggerId: string
  triggerRef: React.RefObject<HTMLButtonElement | null>
  contentId: string
  open: boolean
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  dir: Direction
  modal: boolean
}

const [DropdownMenuProvider, useDropdownMenuContext] =
  createDropdownMenuContext<DropdownMenuContextValue>(DROPDOWN_MENU_NAME)

interface IDropdownMenuProps {
  children?: React.ReactNode
  dir?: Direction
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  modal?: boolean
}

const DropdownMenu: React.FC<IDropdownMenuProps> = (props: ScopedProps<IDropdownMenuProps>) => {
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

export type { Direction, DropdownMenuContextValue, IDropdownMenuProps, ScopedProps }
export {
  createDropdownMenuScope,
  DROPDOWN_MENU_NAME,
  DropdownMenu,
  DropdownMenuProvider,
  useDropdownMenuContext,
  useMenuScope,
}

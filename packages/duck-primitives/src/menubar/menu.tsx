/** MenubarMenu component with its context provider. */
import * as React from 'react'
import { useId } from '../hooks/use-id'
import * as MenuPrimitive from '../menu'
import type { MenubarTriggerElement, ScopedProps } from './menubar'
import { createMenubarContext, useMenubarContext, useMenuScope } from './menubar'

const MENU_NAME = 'MenubarMenu'

type MenubarMenuContextValue = {
  value: string
  triggerId: string
  triggerRef: React.RefObject<MenubarTriggerElement | null>
  contentId: string
  wasKeyboardTriggerOpenRef: React.RefObject<boolean>
}

const [MenubarMenuProvider, useMenubarMenuContext] = createMenubarContext<MenubarMenuContextValue>(MENU_NAME)

interface MenubarMenuProps {
  children?: React.ReactNode
  value?: string
}

const MenubarMenu = (props: ScopedProps<MenubarMenuProps>) => {
  const { __scopeMenubar, value: valueProp, ...menuProps } = props
  const autoValue = useId()
  // We need to provide an initial deterministic value as `useId` will return
  // empty string on the first render and we don't want to match our internal "closed" value.
  const value = valueProp || autoValue || 'LEGACY_REACT_AUTO_VALUE'
  const context = useMenubarContext(MENU_NAME, __scopeMenubar)
  const menuScope = useMenuScope(__scopeMenubar)
  const triggerRef = React.useRef<MenubarTriggerElement>(null)
  const wasKeyboardTriggerOpenRef = React.useRef(false)
  const open = context.value === value

  React.useEffect(() => {
    if (!open) wasKeyboardTriggerOpenRef.current = false
  }, [open])

  return (
    <MenubarMenuProvider
      scope={__scopeMenubar}
      value={value}
      triggerId={useId()}
      triggerRef={triggerRef}
      contentId={useId()}
      wasKeyboardTriggerOpenRef={wasKeyboardTriggerOpenRef}>
      <MenuPrimitive.Root
        {...menuScope}
        open={open}
        onOpenChange={(open) => {
          // Menu only calls `onOpenChange` when dismissing so we
          // want to close our MenuBar based on the same events.
          if (!open) context.onMenuClose()
        }}
        modal={false}
        dir={context.dir}
        {...menuProps}
      />
    </MenubarMenuProvider>
  )
}

MenubarMenu.displayName = MENU_NAME

export type { MenubarMenuContextValue, MenubarMenuProps }
export { MenubarMenu, MenubarMenuProvider, useMenubarMenuContext }

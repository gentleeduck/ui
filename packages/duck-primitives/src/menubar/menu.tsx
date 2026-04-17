import * as React from 'react'
import { useId } from '../hooks/use-id'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import * as MenuPrimitive from '../menu'
import { createMenubarContext, useMenubarContext, useMenuScope } from './menubar'
import type { IMenubar } from './menubar.types'

const MENU_NAME = 'MenubarMenu'

const [MenubarMenuProvider, useMenubarMenuContext] = createMenubarContext<IMenubar.IMenuContext>(MENU_NAME)

const MenubarMenu = (props: IMenubar.IScoped<IMenubar.IMenuProps>) => {
  const { __scopeMenubar, value: valueProp, onOpenChange: onOpenChangeProp, ...menuProps } = props
  const autoValue = useId()
  const value = valueProp || autoValue || 'LEGACY_REACT_AUTO_VALUE'
  const context = useMenubarContext(MENU_NAME, __scopeMenubar)
  const menuScope = useMenuScope(__scopeMenubar)
  const triggerRef = React.useRef<IMenubar.TriggerElement>(null)
  const wasKeyboardTriggerOpenRef = React.useRef(false)
  const open = context.value === value

  React.useEffect(() => {
    if (!open) wasKeyboardTriggerOpenRef.current = false
  }, [open])

  useLayoutEffect(() => {
    onOpenChangeProp?.(open)
  }, [open, onOpenChangeProp])

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

export { MenubarMenu, MenubarMenuProvider, useMenubarMenuContext }

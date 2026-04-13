/** MenuSub component - a nested submenu container. */
import * as React from 'react'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { useId } from '../hooks/use-id'
import * as PopperPrimitive from '../popper'

import {
  createMenuContext,
  type MenuContentElement,
  MenuProvider,
  type ScopedProps,
  useMenuContext,
  usePopperScope,
} from './menu'

const SUB_NAME = 'MenuSub'

type MenuSubTriggerElement = React.ComponentRef<typeof import('../primitive-elements').Primitive.div>

type MenuSubContextValue = {
  contentId: string
  triggerId: string
  trigger: MenuSubTriggerElement | null
  onTriggerChange(trigger: MenuSubTriggerElement | null): void
}

const [MenuSubProvider, useMenuSubContext] = createMenuContext<MenuSubContextValue>(SUB_NAME)

interface IMenuSubProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?(open: boolean): void
}

const MenuSub: React.FC<IMenuSubProps> = (props: ScopedProps<IMenuSubProps>) => {
  const { __scopeMenu, children, open = false, onOpenChange } = props
  const parentMenuContext = useMenuContext(SUB_NAME, __scopeMenu)
  const popperScope = usePopperScope(__scopeMenu)
  const [trigger, setTrigger] = React.useState<MenuSubTriggerElement | null>(null)
  const [content, setContent] = React.useState<MenuContentElement | null>(null)
  const handleOpenChange = useCallbackRef(onOpenChange)

  // Prevent the parent menu from reopening with open submenus.
  React.useEffect(() => {
    if (parentMenuContext.open === false) handleOpenChange(false)
    return () => handleOpenChange(false)
  }, [parentMenuContext.open, handleOpenChange])

  return (
    <PopperPrimitive.Popper {...popperScope}>
      <MenuProvider
        scope={__scopeMenu}
        open={open}
        onOpenChange={handleOpenChange}
        content={content}
        onContentChange={setContent}>
        <MenuSubProvider
          scope={__scopeMenu}
          contentId={useId()}
          triggerId={useId()}
          trigger={trigger}
          onTriggerChange={setTrigger}>
          {children}
        </MenuSubProvider>
      </MenuProvider>
    </PopperPrimitive.Popper>
  )
}

MenuSub.displayName = SUB_NAME

export type { MenuSubContextValue, IMenuSubProps, MenuSubTriggerElement }
export { MenuSub, MenuSubProvider, useMenuSubContext }

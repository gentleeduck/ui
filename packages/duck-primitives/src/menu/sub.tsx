import * as React from 'react'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { useId } from '../hooks/use-id'
import * as PopperPrimitive from '../popper'
import { createMenuContext, MenuProvider, useMenuContext, usePopperScope } from './menu'
import type { IMenu } from './menu.types'

const SUB_NAME = 'MenuSub'

const [MenuSubProvider, useMenuSubContext] = createMenuContext<IMenu.ISubContext>(SUB_NAME)

const MenuSub: React.FC<IMenu.ISubProps> = (props: IMenu.IScoped<IMenu.ISubProps>) => {
  const { __scopeMenu, children, open = false, onOpenChange } = props
  const parentMenuContext = useMenuContext(SUB_NAME, __scopeMenu)
  const popperScope = usePopperScope(__scopeMenu)
  const [trigger, setTrigger] = React.useState<IMenu.MenuSubTriggerElement | null>(null)
  const [content, setContent] = React.useState<IMenu.MenuContentElement | null>(null)
  const handleOpenChange = useCallbackRef(onOpenChange)

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

export { MenuSub, MenuSubProvider, useMenuSubContext }

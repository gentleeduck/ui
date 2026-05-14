import * as React from 'react'
import { useDirection } from '../direction'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { createCollection } from '../libs/create-collection'
import { createContextScope } from '../libs/create-context'
import * as PopperPrimitive from '../popper'
import { createPopperScope } from '../popper'
import { createRovingFocusGroupScope } from '../roving-focus'
import type { IMenu } from './menu.types'

const MENU_NAME = 'Menu'

const [Collection, useCollection, createCollectionScope] = createCollection<IMenu.MenuItemElement, IMenu.IItemData>(
  MENU_NAME,
)

const [createMenuContext, createMenuScope] = createContextScope(MENU_NAME, [
  createCollectionScope,
  createPopperScope,
  createRovingFocusGroupScope,
])
const usePopperScope = createPopperScope()
const useRovingFocusGroupScope = createRovingFocusGroupScope()

const [MenuProvider, useMenuContext] = createMenuContext<IMenu.IContext>(MENU_NAME)

const [MenuRootProvider, useMenuRootContext] = createMenuContext<IMenu.IRootContext>(MENU_NAME)

const Menu: React.FC<IMenu.IProps> = (props: IMenu.IScoped<IMenu.IProps>) => {
  const { __scopeMenu, open = false, children, dir, onOpenChange, modal = true } = props
  const popperScope = usePopperScope(__scopeMenu)
  const [content, setContent] = React.useState<IMenu.MenuContentElement | null>(null)
  const isUsingKeyboardRef = React.useRef(false)
  const handleOpenChange = useCallbackRef(onOpenChange)
  const direction = useDirection(dir)

  React.useEffect(() => {
    const handleKeyDown = () => {
      isUsingKeyboardRef.current = true
      document.addEventListener('pointerdown', handlePointer, { capture: true, once: true })
      document.addEventListener('pointermove', handlePointer, { capture: true, once: true })
    }
    const handlePointer = () => (isUsingKeyboardRef.current = false)
    document.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true })
      document.removeEventListener('pointerdown', handlePointer, { capture: true })
      document.removeEventListener('pointermove', handlePointer, { capture: true })
    }
  }, [])

  return (
    <PopperPrimitive.Root {...popperScope}>
      <MenuProvider
        scope={__scopeMenu}
        open={open}
        onOpenChange={handleOpenChange}
        content={content}
        onContentChange={setContent}>
        <MenuRootProvider
          scope={__scopeMenu}
          onClose={React.useCallback(() => handleOpenChange(false), [handleOpenChange])}
          isUsingKeyboardRef={isUsingKeyboardRef}
          dir={direction}
          modal={modal}>
          {children}
        </MenuRootProvider>
      </MenuProvider>
    </PopperPrimitive.Root>
  )
}

Menu.displayName = MENU_NAME

export {
  Collection,
  createMenuContext,
  createMenuScope,
  MENU_NAME,
  Menu,
  MenuProvider,
  MenuRootProvider,
  useCollection,
  useMenuContext,
  useMenuRootContext,
  usePopperScope,
  useRovingFocusGroupScope,
}

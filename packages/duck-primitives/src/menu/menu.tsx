/** Menu root component, contexts, collection, and scope setup. */
import * as React from 'react'
import { useDirection } from '../direction'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { createCollection } from '../libs/create-collection'
import { createContextScope, type Scope } from '../libs/create-context'
import * as PopperPrimitive from '../popper'
import { createPopperScope } from '../popper'
import { createRovingFocusGroupScope } from '../roving-focus'

import type { IDirection } from './menu.libs'

const MENU_NAME = 'Menu'

type ItemData = { disabled: boolean; textValue: string }
const [Collection, useCollection, createCollectionScope] = createCollection<MenuItemElement, ItemData>(MENU_NAME)

type ScopedProps<P> = P & { __scopeMenu?: Scope }
const [createMenuContext, createMenuScope] = createContextScope(MENU_NAME, [
  createCollectionScope,
  createPopperScope,
  createRovingFocusGroupScope,
])
const usePopperScope = createPopperScope()
const useRovingFocusGroupScope = createRovingFocusGroupScope()

type MenuContextValue = {
  open: boolean
  onOpenChange(open: boolean): void
  content: MenuContentElement | null
  onContentChange(content: MenuContentElement | null): void
}

const [MenuProvider, useMenuContext] = createMenuContext<MenuContextValue>(MENU_NAME)

type MenuRootContextValue = {
  onClose(): void
  isUsingKeyboardRef: React.RefObject<boolean>
  dir: IDirection.Kind
  modal: boolean
}

const [MenuRootProvider, useMenuRootContext] = createMenuContext<MenuRootContextValue>(MENU_NAME)

interface IMenuProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?(open: boolean): void
  dir?: IDirection.Kind
  modal?: boolean
}

const Menu: React.FC<IMenuProps> = (props: ScopedProps<IMenuProps>) => {
  const { __scopeMenu, open = false, children, dir, onOpenChange, modal = true } = props
  const popperScope = usePopperScope(__scopeMenu)
  const [content, setContent] = React.useState<MenuContentElement | null>(null)
  const isUsingKeyboardRef = React.useRef(false)
  const handleOpenChange = useCallbackRef(onOpenChange)
  const direction = useDirection(dir)

  React.useEffect(() => {
    // Capture phase ensures we set the boolean before any side effects execute
    // in response to the key or pointer event as they might depend on this value.
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

// NOTE: MenuContentElement and MenuItemElement are used in context types above.
// They are defined as opaque references to the underlying DOM element types that
// the content and item components will produce. We re-declare them here so the
// root module can reference them without circular imports.
type MenuContentElement = React.ComponentRef<typeof PopperPrimitive.Content>
type MenuItemElement = React.ComponentRef<typeof import('../primitive-elements').Primitive.div>

export type {
  IDirection,
  IMenuProps,
  ItemData,
  MenuContentElement,
  MenuContextValue,
  MenuItemElement,
  MenuRootContextValue,
  ScopedProps,
}
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

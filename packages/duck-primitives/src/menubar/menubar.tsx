import * as React from 'react'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { createCollection } from '../libs/create-collection'
import { createContextScope } from '../libs/create-context'
import { wrapArray } from '../libs/shared-utils'
import { createMenuScope } from '../menu'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import { createRovingFocusGroupScope } from '../roving-focus'
import type { IMenubar } from './menubar.types'

const MENUBAR_NAME = 'Menubar'

const [Collection, useCollection, createCollectionScope] = createCollection<
  IMenubar.TriggerElement,
  IMenubar.IItemData
>(MENUBAR_NAME)

const [createMenubarContext, createMenubarScope] = createContextScope(MENUBAR_NAME, [
  createCollectionScope,
  createRovingFocusGroupScope,
])

const useMenuScope = createMenuScope()
const useRovingFocusGroupScope = createRovingFocusGroupScope()

const [MenubarContextProvider, useMenubarContext] = createMenubarContext<IMenubar.IContext>(MENUBAR_NAME)

type MenubarElement = React.ComponentRef<typeof Primitive.div>

const Menubar = React.forwardRef<MenubarElement, IMenubar.IProps>(
  (props: IMenubar.IScoped<IMenubar.IProps>, forwardedRef) => {
    const { __scopeMenubar, value: valueProp, onValueChange, defaultValue, loop = true, dir, ...menubarProps } = props
    const direction = useDirection(dir)
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar)
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? '',
      caller: MENUBAR_NAME,
    })

    const [currentTabStopId, setCurrentTabStopId] = React.useState<string | null>(null)

    return (
      <MenubarContextProvider
        scope={__scopeMenubar}
        value={value}
        onMenuOpen={React.useCallback(
          (value) => {
            setValue(value)
            setCurrentTabStopId(value)
          },
          [setValue],
        )}
        onMenuClose={React.useCallback(() => setValue(''), [setValue])}
        onMenuToggle={React.useCallback(
          (value) => {
            setValue((prevValue) => (prevValue ? '' : value))
            setCurrentTabStopId(value)
          },
          [setValue],
        )}
        dir={direction}
        loop={loop}>
        <Collection.Provider scope={__scopeMenubar}>
          <Collection.Slot scope={__scopeMenubar}>
            <RovingFocusGroup.Root
              asChild
              {...rovingFocusGroupScope}
              orientation="horizontal"
              loop={loop}
              dir={direction}
              currentTabStopId={currentTabStopId}
              onCurrentTabStopIdChange={setCurrentTabStopId}>
              <Primitive.div data-slot="menubar" role="menubar" {...menubarProps} ref={forwardedRef} />
            </RovingFocusGroup.Root>
          </Collection.Slot>
        </Collection.Provider>
      </MenubarContextProvider>
    )
  },
)

Menubar.displayName = MENUBAR_NAME

export {
  Collection,
  createMenubarContext,
  createMenubarScope,
  MENUBAR_NAME,
  Menubar,
  MenubarContextProvider,
  useCollection,
  useMenubarContext,
  useMenuScope,
  useRovingFocusGroupScope,
  wrapArray,
}

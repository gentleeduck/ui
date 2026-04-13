/** Root Menubar component with collection, context, and scope setup. */
import * as React from 'react'
import type { Direction } from '../direction'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { createCollection } from '../libs/create-collection'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { wrapArray } from '../libs/shared-utils'
import { createMenuScope } from '../menu'
import { Primitive } from '../primitive-elements'
import * as RovingFocusGroup from '../roving-focus'
import { createRovingFocusGroupScope } from '../roving-focus'

const MENUBAR_NAME = 'Menubar'

type MenubarTriggerElement = React.ComponentRef<typeof Primitive.button>
type ItemData = { value: string; disabled: boolean }
const [Collection, useCollection, createCollectionScope] = createCollection<MenubarTriggerElement, ItemData>(
  MENUBAR_NAME,
)

type ScopedProps<P> = P & { __scopeMenubar?: Scope }
const [createMenubarContext, createMenubarScope] = createContextScope(MENUBAR_NAME, [
  createCollectionScope,
  createRovingFocusGroupScope,
])

const useMenuScope = createMenuScope()
const useRovingFocusGroupScope = createRovingFocusGroupScope()

type MenubarContextValue = {
  value: string
  dir: Direction
  loop: boolean
  onMenuOpen(value: string): void
  onMenuClose(): void
  onMenuToggle(value: string): void
}

const [MenubarContextProvider, useMenubarContext] = createMenubarContext<MenubarContextValue>(MENUBAR_NAME)

type MenubarElement = React.ComponentRef<typeof Primitive.div>
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface IMenubarProps extends PrimitiveDivProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  loop?: RovingFocusGroupProps['loop']
  dir?: RovingFocusGroupProps['dir']
}

const Menubar = React.forwardRef<MenubarElement, IMenubarProps>((props: ScopedProps<IMenubarProps>, forwardedRef) => {
  const { __scopeMenubar, value: valueProp, onValueChange, defaultValue, loop = true, dir, ...menubarProps } = props
  const direction = useDirection(dir)
  const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar)
  const [value, setValue] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
    defaultProp: defaultValue ?? '',
    caller: MENUBAR_NAME,
  })

  // We need to manage tab stop id manually as `RovingFocusGroup` updates the stop
  // based on focus, and in some situations our triggers won't ever be given focus
  // (e.g. click to open and then outside to close)
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
          // `openMenuOpen` and `onMenuToggle` are called exclusively so we
          // need to update the id in either case.
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
})

Menubar.displayName = MENUBAR_NAME

export type { Direction, IMenubarProps, MenubarTriggerElement, ScopedProps }
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

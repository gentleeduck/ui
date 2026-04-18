import * as React from 'react'
import { useDirection } from '../direction'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import { usePrevious } from '../hooks/use-previous'
import { useComposedRefs } from '../libs/compose-ref'
import { createCollection } from '../libs/create-collection'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import type { INavigationMenu } from './navigation-menu.types'

const NAVIGATION_MENU_NAME = 'NavigationMenu'

const [Collection, useCollection, createCollectionScope] = createCollection<
  INavigationMenu.NavigationMenuTriggerElement,
  { value: string }
>(NAVIGATION_MENU_NAME)

const [FocusGroupCollection, useFocusGroupCollection, createFocusGroupCollectionScope] = createCollection<
  INavigationMenu.FocusGroupItemElement,
  {}
>(NAVIGATION_MENU_NAME)

const [createNavigationMenuContext, createNavigationMenuScope] = createContextScope(NAVIGATION_MENU_NAME, [
  createCollectionScope,
  createFocusGroupCollectionScope,
])

const [NavigationMenuProviderImpl, useNavigationMenuContext] =
  createNavigationMenuContext<INavigationMenu.IContext>(NAVIGATION_MENU_NAME)

const [ViewportContentProvider, useViewportContentContext] = createNavigationMenuContext<{
  items: Map<string, INavigationMenu.IContentData>
}>(NAVIGATION_MENU_NAME)

const [NavigationMenuItemContextProvider, useNavigationMenuItemContext] =
  createNavigationMenuContext<INavigationMenu.IItemContext>('NavigationMenuItem')

const NavigationMenu = React.forwardRef<INavigationMenu.NavigationMenuElement, INavigationMenu.IProps>(
  (props: INavigationMenu.IScoped<INavigationMenu.IProps>, forwardedRef) => {
    const {
      __scopeNavigationMenu,
      value: valueProp,
      onValueChange,
      defaultValue,
      delayDuration = 200,
      skipDelayDuration = 300,
      orientation = 'horizontal',
      dir,
      ...NavigationMenuProps
    } = props
    const [navigationMenu, setNavigationMenu] = React.useState<INavigationMenu.NavigationMenuElement | null>(null)
    const composedRef = useComposedRefs(forwardedRef, (node) => setNavigationMenu(node))
    const direction = useDirection(dir)
    const openTimerRef = React.useRef(0)
    const closeTimerRef = React.useRef(0)
    const skipDelayTimerRef = React.useRef(0)
    const [isOpenDelayed, setIsOpenDelayed] = React.useState(true)
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: (value) => {
        const isOpen = value !== ''
        const hasSkipDelayDuration = skipDelayDuration > 0

        if (isOpen) {
          window.clearTimeout(skipDelayTimerRef.current)
          if (hasSkipDelayDuration) setIsOpenDelayed(false)
        } else {
          window.clearTimeout(skipDelayTimerRef.current)
          skipDelayTimerRef.current = window.setTimeout(() => setIsOpenDelayed(true), skipDelayDuration)
        }

        onValueChange?.(value)
      },
      defaultProp: defaultValue ?? '',
      caller: NAVIGATION_MENU_NAME,
    })

    const startCloseTimer = React.useCallback(() => {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = window.setTimeout(() => setValue(''), 150)
    }, [setValue])

    const handleOpen = React.useCallback(
      (itemValue: string) => {
        window.clearTimeout(closeTimerRef.current)
        setValue(itemValue)
      },
      [setValue],
    )

    const handleDelayedOpen = React.useCallback(
      (itemValue: string) => {
        const isOpenItem = value === itemValue
        if (isOpenItem) {
          window.clearTimeout(closeTimerRef.current)
        } else {
          openTimerRef.current = window.setTimeout(() => {
            window.clearTimeout(closeTimerRef.current)
            setValue(itemValue)
          }, delayDuration)
        }
      },
      [value, setValue, delayDuration],
    )

    React.useEffect(() => {
      return () => {
        window.clearTimeout(openTimerRef.current)
        window.clearTimeout(closeTimerRef.current)
        window.clearTimeout(skipDelayTimerRef.current)
      }
    }, [])

    return (
      <NavigationMenuProvider
        scope={__scopeNavigationMenu}
        isRootMenu={true}
        value={value}
        dir={direction}
        orientation={orientation}
        rootNavigationMenu={navigationMenu}
        onTriggerEnter={(itemValue) => {
          window.clearTimeout(openTimerRef.current)
          if (isOpenDelayed) handleDelayedOpen(itemValue)
          else handleOpen(itemValue)
        }}
        onTriggerLeave={() => {
          window.clearTimeout(openTimerRef.current)
          startCloseTimer()
        }}
        onContentEnter={() => window.clearTimeout(closeTimerRef.current)}
        onContentLeave={startCloseTimer}
        onItemSelect={(itemValue) => {
          setValue((prevValue) => (prevValue === itemValue ? '' : itemValue))
        }}
        onItemDismiss={() => setValue('')}>
        <Primitive.nav
          data-slot="navigation-menu"
          aria-label="Main"
          data-orientation={orientation}
          dir={direction}
          {...NavigationMenuProps}
          ref={composedRef}
        />
      </NavigationMenuProvider>
    )
  },
)

NavigationMenu.displayName = NAVIGATION_MENU_NAME

const SUB_NAME = 'NavigationMenuSub'

type NavigationMenuSubElement = React.ComponentRef<typeof Primitive.div>

const NavigationMenuSub = React.forwardRef<NavigationMenuSubElement, INavigationMenu.ISubProps>(
  (props: INavigationMenu.IScoped<INavigationMenu.ISubProps>, forwardedRef) => {
    const {
      __scopeNavigationMenu,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = 'horizontal',
      ...subProps
    } = props
    const context = useNavigationMenuContext(SUB_NAME, __scopeNavigationMenu)
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? '',
      caller: SUB_NAME,
    })

    return (
      <NavigationMenuProvider
        scope={__scopeNavigationMenu}
        isRootMenu={false}
        value={value}
        dir={context.dir}
        orientation={orientation}
        rootNavigationMenu={context.rootNavigationMenu}
        onTriggerEnter={(itemValue) => setValue(itemValue)}
        onItemSelect={(itemValue) => setValue(itemValue)}
        onItemDismiss={() => setValue('')}>
        <Primitive.div
          data-slot="navigation-menu-sub"
          data-orientation={orientation}
          {...subProps}
          ref={forwardedRef}
        />
      </NavigationMenuProvider>
    )
  },
)

NavigationMenuSub.displayName = SUB_NAME

const NavigationMenuProvider: React.FC<INavigationMenu.IProviderProps> = (
  props: INavigationMenu.IScoped<INavigationMenu.IProviderProps>,
) => {
  const {
    scope,
    isRootMenu,
    rootNavigationMenu,
    dir,
    orientation,
    children,
    value,
    onItemSelect,
    onItemDismiss,
    onTriggerEnter,
    onTriggerLeave,
    onContentEnter,
    onContentLeave,
  } = props
  const [viewport, setViewport] = React.useState<INavigationMenu.NavigationMenuViewportElement | null>(null)
  const [viewportContent, setViewportContent] = React.useState<Map<string, INavigationMenu.IContentData>>(new Map())
  const [indicatorTrack, setIndicatorTrack] = React.useState<HTMLDivElement | null>(null)

  return (
    <NavigationMenuProviderImpl
      scope={scope}
      isRootMenu={isRootMenu}
      rootNavigationMenu={rootNavigationMenu}
      value={value}
      previousValue={usePrevious(value)}
      baseId={useId()}
      dir={dir}
      orientation={orientation}
      viewport={viewport}
      onViewportChange={setViewport}
      indicatorTrack={indicatorTrack}
      onIndicatorTrackChange={setIndicatorTrack}
      onTriggerEnter={useCallbackRef(onTriggerEnter)}
      onTriggerLeave={useCallbackRef(onTriggerLeave)}
      onContentEnter={useCallbackRef(onContentEnter)}
      onContentLeave={useCallbackRef(onContentLeave)}
      onItemSelect={useCallbackRef(onItemSelect)}
      onItemDismiss={useCallbackRef(onItemDismiss)}
      onViewportContentChange={React.useCallback((contentValue, contentData) => {
        setViewportContent((prevContent) => {
          prevContent.set(contentValue, contentData)
          return new Map(prevContent)
        })
      }, [])}
      onViewportContentRemove={React.useCallback((contentValue) => {
        setViewportContent((prevContent) => {
          if (!prevContent.has(contentValue)) return prevContent
          prevContent.delete(contentValue)
          return new Map(prevContent)
        })
      }, [])}>
      <Collection.Provider scope={scope}>
        <ViewportContentProvider scope={scope} items={viewportContent}>
          {children}
        </ViewportContentProvider>
      </Collection.Provider>
    </NavigationMenuProviderImpl>
  )
}

export {
  Collection,
  createNavigationMenuContext,
  createNavigationMenuScope,
  FocusGroupCollection,
  NAVIGATION_MENU_NAME,
  NavigationMenu,
  NavigationMenuItemContextProvider,
  NavigationMenuSub,
  useCollection,
  useFocusGroupCollection,
  useNavigationMenuContext,
  useNavigationMenuItemContext,
  useViewportContentContext,
}

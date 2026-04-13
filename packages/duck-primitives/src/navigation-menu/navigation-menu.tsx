import * as React from 'react'
import { useDirection } from '../direction'
import type { DismissableLayer } from '../dismissable-layer'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import { usePrevious } from '../hooks/use-previous'
import { useComposedRefs } from '../libs/compose-ref'
import { createCollection } from '../libs/create-collection'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import type * as VisuallyHiddenPrimitive from '../visibility-hidden'

type Orientation = 'vertical' | 'horizontal'
type Direction = 'ltr' | 'rtl'

const NAVIGATION_MENU_NAME = 'NavigationMenu'

type NavigationMenuTriggerElement = React.ComponentRef<typeof Primitive.button>
type FocusGroupItemElement = React.ComponentRef<typeof Primitive.button>

const [Collection, useCollection, createCollectionScope] = createCollection<
  NavigationMenuTriggerElement,
  { value: string }
>(NAVIGATION_MENU_NAME)

const [FocusGroupCollection, useFocusGroupCollection, createFocusGroupCollectionScope] = createCollection<
  FocusGroupItemElement,
  {}
>(NAVIGATION_MENU_NAME)

type ScopedProps<P> = P & { __scopeNavigationMenu?: Scope }
const [createNavigationMenuContext, createNavigationMenuScope] = createContextScope(NAVIGATION_MENU_NAME, [
  createCollectionScope,
  createFocusGroupCollectionScope,
])

/* ----- Shared element types ----- */

type NavigationMenuElement = React.ComponentRef<typeof Primitive.nav>
type NavigationMenuContentImplElement = React.ComponentRef<typeof DismissableLayer>
type NavigationMenuViewportElement = React.ComponentRef<typeof Primitive.div>
type FocusProxyElement = React.ComponentRef<typeof VisuallyHiddenPrimitive.Root>

/* ----- Content-related types (shared by content.tsx and viewport.tsx) ----- */

type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>

interface INavigationMenuContentImplPrivateProps {
  value: string
  triggerRef: React.RefObject<NavigationMenuTriggerElement | null>
  focusProxyRef: React.RefObject<FocusProxyElement | null>
  wasEscapeCloseRef: React.RefObject<boolean>
  onContentFocusOutside(): void
  onRootContentClose(): void
}

interface INavigationMenuContentImplProps
  extends Omit<DismissableLayerProps, 'onDismiss' | 'disableOutsidePointerEvents'>,
    INavigationMenuContentImplPrivateProps {}

type ViewportContentMounterElement = NavigationMenuContentImplElement
interface IViewportContentMounterProps extends INavigationMenuContentImplProps {
  forceMount?: true
}

type ContentData = {
  ref?: React.Ref<ViewportContentMounterElement>
} & IViewportContentMounterProps

/* ----- Contexts ----- */

type NavigationMenuContextValue = {
  isRootMenu: boolean
  value: string
  previousValue: string
  baseId: string
  dir: Direction
  orientation: Orientation
  rootNavigationMenu: NavigationMenuElement | null
  indicatorTrack: HTMLDivElement | null
  onIndicatorTrackChange(indicatorTrack: HTMLDivElement | null): void
  viewport: NavigationMenuViewportElement | null
  onViewportChange(viewport: NavigationMenuViewportElement | null): void
  onViewportContentChange(contentValue: string, contentData: ContentData): void
  onViewportContentRemove(contentValue: string): void
  onTriggerEnter(itemValue: string): void
  onTriggerLeave(): void
  onContentEnter(): void
  onContentLeave(): void
  onItemSelect(itemValue: string): void
  onItemDismiss(): void
}

const [NavigationMenuProviderImpl, useNavigationMenuContext] =
  createNavigationMenuContext<NavigationMenuContextValue>(NAVIGATION_MENU_NAME)

const [ViewportContentProvider, useViewportContentContext] = createNavigationMenuContext<{
  items: Map<string, ContentData>
}>(NAVIGATION_MENU_NAME)

type NavigationMenuItemContextValue = {
  value: string
  triggerRef: React.RefObject<NavigationMenuTriggerElement | null>
  contentRef: React.RefObject<NavigationMenuContentImplElement | null>
  focusProxyRef: React.RefObject<FocusProxyElement | null>
  wasEscapeCloseRef: React.RefObject<boolean>
  onEntryKeyDown(): void
  onFocusProxyEnter(side: 'start' | 'end'): void
  onRootContentClose(): void
  onContentFocusOutside(): void
}

const [NavigationMenuItemContextProvider, useNavigationMenuItemContext] =
  createNavigationMenuContext<NavigationMenuItemContextValue>('NavigationMenuItem')

/* ----- NavigationMenu ----- */

type PrimitiveNavProps = React.ComponentPropsWithoutRef<typeof Primitive.nav>
interface INavigationMenuProps
  extends Omit<INavigationMenuProviderProps, keyof INavigationMenuProviderPrivateProps>,
    PrimitiveNavProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  dir?: Direction
  orientation?: Orientation
  delayDuration?: number
  skipDelayDuration?: number
}

const NavigationMenu = React.forwardRef<NavigationMenuElement, INavigationMenuProps>(
  (props: ScopedProps<INavigationMenuProps>, forwardedRef) => {
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
    const [navigationMenu, setNavigationMenu] = React.useState<NavigationMenuElement | null>(null)
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

/* ----- NavigationMenuSub ----- */

const SUB_NAME = 'NavigationMenuSub'

type NavigationMenuSubElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
interface INavigationMenuSubProps
  extends Omit<INavigationMenuProviderProps, keyof INavigationMenuProviderPrivateProps>,
    PrimitiveDivProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: Orientation
}

const NavigationMenuSub = React.forwardRef<NavigationMenuSubElement, INavigationMenuSubProps>(
  (props: ScopedProps<INavigationMenuSubProps>, forwardedRef) => {
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

/* ----- NavigationMenuProvider (internal) ----- */

interface INavigationMenuProviderPrivateProps {
  isRootMenu: boolean
  scope: Scope
  children: React.ReactNode
  orientation: Orientation
  dir: Direction
  rootNavigationMenu: NavigationMenuElement | null
  value: string
  onTriggerEnter(itemValue: string): void
  onTriggerLeave?(): void
  onContentEnter?(): void
  onContentLeave?(): void
  onItemSelect(itemValue: string): void
  onItemDismiss(): void
}

interface INavigationMenuProviderProps extends INavigationMenuProviderPrivateProps {}

const NavigationMenuProvider: React.FC<INavigationMenuProviderProps> = (
  props: ScopedProps<INavigationMenuProviderProps>,
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
  const [viewport, setViewport] = React.useState<NavigationMenuViewportElement | null>(null)
  const [viewportContent, setViewportContent] = React.useState<Map<string, ContentData>>(new Map())
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

export type {
  ContentData,
  Direction,
  FocusGroupItemElement,
  FocusProxyElement,
  NavigationMenuContentImplElement,
  INavigationMenuContentImplPrivateProps,
  INavigationMenuContentImplProps,
  NavigationMenuContextValue,
  NavigationMenuItemContextValue,
  INavigationMenuProps,
  INavigationMenuSubProps,
  NavigationMenuTriggerElement,
  NavigationMenuViewportElement,
  Orientation,
  PrimitiveDivProps,
  ScopedProps,
  ViewportContentMounterElement,
  IViewportContentMounterProps,
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

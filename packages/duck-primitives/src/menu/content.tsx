/** MenuContent component - the popover content area for menu items. */

import { hideOthers } from 'aria-hidden'
import * as React from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { DismissableLayer } from '../dismissable-layer'
import { FocusScope } from '../focus-scope'
import { useFocusGuards } from '../hooks/use-focus-guard'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { useTypeaheadListNavigation, useVimNavigation } from '../libs/list-navigation'
import * as PopperPrimitive from '../popper'
import { Presence } from '../presence'
import * as RovingFocusGroup from '../roving-focus'
import { createSlot } from '../slot'

import {
  Collection,
  createMenuContext,
  type MenuContentElement,
  type ScopedProps,
  useCollection,
  useMenuContext,
  useMenuRootContext,
  usePopperScope,
  useRovingFocusGroupScope,
} from './menu'
import {
  FIRST_LAST_KEYS,
  focusFirst,
  type GraceIntent,
  getOpenState,
  isPointerInGraceArea,
  LAST_KEYS,
  type Side,
  whenMouse,
} from './menu.libs'
import { usePortalContext } from './portal'

const CONTENT_NAME = 'MenuContent'

type MenuContentContextValue = {
  onItemEnter(event: React.PointerEvent): void
  onItemLeave(event: React.PointerEvent): void
  onTriggerLeave(event: React.PointerEvent): void
  searchRef: React.RefObject<string>
  pointerGraceTimerRef: React.RefObject<number>
  onPointerGraceIntentChange(intent: GraceIntent | null): void
}
const [MenuContentProvider, useMenuContentContext] = createMenuContext<MenuContentContextValue>(CONTENT_NAME)

type MenuContentImplElement = React.ComponentRef<typeof PopperPrimitive.Content>

type MenuRootContentTypeElement = MenuContentImplElement
interface MenuRootContentTypeProps extends Omit<MenuContentImplProps, keyof MenuContentImplPrivateProps> {}

/**
 * We purposefully don't union MenuRootContent and MenuSubContent props here because
 * they have conflicting prop types. We agreed that we would allow MenuSubContent to
 * accept props that it would just ignore.
 */
interface MenuContentProps extends MenuRootContentTypeProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const MenuContent = React.forwardRef<MenuContentElement, MenuContentProps>(
  (props: ScopedProps<MenuContentProps>, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeMenu)
    const { forceMount = portalContext.forceMount, ...contentProps } = props
    const context = useMenuContext(CONTENT_NAME, props.__scopeMenu)
    const rootContext = useMenuRootContext(CONTENT_NAME, props.__scopeMenu)

    return (
      <Collection.Provider scope={props.__scopeMenu}>
        <Presence present={forceMount || context.open}>
          <Collection.Slot scope={props.__scopeMenu}>
            {rootContext.modal ? (
              <MenuRootContentModal {...contentProps} ref={forwardedRef} />
            ) : (
              <MenuRootContentNonModal {...contentProps} ref={forwardedRef} />
            )}
          </Collection.Slot>
        </Presence>
      </Collection.Provider>
    )
  },
)

MenuContent.displayName = CONTENT_NAME

const MenuRootContentModal = React.forwardRef<MenuRootContentTypeElement, MenuRootContentTypeProps>(
  (props: ScopedProps<MenuRootContentTypeProps>, forwardedRef) => {
    const context = useMenuContext(CONTENT_NAME, props.__scopeMenu)
    const ref = React.useRef<MenuRootContentTypeElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)

    // Hide everything from ARIA except the `MenuContent`
    React.useEffect(() => {
      const content = ref.current
      if (content) return hideOthers(content)
    }, [])

    return (
      <MenuContentImpl
        {...props}
        ref={composedRefs}
        // we make sure we're not trapping once it's been closed
        // (closed !== unmounted when animating out)
        trapFocus={context.open}
        // make sure to only disable pointer events when open
        // this avoids blocking interactions while animating out
        disableOutsidePointerEvents={context.open}
        disableOutsideScroll
        // When focus is trapped, a `focusout` event may still happen.
        // We make sure we don't trigger our `onDismiss` in such case.
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault(), {
          checkForDefaultPrevented: false,
        })}
        onDismiss={() => context.onOpenChange(false)}
      />
    )
  },
)

MenuRootContentModal.displayName = 'MenuRootContentModal'

const MenuRootContentNonModal = React.forwardRef<MenuRootContentTypeElement, MenuRootContentTypeProps>(
  (props: ScopedProps<MenuRootContentTypeProps>, forwardedRef) => {
    const context = useMenuContext(CONTENT_NAME, props.__scopeMenu)
    return (
      <MenuContentImpl
        {...props}
        ref={forwardedRef}
        trapFocus={false}
        disableOutsidePointerEvents={false}
        disableOutsideScroll={false}
        onDismiss={() => context.onOpenChange(false)}
      />
    )
  },
)

MenuRootContentNonModal.displayName = 'MenuRootContentNonModal'

type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>
type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>
type MenuContentImplPrivateProps = {
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus']
  onDismiss?: DismissableLayerProps['onDismiss']
  disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents']

  /**
   * Whether scrolling outside the `MenuContent` should be prevented
   * (default: `false`)
   */
  disableOutsideScroll?: boolean

  /**
   * Whether focus should be trapped within the `MenuContent`
   * (default: false)
   */
  trapFocus?: FocusScopeProps['trapped']
}
interface MenuContentImplProps extends MenuContentImplPrivateProps, Omit<PopperContentProps, 'dir' | 'onPlaced'> {
  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']

  /**
   * Whether keyboard navigation should loop around
   * @defaultValue false
   */
  loop?: RovingFocusGroupProps['loop']

  onEntryFocus?: RovingFocusGroupProps['onEntryFocus']
  onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown']
  onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside']
  onFocusOutside?: DismissableLayerProps['onFocusOutside']
  onInteractOutside?: DismissableLayerProps['onInteractOutside']
}

const Slot = createSlot('MenuContent.ScrollLock')

const MenuContentImpl = React.forwardRef<MenuContentImplElement, MenuContentImplProps>(
  (props: ScopedProps<MenuContentImplProps>, forwardedRef) => {
    const {
      __scopeMenu,
      loop = false,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEntryFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      disableOutsideScroll,
      ...contentProps
    } = props
    const context = useMenuContext(CONTENT_NAME, __scopeMenu)
    const rootContext = useMenuRootContext(CONTENT_NAME, __scopeMenu)
    const popperScope = usePopperScope(__scopeMenu)
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu)
    const getItems = useCollection(__scopeMenu)
    const [currentItemId, setCurrentItemId] = React.useState<string | null>(null)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef, context.onContentChange)
    const searchRef = React.useRef('')
    const pointerGraceTimerRef = React.useRef(0)
    const pointerGraceIntentRef = React.useRef<GraceIntent | null>(null)
    const pointerDirRef = React.useRef<Side>('right')
    const lastPointerXRef = React.useRef(0)

    const ScrollLockWrapper = disableOutsideScroll ? RemoveScroll : React.Fragment
    const scrollLockWrapperProps = disableOutsideScroll
      ? { as: Slot, allowPinchZoom: true, enabled: context.open }
      : undefined

    const [, handleTypeaheadSearch, resetTypeahead] = useTypeaheadListNavigation({
      getItems: () => getItems().filter((item) => !item.disabled),
      getItemElement: (item) => item.ref.current as HTMLElement | null,
      getItemTextValue: (item) => item.textValue || (item.ref.current?.textContent ?? '').trim(),
      onMatch: (item) => {
        const node = item.ref.current as HTMLElement | null
        if (node) {
          /**
           * Imperative focus during keydown is risky so we prevent React's batching updates
           * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
           */
          setTimeout(() => node.focus())
        }
      },
      externalSearchRef: searchRef,
    })

    const handleVimKey = useVimNavigation({ onNavigate: resetTypeahead })

    React.useEffect(() => {
      return () => resetTypeahead()
    }, [resetTypeahead])

    // Make sure the whole tree has focus guards as our `MenuContent` may be
    // the last element in the DOM (because of the `Portal`)
    useFocusGuards()

    const isPointerMovingToSubmenu = React.useCallback((event: React.PointerEvent) => {
      const isMovingTowards = pointerDirRef.current === pointerGraceIntentRef.current?.side
      return isMovingTowards && isPointerInGraceArea(event, pointerGraceIntentRef.current?.area)
    }, [])

    return (
      <MenuContentProvider
        scope={__scopeMenu}
        searchRef={searchRef}
        onItemEnter={React.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault()
          },
          [isPointerMovingToSubmenu],
        )}
        onItemLeave={React.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) return
            contentRef.current?.focus()
            setCurrentItemId(null)
          },
          [isPointerMovingToSubmenu],
        )}
        onTriggerLeave={React.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault()
          },
          [isPointerMovingToSubmenu],
        )}
        pointerGraceTimerRef={pointerGraceTimerRef}
        onPointerGraceIntentChange={React.useCallback((intent) => {
          pointerGraceIntentRef.current = intent
        }, [])}>
        <ScrollLockWrapper {...scrollLockWrapperProps}>
          <FocusScope
            asChild
            trapped={trapFocus}
            onMountAutoFocus={composeEventHandlers(onOpenAutoFocus, (event) => {
              // when opening, explicitly focus the content area only and leave
              // `onEntryFocus` in  control of focusing first item
              event.preventDefault()
              contentRef.current?.focus({ preventScroll: true })
            })}
            onUnmountAutoFocus={onCloseAutoFocus}>
            <DismissableLayer
              asChild
              disableOutsidePointerEvents={disableOutsidePointerEvents}
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={onPointerDownOutside}
              onFocusOutside={onFocusOutside}
              onInteractOutside={onInteractOutside}
              onDismiss={onDismiss}>
              <RovingFocusGroup.Root
                asChild
                {...rovingFocusGroupScope}
                dir={rootContext.dir}
                orientation="vertical"
                loop={loop}
                currentTabStopId={currentItemId}
                onCurrentTabStopIdChange={setCurrentItemId}
                onEntryFocus={composeEventHandlers(onEntryFocus, (event) => {
                  // only focus first item when using keyboard
                  if (!rootContext.isUsingKeyboardRef.current) event.preventDefault()
                })}
                preventScrollOnEntryFocus>
                <PopperPrimitive.Content
                  data-slot="menu-content"
                  role="menu"
                  aria-orientation="vertical"
                  data-state={getOpenState(context.open)}
                  dir={rootContext.dir}
                  {...popperScope}
                  {...contentProps}
                  ref={composedRefs}
                  style={{ outline: 'none', ...contentProps.style }}
                  onKeyDown={composeEventHandlers(contentProps.onKeyDown, (event) => {
                    // submenu key events bubble through portals. We only care about keys in this menu.
                    const target = event.target as HTMLElement
                    const isKeyDownInside = target.closest('[role="menu"]') === event.currentTarget
                    const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
                    const isCharacterKey = event.key.length === 1
                    if (isKeyDownInside) {
                      // menus should not be navigated using tab key so we prevent it
                      if (event.key === 'Tab') event.preventDefault()

                      const enabledItems = getItems().filter((item) => !item.disabled)
                      // biome-ignore lint/style/noNonNullAssertion: collection item refs are always mounted when the menu is open
                      const nodes = enabledItems.map((item) => item.ref.current!)
                      if (handleVimKey(event, nodes)) return

                      if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key)
                    }
                    // focus first/last item based on key pressed
                    const content = contentRef.current
                    if (event.target !== content) return
                    if (!FIRST_LAST_KEYS.includes(event.key)) return
                    event.preventDefault()
                    const items = getItems().filter((item) => !item.disabled)
                    // biome-ignore lint/style/noNonNullAssertion: collection item refs are always mounted when the menu is open
                    const candidateNodes = items.map((item) => item.ref.current!)
                    if (LAST_KEYS.includes(event.key)) candidateNodes.reverse()
                    focusFirst(candidateNodes)
                  })}
                  onBlur={composeEventHandlers(props.onBlur, (event) => {
                    // clear search buffer when leaving the menu
                    const nextTarget = event.relatedTarget as Node | null
                    if (!event.currentTarget.contains(nextTarget)) resetTypeahead()
                  })}
                  onPointerMove={composeEventHandlers(
                    props.onPointerMove,
                    whenMouse((event) => {
                      const target = event.target as HTMLElement
                      const pointerXHasChanged = lastPointerXRef.current !== event.clientX

                      // We don't use `event.movementX` for this check because Safari will
                      // always return `0` on a pointer event.
                      if (event.currentTarget.contains(target) && pointerXHasChanged) {
                        const newDir = event.clientX > lastPointerXRef.current ? 'right' : 'left'
                        pointerDirRef.current = newDir
                        lastPointerXRef.current = event.clientX
                      }
                    }),
                  )}
                />
              </RovingFocusGroup.Root>
            </DismissableLayer>
          </FocusScope>
        </ScrollLockWrapper>
      </MenuContentProvider>
    )
  },
)

MenuContentImpl.displayName = 'MenuContentImpl'

export type { MenuContentImplElement, MenuContentImplPrivateProps, MenuContentImplProps, MenuContentProps }
export { MenuContent, MenuContentImpl, MenuContentProvider, useMenuContentContext }

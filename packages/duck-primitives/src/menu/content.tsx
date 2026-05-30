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
import type { IMenu } from './menu.types'
import { usePortalContext } from './portal'

const CONTENT_NAME = 'MenuContent'

interface IMenuContentContext {
  onItemEnter(event: React.PointerEvent): void
  onItemLeave(event: React.PointerEvent): void
  onTriggerLeave(event: React.PointerEvent): void
  searchRef: React.RefObject<string>
  pointerGraceTimerRef: React.RefObject<number>
  onPointerGraceIntentChange(intent: GraceIntent | null): void
}

const [MenuContentProvider, useMenuContentContext] = createMenuContext<IMenuContentContext>(CONTENT_NAME)

type MenuContentImplElement = React.ComponentRef<typeof PopperPrimitive.Content>
type MenuRootContentTypeElement = MenuContentImplElement

const MenuContent = React.forwardRef<IMenu.MenuContentElement, IMenu.IContentProps>(
  (props: IMenu.IScoped<IMenu.IContentProps>, forwardedRef) => {
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

const MenuRootContentModal = React.forwardRef<MenuRootContentTypeElement, IMenu.IRootContentTypeProps>(
  (props: IMenu.IScoped<IMenu.IRootContentTypeProps>, forwardedRef) => {
    const {
      trapFocus: trapFocusProp,
      disableOutsidePointerEvents: disableOutsidePointerEventsProp,
      disableOutsideScroll: disableOutsideScrollProp,
      ...restProps
    } = props
    const context = useMenuContext(CONTENT_NAME, props.__scopeMenu)
    const ref = React.useRef<MenuRootContentTypeElement>(null)
    // Track via state so the aria-hide effect retries if Presence delays mount past
    // the first commit (refs are not reactive; the empty-deps version silently no-oped).
    const [content, setContent] = React.useState<MenuRootContentTypeElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref, (node: MenuRootContentTypeElement | null) =>
      setContent(node),
    )

    React.useEffect(() => {
      if (content) return hideOthers(content)
    }, [content])

    return (
      <MenuContentImpl
        {...restProps}
        ref={composedRefs}
        trapFocus={trapFocusProp ?? context.open}
        disableOutsidePointerEvents={disableOutsidePointerEventsProp ?? context.open}
        disableOutsideScroll={disableOutsideScrollProp ?? true}
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault(), {
          checkForDefaultPrevented: false,
        })}
        onDismiss={() => context.onOpenChange(false)}
      />
    )
  },
)

MenuRootContentModal.displayName = 'MenuRootContentModal'

const MenuRootContentNonModal = React.forwardRef<MenuRootContentTypeElement, IMenu.IRootContentTypeProps>(
  (props: IMenu.IScoped<IMenu.IRootContentTypeProps>, forwardedRef) => {
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

const Slot = createSlot('MenuContent.ScrollLock')

const MenuContentImpl = React.forwardRef<MenuContentImplElement, IMenu.IContentImplProps>(
  (props: IMenu.IScoped<IMenu.IContentImplProps>, forwardedRef) => {
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
      ? { as: Slot, allowPinchZoom: true, enabled: context.open, removeScrollBar: false }
      : undefined

    const [, handleTypeaheadSearch, resetTypeahead] = useTypeaheadListNavigation({
      getItems: () => getItems().filter((item) => !item.disabled),
      getItemElement: (item) => item.ref.current as HTMLElement | null,
      getItemTextValue: (item) => item.textValue || (item.ref.current?.textContent ?? '').trim(),
      onMatch: (item) => {
        const node = item.ref.current as HTMLElement | null
        if (node) {
          setTimeout(() => node.focus())
        }
      },
      externalSearchRef: searchRef,
    })

    const handleVimKey = useVimNavigation({ onNavigate: resetTypeahead })

    React.useEffect(() => {
      return () => resetTypeahead()
    }, [resetTypeahead])

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
                    const target = event.target as HTMLElement
                    const isKeyDownInside = target.closest('[role="menu"]') === event.currentTarget
                    const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
                    const isCharacterKey = event.key.length === 1
                    if (isKeyDownInside) {
                      if (event.key === 'Tab') event.preventDefault()

                      const enabledItems = getItems().filter((item) => !item.disabled)
                      const nodes: HTMLElement[] = []
                      for (const item of enabledItems) {
                        const node = item.ref.current
                        if (node) nodes.push(node)
                      }
                      if (handleVimKey(event, nodes)) return

                      if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key)
                    }
                    const content = contentRef.current
                    if (event.target !== content) return
                    if (!FIRST_LAST_KEYS.includes(event.key)) return
                    event.preventDefault()
                    const items = getItems().filter((item) => !item.disabled)
                    const candidateNodes: HTMLElement[] = []
                    for (const item of items) {
                      const node = item.ref.current
                      if (node) candidateNodes.push(node)
                    }
                    if (LAST_KEYS.includes(event.key)) candidateNodes.reverse()
                    focusFirst(candidateNodes)
                  })}
                  onBlur={composeEventHandlers(props.onBlur, (event) => {
                    const nextTarget = event.relatedTarget as Node | null
                    if (!event.currentTarget.contains(nextTarget)) resetTypeahead()
                  })}
                  onPointerMove={composeEventHandlers(
                    props.onPointerMove,
                    whenMouse((event) => {
                      const target = event.target as HTMLElement
                      const pointerXHasChanged = lastPointerXRef.current !== event.clientX

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

export { MenuContent, MenuContentImpl, MenuContentProvider, useMenuContentContext }

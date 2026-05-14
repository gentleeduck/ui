import * as React from 'react'
import { DismissableLayer } from '../dismissable-layer'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Presence } from '../presence'
import { useCollection, useNavigationMenuContext, useNavigationMenuItemContext } from './navigation-menu'
import {
  FocusGroup,
  focusFirst,
  getOpenState,
  getTabbableCandidates,
  makeContentId,
  makeTriggerId,
  ROOT_CONTENT_DISMISS,
  whenMouse,
} from './navigation-menu.libs'
import type { INavigationMenu } from './navigation-menu.types'

const CONTENT_NAME = 'NavigationMenuContent'

type NavigationMenuContentElement = INavigationMenu.NavigationMenuContentImplElement
interface INavigationMenuContentProps
  extends Omit<INavigationMenu.IContentImplProps, keyof INavigationMenu.IContentImplPrivateProps> {
  forceMount?: true
}

const NavigationMenuContent = React.forwardRef<NavigationMenuContentElement, INavigationMenuContentProps>(
  (props: INavigationMenu.IScoped<INavigationMenuContentProps>, forwardedRef) => {
    const { forceMount, ...contentProps } = props
    const context = useNavigationMenuContext(CONTENT_NAME, props.__scopeNavigationMenu)
    const itemContext = useNavigationMenuItemContext(CONTENT_NAME, props.__scopeNavigationMenu)
    const composedRefs = useComposedRefs(itemContext.contentRef, forwardedRef)
    const open = itemContext.value === context.value

    const commonProps = {
      value: itemContext.value,
      triggerRef: itemContext.triggerRef,
      focusProxyRef: itemContext.focusProxyRef,
      wasEscapeCloseRef: itemContext.wasEscapeCloseRef,
      onContentFocusOutside: itemContext.onContentFocusOutside,
      onRootContentClose: itemContext.onRootContentClose,
      ...contentProps,
    }

    return !context.viewport ? (
      <Presence present={forceMount || open}>
        <NavigationMenuContentImpl
          data-state={getOpenState(open)}
          {...commonProps}
          ref={composedRefs}
          onPointerEnter={composeEventHandlers(props.onPointerEnter, context.onContentEnter)}
          onPointerLeave={composeEventHandlers(props.onPointerLeave, whenMouse(context.onContentLeave))}
          style={{
            // prevent interaction while animating out
            pointerEvents: !open && context.isRootMenu ? 'none' : undefined,
            ...commonProps.style,
          }}
        />
      </Presence>
    ) : (
      <ViewportContentMounter forceMount={forceMount} {...commonProps} ref={composedRefs} />
    )
  },
)

NavigationMenuContent.displayName = CONTENT_NAME

const ViewportContentMounter = React.forwardRef<
  INavigationMenu.ViewportContentMounterElement,
  INavigationMenu.IViewportContentMounterProps
>((props: INavigationMenu.IScoped<INavigationMenu.IViewportContentMounterProps>, forwardedRef) => {
  const context = useNavigationMenuContext(CONTENT_NAME, props.__scopeNavigationMenu)
  const { onViewportContentChange, onViewportContentRemove } = context

  useLayoutEffect(() => {
    onViewportContentChange(props.value, {
      ref: forwardedRef,
      ...props,
    })
  }, [props, forwardedRef, onViewportContentChange])

  useLayoutEffect(() => {
    return () => onViewportContentRemove(props.value)
  }, [props.value, onViewportContentRemove])

  return null
})

ViewportContentMounter.displayName = 'ViewportContentMounter'

type MotionAttribute = 'to-start' | 'to-end' | 'from-start' | 'from-end'

const NavigationMenuContentImpl = React.forwardRef<
  INavigationMenu.NavigationMenuContentImplElement,
  INavigationMenu.IContentImplProps
>((props: INavigationMenu.IScoped<INavigationMenu.IContentImplProps>, forwardedRef) => {
  const {
    __scopeNavigationMenu,
    value,
    triggerRef,
    focusProxyRef,
    wasEscapeCloseRef,
    onRootContentClose,
    onContentFocusOutside,
    ...contentProps
  } = props
  const context = useNavigationMenuContext(CONTENT_NAME, __scopeNavigationMenu)
  const ref = React.useRef<INavigationMenu.NavigationMenuContentImplElement>(null)
  const composedRefs = useComposedRefs(ref, forwardedRef)
  const triggerId = makeTriggerId(context.baseId, value)
  const contentId = makeContentId(context.baseId, value)
  const getItems = useCollection(__scopeNavigationMenu)
  const prevMotionAttributeRef = React.useRef<MotionAttribute | null>(null)

  const { onItemDismiss } = context

  React.useEffect(() => {
    const content = ref.current

    // bubble dismiss to root content, then return focus to its trigger
    if (context.isRootMenu && content) {
      const handleClose = () => {
        onItemDismiss()
        onRootContentClose()
        if (content.contains(document.activeElement)) triggerRef.current?.focus()
      }
      content.addEventListener(ROOT_CONTENT_DISMISS, handleClose)
      return () => content.removeEventListener(ROOT_CONTENT_DISMISS, handleClose)
    }
  }, [context.isRootMenu, triggerRef, onItemDismiss, onRootContentClose])

  const motionAttribute = React.useMemo(() => {
    const items = getItems()
    const values = items.map((item) => item.value)
    if (context.dir === 'rtl') values.reverse()
    const index = values.indexOf(context.value)
    const prevIndex = values.indexOf(context.previousValue)
    const isSelected = value === context.value
    const wasSelected = prevIndex === values.indexOf(value)

    // only animate selected and last-selected to avoid interrupting unrelated transitions
    if (!isSelected && !wasSelected) return prevMotionAttributeRef.current

    const attribute = (() => {
      // no direction on initial open or full close (leaving the list entirely)
      if (index !== prevIndex) {
        if (isSelected && prevIndex !== -1) return index > prevIndex ? 'from-end' : 'from-start'
        if (wasSelected && index !== -1) return index > prevIndex ? 'to-start' : 'to-end'
      }
      return null
    })()

    prevMotionAttributeRef.current = attribute
    return attribute
  }, [context.previousValue, context.value, context.dir, getItems, value])

  return (
    <FocusGroup asChild>
      <DismissableLayer
        id={contentId}
        aria-labelledby={triggerId}
        data-motion={motionAttribute}
        data-orientation={context.orientation}
        {...contentProps}
        ref={composedRefs}
        disableOutsidePointerEvents={false}
        onDismiss={() => {
          const rootContentDismissEvent = new Event(ROOT_CONTENT_DISMISS, {
            bubbles: true,
            cancelable: true,
          })
          ref.current?.dispatchEvent(rootContentDismissEvent)
        }}
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) => {
          onContentFocusOutside()
          const target = event.target as HTMLElement
          // only dismiss when focus leaves the entire menu (not just this content)
          if (context.rootNavigationMenu?.contains(target)) event.preventDefault()
        })}
        onPointerDownOutside={composeEventHandlers(props.onPointerDownOutside, (event) => {
          const target = event.target as HTMLElement
          const isTrigger = getItems().some((item) => item.ref.current?.contains(target))
          const isRootViewport = context.isRootMenu && context.viewport?.contains(target)
          if (isTrigger || isRootViewport || !context.isRootMenu) event.preventDefault()
        })}
        onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
          const isMetaKey = event.altKey || event.ctrlKey || event.metaKey
          const isTabKey = event.key === 'Tab' && !isMetaKey
          if (isTabKey) {
            const candidates = getTabbableCandidates(event.currentTarget)
            const focusedElement = document.activeElement as HTMLElement | null
            const index = focusedElement ? candidates.indexOf(focusedElement) : -1
            const isMovingBackwards = event.shiftKey
            const nextCandidates = isMovingBackwards
              ? candidates.slice(0, index).reverse()
              : candidates.slice(index + 1, candidates.length)

            if (focusFirst(nextCandidates)) {
              event.preventDefault()
            } else {
              // at the edge of tabbable candidates: hand off to the proxy so the
              // browser tabs out naturally to the next/prev element after the menu
              focusProxyRef.current?.focus()
            }
          }
        })}
        onEscapeKeyDown={composeEventHandlers(props.onEscapeKeyDown, (_event) => {
          // suppresses pointer-over reopen until pointer leaves the trigger
          wasEscapeCloseRef.current = true
        })}
      />
    </FocusGroup>
  )
})
NavigationMenuContentImpl.displayName = 'NavigationMenuContentImpl'

export type { INavigationMenuContentProps }
export { NavigationMenuContent, NavigationMenuContentImpl }

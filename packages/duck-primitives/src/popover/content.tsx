'use client'

import { hideOthers } from 'aria-hidden'
import * as React from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { DismissableLayer } from '../dismissable-layer'
import { FocusScope } from '../focus-scope'
import { useFocusGuards } from '../hooks/use-focus-guard'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { getState } from '../libs/get-state'
import * as PopperPrimitive from '../popper'
import { Presence } from '../presence/presence'
import { createSlot } from '../slot'
import { usePopoverContext, usePopperScope } from './popover'
import type { IPopover } from './popover.types'
import { usePortalContext } from './portal'

const CONTENT_NAME = 'PopoverContent'

type PopoverContentElement = React.ComponentRef<typeof PopperPrimitive.PopperContent>
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>

type PointerDownOutsideEvent = Parameters<NonNullable<DismissableLayerProps['onPointerDownOutside']>>[0]
type FocusOutsideEvent = Parameters<NonNullable<DismissableLayerProps['onFocusOutside']>>[0]
type InteractOutsideEvent = Parameters<NonNullable<DismissableLayerProps['onInteractOutside']>>[0]

export const PopoverContent = React.forwardRef<PopoverContentElement, IPopover.IContentProps>(
  (props: IPopover.IScoped<IPopover.IContentProps>, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopePopover)
    const { forceMount = portalContext.forceMount, ...contentProps } = props
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover)

    return (
      <Presence present={forceMount || context.open}>
        {context.modal ? (
          <PopoverContentModal {...contentProps} ref={forwardedRef} />
        ) : (
          <PopoverContentNonModal {...contentProps} ref={forwardedRef} />
        )}
      </Presence>
    )
  },
)

PopoverContent.displayName = CONTENT_NAME

const Slot = createSlot('PopoverContent.RemoveScroll')

const PopoverContentModal = React.forwardRef<PopoverContentElement, IPopover.IContentTypeProps>(
  (props: IPopover.IScoped<IPopover.IContentTypeProps>, forwardedRef) => {
    const {
      trapFocus: trapFocusProp,
      disableOutsidePointerEvents: disableOutsidePointerEventsProp,
      lockScroll: lockScrollProp,
      ...restProps
    } = props
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover)

    const contentRef = React.useRef<HTMLDivElement>(null)
    // Track via state so the aria-hide effect retries if Presence delays mount past
    // the first commit (refs are not reactive; the empty-deps version silently no-oped).
    const [content, setContent] = React.useState<HTMLDivElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef, (node) => setContent(node))

    const isRightClickOutsideRef = React.useRef(false)

    React.useEffect(() => {
      if (content) return hideOthers(content)
      return
    }, [content])

    return (
      <RemoveScroll as={Slot} allowPinchZoom enabled={lockScrollProp ?? context.open}>
        <PopoverContentImpl
          {...restProps}
          ref={composedRefs}
          trapFocus={trapFocusProp ?? context.open}
          disableOutsidePointerEvents={disableOutsidePointerEventsProp ?? context.open}
          onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
            event.preventDefault()
            if (!isRightClickOutsideRef.current) context.triggerRef.current?.focus()
          })}
          onPointerDownOutside={composeEventHandlers(
            props.onPointerDownOutside,
            (event: PointerDownOutsideEvent) => {
              // originalEvent is UA-controlled; narrow before reading button/ctrlKey.
              // Right-click outside must not re-focus the trigger (would dismiss the context menu).
              const originalEvent = event.detail.originalEvent as unknown

              if (
                originalEvent &&
                typeof originalEvent === 'object' &&
                'button' in originalEvent &&
                'ctrlKey' in originalEvent
              ) {
                const ev = originalEvent as MouseEvent | PointerEvent
                const ctrlLeftClick = ev.button === 0 && ev.ctrlKey === true
                const isRightClick = ev.button === 2 || ctrlLeftClick
                isRightClickOutsideRef.current = isRightClick
              } else {
                isRightClickOutsideRef.current = false
              }
            },
            { checkForDefaultPrevented: false },
          )}
          // focus trap can trigger focusout during open; suppress dismiss from that path
          onFocusOutside={composeEventHandlers(
            props.onFocusOutside,
            (event: FocusOutsideEvent) => event.preventDefault(),
            { checkForDefaultPrevented: false },
          )}
        />
      </RemoveScroll>
    )
  },
)

PopoverContentModal.displayName = `${CONTENT_NAME}Modal`

const PopoverContentNonModal = React.forwardRef<PopoverContentElement, IPopover.IContentTypeProps>(
  (props: IPopover.IScoped<IPopover.IContentTypeProps>, forwardedRef) => {
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover)

    const hasInteractedOutsideRef = React.useRef(false)
    const hasPointerDownOutsideRef = React.useRef(false)

    return (
      <PopoverContentImpl
        {...props}
        ref={forwardedRef}
        trapFocus={false}
        disableOutsidePointerEvents={false}
        onCloseAutoFocus={(event) => {
          props.onCloseAutoFocus?.(event)

          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus()
            // either we focused manually above, or the UA should keep its current focus
            event.preventDefault()
          }

          hasInteractedOutsideRef.current = false
          hasPointerDownOutsideRef.current = false
        }}
        onInteractOutside={(event: InteractOutsideEvent) => {
          props.onInteractOutside?.(event)

          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true

            const originalEvent = event.detail.originalEvent as Event | undefined
            if (originalEvent?.type === 'pointerdown') {
              hasPointerDownOutsideRef.current = true
            }
          }

          // clicks on the trigger would dismiss then immediately reopen — short-circuit
          const target = event.target as HTMLElement | null
          const targetIsTrigger = !!target && !!context.triggerRef.current?.contains(target)
          if (targetIsTrigger) event.preventDefault()

          // Safari fires focusin outside after pointerdown outside; ignore the follow-up
          const originalEvent = event.detail.originalEvent as Event | undefined
          if (originalEvent?.type === 'focusin' && hasPointerDownOutsideRef.current) {
            event.preventDefault()
          }
        }}
      />
    )
  },
)

PopoverContentNonModal.displayName = `${CONTENT_NAME}NonModal`

const PopoverContentImpl = React.forwardRef<PopoverContentElement, IPopover.IContentImplProps>(
  (props: IPopover.IScoped<IPopover.IContentImplProps>, forwardedRef) => {
    const {
      __scopePopover,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      ...contentProps
    } = props

    const context = usePopoverContext(CONTENT_NAME, __scopePopover)
    const popperScope = usePopperScope(__scopePopover)

    // when portalled to end of document, browser tab would escape the trap;
    // sentinel focus guards re-enter the FocusScope on Tab/Shift+Tab at edges
    useFocusGuards()

    return (
      <FocusScope
        asChild
        loop
        trapped={trapFocus}
        onMountAutoFocus={onOpenAutoFocus}
        onUnmountAutoFocus={onCloseAutoFocus}>
        <DismissableLayer
          asChild
          disableOutsidePointerEvents={disableOutsidePointerEvents}
          onInteractOutside={onInteractOutside}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onFocusOutside={onFocusOutside}
          onDismiss={() => context.onOpenChange(false)}>
          <PopperPrimitive.PopperContent
            data-slot="popover-content"
            data-state={getState(context.open)}
            role="dialog"
            id={context.contentId}
            dir={context.dir}
            {...popperScope}
            {...contentProps}
            ref={forwardedRef}
            style={{
              ...contentProps.style,
              // alias popper CSS vars under the popover namespace for consumer ergonomics
              ...({
                '--gentleduck-popover-content-transform-origin': 'var(--gentleduck-popper-transform-origin)',
                '--gentleduck-popover-content-available-width': 'var(--gentleduck-popper-available-width)',
                '--gentleduck-popover-content-available-height': 'var(--gentleduck-popper-available-height)',
                '--gentleduck-popover-trigger-width': 'var(--gentleduck-popper-anchor-width)',
                '--gentleduck-popover-trigger-height': 'var(--gentleduck-popper-anchor-height)',
              } as React.CSSProperties),
            }}
          />
        </DismissableLayer>
      </FocusScope>
    )
  },
)

PopoverContentImpl.displayName = `${CONTENT_NAME}Impl`

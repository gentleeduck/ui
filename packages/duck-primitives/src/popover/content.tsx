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
import { type ScopedProps, usePopoverContext, usePopperScope } from './popover'
import { usePortalContext } from './portal'

const CONTENT_NAME = 'PopoverContent'

type PopoverContentElement = React.ComponentRef<typeof PopperPrimitive.PopperContent>
type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperContent>
type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>

type PointerDownOutsideEvent = Parameters<NonNullable<DismissableLayerProps['onPointerDownOutside']>>[0]
type FocusOutsideEvent = Parameters<NonNullable<DismissableLayerProps['onFocusOutside']>>[0]
type InteractOutsideEvent = Parameters<NonNullable<DismissableLayerProps['onInteractOutside']>>[0]

// -------------------------------------------------------------------------------------------------
// PopoverContent
// -------------------------------------------------------------------------------------------------

type PopoverContentImplProps = Omit<PopperContentProps, 'onPlaced'> &
  Omit<DismissableLayerProps, 'onDismiss'> & {
    trapFocus?: FocusScopeProps['trapped']
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus']
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']
  }

type PopoverContentTypeProps = Omit<PopoverContentImplProps, 'trapFocus' | 'disableOutsidePointerEvents'> & {
  /** Override whether focus is trapped. Defaults to `context.open`. */
  trapFocus?: FocusScopeProps['trapped']
  /** Override whether outside pointer events are disabled. Defaults to `context.open`. */
  disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents']
  /** Override whether scroll is locked. Defaults to `context.open`. */
  lockScroll?: boolean
}

export interface IPopoverContentProps extends PopoverContentTypeProps {
  /** Force mounting for animation control. */
  forceMount?: true
}

/**
 * Popover content area. Delegates to a modal or non-modal variant based on
 * the root Popover's modal prop. Handles focus trapping, outside interactions,
 * scroll locking (modal), and accessible dismissal.
 */
export const PopoverContent = React.forwardRef<PopoverContentElement, IPopoverContentProps>(
  (props: ScopedProps<IPopoverContentProps>, forwardedRef) => {
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

// -------------------------------------------------------------------------------------------------

const Slot = createSlot('PopoverContent.RemoveScroll')

const PopoverContentModal = React.forwardRef<PopoverContentElement, PopoverContentTypeProps>(
  (props: ScopedProps<PopoverContentTypeProps>, forwardedRef) => {
    const {
      trapFocus: trapFocusProp,
      disableOutsidePointerEvents: disableOutsidePointerEventsProp,
      lockScroll: lockScrollProp,
      ...restProps
    } = props
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover)

    const contentRef = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef)

    const isRightClickOutsideRef = React.useRef(false)

    React.useEffect(() => {
      const content = contentRef.current
      if (content) return hideOthers(content)
      return
    }, [])

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
              // Be defensive with typing: originalEvent is user-agent controlled and can vary.
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
                // If we cannot interpret it, default to not right click (same net effect as before).
                isRightClickOutsideRef.current = false
              }
            },
            { checkForDefaultPrevented: false },
          )}
          // When focus is trapped, focusout can occur; prevent dismiss in that case.
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

const PopoverContentNonModal = React.forwardRef<PopoverContentElement, PopoverContentTypeProps>(
  (props: ScopedProps<PopoverContentTypeProps>, forwardedRef) => {
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
            // Always prevent auto-focus; we either focused manually or want UA focus behavior.
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

          // Prevent dismissing when clicking the trigger (avoids close then immediate open).
          const target = event.target as HTMLElement | null
          const targetIsTrigger = !!target && !!context.triggerRef.current?.contains(target)
          if (targetIsTrigger) event.preventDefault()

          // Safari quirk: ignore focusin outside after a pointerdown outside.
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

// -------------------------------------------------------------------------------------------------

const PopoverContentImpl = React.forwardRef<PopoverContentElement, PopoverContentImplProps>(
  (props: ScopedProps<PopoverContentImplProps>, forwardedRef) => {
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

    // Ensure focus guards exist even when the popover is portalled and last in the DOM.
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
              // Re-namespace exposed popper CSS vars for consumers.
              // Cast is localized to style because CSS custom properties are not strongly typed in TS.
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

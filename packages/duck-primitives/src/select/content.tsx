'use client'

import { hideOthers } from 'aria-hidden'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { RemoveScroll } from 'react-remove-scroll'
import { DismissableLayer } from '../dismissable-layer'
import { FocusScope } from '../focus-scope'
import { useFocusGuards } from '../hooks/use-focus-guard'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { clamp } from '../libs/clamp'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { getNavigationCandidates, NAVIGATION_KEYS, useVimNavigation } from '../libs/list-navigation'
import * as PopperPrimitive from '../popper'
import { Presence } from '../presence/presence'
import { Primitive } from '../primitive-elements'
import { createSlot } from '../slot'
import {
  CONTENT_MARGIN,
  Collection,
  type ScopedProps,
  SelectContentProvider,
  SelectViewportProvider,
  useCollection,
  usePopperScope,
  useSelectContentContext,
  useSelectContext,
} from './select'
import { useTypeaheadListNavigation } from './select.libs'

const CONTENT_NAME = 'SelectContent'

type SelectContentImplElement = HTMLDivElement

export interface SelectContentProps extends SelectContentImplProps {
  forceMount?: true
}

export const SelectContent = React.forwardRef<SelectContentImplElement, SelectContentProps>(
  (props: ScopedProps<SelectContentProps>, forwardedRef) => {
    const { forceMount, ...contentProps } = props
    const context = useSelectContext(CONTENT_NAME, props.__scopeSelect)
    const [fragment, setFragment] = React.useState<DocumentFragment>()

    // setting the fragment in `useLayoutEffect` as `DocumentFragment` doesn't exist on the server
    useLayoutEffect(() => {
      setFragment(new DocumentFragment())
    }, [])

    // Render items into a hidden fragment for collection when closed.
    // This is needed so the native <select> and SSR can access item values.
    const fragmentPortal =
      !context.open && fragment
        ? ReactDOM.createPortal(
            <SelectContentProvider scope={props.__scopeSelect}>
              <Collection.Slot scope={props.__scopeSelect}>
                <div>{contentProps.children}</div>
              </Collection.Slot>
            </SelectContentProvider>,
            fragment as unknown as Element,
          )
        : null

    return (
      <>
        {fragmentPortal}
        <Presence present={forceMount || context.open}>
          <SelectContentImpl {...contentProps} ref={forwardedRef} />
        </Presence>
      </>
    )
  },
)

SelectContent.displayName = CONTENT_NAME
const CONTENT_IMPL_NAME = 'SelectContentImpl'

type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>
type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>

type SelectPopperPrivateProps = { onPlaced?: PopperContentProps['onPlaced'] }

interface SelectContentImplProps
  extends Omit<SelectPopperPositionProps, keyof SelectPopperPrivateProps>,
    Omit<SelectItemAlignedPositionProps, keyof SelectPopperPrivateProps> {
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']
  onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown']
  onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside']
  position?: 'item-aligned' | 'popper'
}

const Slot = createSlot('SelectContent.RemoveScroll')

const SelectContentImpl = React.forwardRef<SelectContentImplElement, SelectContentImplProps>(
  (props: ScopedProps<SelectContentImplProps>, forwardedRef) => {
    const {
      __scopeSelect,
      position = 'item-aligned',
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      //
      // PopperContent props
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions,
      //
      ...contentProps
    } = props
    const context = useSelectContext(CONTENT_NAME, __scopeSelect)
    const [content, setContent] = React.useState<SelectContentImplElement | null>(null)
    const [viewport, setViewport] = React.useState<HTMLDivElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, (node: HTMLDivElement | null) => setContent(node))
    const [selectedItem, setSelectedItem] = React.useState<HTMLDivElement | null>(null)
    const [selectedItemText, setSelectedItemText] = React.useState<HTMLSpanElement | null>(null)
    const getItems = useCollection(__scopeSelect)
    const [isPositioned, setIsPositioned] = React.useState(false)
    const firstValidItemFoundRef = React.useRef(false)

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    React.useEffect(() => {
      if (content) return hideOthers(content)
    }, [content])

    // Make sure the whole tree has focus guards as our `Select` may be
    // the last element in the DOM (because of the `Portal`)
    useFocusGuards()

    const focusFirstItem = React.useCallback(
      (candidates: Array<HTMLElement | null>) => {
        const [firstItem, ...restItems] = getItems().map((item) => item.ref.current)
        const [lastItem] = restItems.slice(-1)

        // Wrap shared focusFirst with viewport-specific scroll logic:
        // viewport might have padding so scroll to its edges when focusing first/last items.
        const previouslyFocused = document.activeElement
        for (const candidate of candidates) {
          if (candidate === previouslyFocused) return
          candidate?.scrollIntoView({ block: 'nearest' })
          if (candidate === firstItem && viewport) viewport.scrollTop = 0
          if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight
          candidate?.focus()
          if (document.activeElement !== previouslyFocused) return
        }
      },
      [getItems, viewport],
    )

    const focusSelectedItem = React.useCallback(
      () => focusFirstItem([selectedItem, content]),
      [focusFirstItem, selectedItem, content],
    )

    // Since this is not dependent on layout, we want to ensure this runs at the same time as
    // other effects across components. Hence why we don't call `focusSelectedItem` inside `position`.
    React.useEffect(() => {
      if (isPositioned) {
        focusSelectedItem()
      }
    }, [isPositioned, focusSelectedItem])

    // prevent selecting items on `pointerup` in some cases after opening from `pointerdown`
    // and close on `pointerup` outside.
    const { onOpenChange, triggerPointerDownPosRef } = context
    React.useEffect(() => {
      if (content) {
        let pointerMoveDelta = { x: 0, y: 0 }

        const handlePointerMove = (event: PointerEvent) => {
          pointerMoveDelta = {
            x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.current?.x ?? 0)),
            y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.current?.y ?? 0)),
          }
        }
        const handlePointerUp = (event: PointerEvent) => {
          // If the pointer hasn't moved by a certain threshold then we prevent selecting item on `pointerup`.
          if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
            event.preventDefault()
          } else {
            // otherwise, if the event was outside the content, close.
            if (!content.contains(event.target as HTMLElement)) {
              onOpenChange(false)
            }
          }
          document.removeEventListener('pointermove', handlePointerMove)
          triggerPointerDownPosRef.current = null
        }

        if (triggerPointerDownPosRef.current !== null) {
          document.addEventListener('pointermove', handlePointerMove)
          document.addEventListener('pointerup', handlePointerUp, { capture: true, once: true })
        }

        return () => {
          document.removeEventListener('pointermove', handlePointerMove)
          document.removeEventListener('pointerup', handlePointerUp, { capture: true })
        }
      }
    }, [content, onOpenChange, triggerPointerDownPosRef])

    React.useEffect(() => {
      const close = () => onOpenChange(false)
      window.addEventListener('blur', close)
      window.addEventListener('resize', close)
      return () => {
        window.removeEventListener('blur', close)
        window.removeEventListener('resize', close)
      }
    }, [onOpenChange])

    const [searchRef, handleTypeaheadSearch, resetTypeaheadState] = useTypeaheadListNavigation({
      getItems: () => getItems().filter((item) => !item.disabled),
      getItemElement: (item) => item.ref.current as HTMLElement | null,
      getItemTextValue: (item) => item.textValue || (item.ref.current?.textContent ?? '').trim(),
      onMatch: (item) => {
        const node = item.ref.current as HTMLElement | null
        if (node) setTimeout(() => node.focus())
      },
    })

    const handleVimKey = useVimNavigation({ onNavigate: resetTypeaheadState })

    const itemRefCallback = React.useCallback(
      (node: HTMLDivElement | null, value: string, disabled: boolean) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled
        const isSelectedItem = context.value !== undefined && context.value === value
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItem(node)
          if (isFirstValidItem) firstValidItemFoundRef.current = true
        }
      },
      [context.value],
    )
    const handleItemLeave = React.useCallback(() => content?.focus(), [content])
    const itemTextRefCallback = React.useCallback(
      (node: HTMLSpanElement | null, value: string, disabled: boolean) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled
        const isSelectedItem = context.value !== undefined && context.value === value
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItemText(node)
        }
      },
      [context.value],
    )

    const SelectPosition = position === 'popper' ? SelectPopperPosition : SelectItemAlignedPosition

    // Silently ignore props that are not supported by `SelectItemAlignedPosition`
    const popperContentProps =
      SelectPosition === SelectPopperPosition
        ? {
            side,
            sideOffset,
            align,
            alignOffset,
            arrowPadding,
            collisionBoundary,
            collisionPadding,
            sticky,
            hideWhenDetached,
            avoidCollisions,
          }
        : {}

    return (
      <SelectContentProvider
        scope={__scopeSelect}
        content={content}
        viewport={viewport}
        onViewportChange={setViewport}
        itemRefCallback={itemRefCallback}
        selectedItem={selectedItem}
        onItemLeave={handleItemLeave}
        itemTextRefCallback={itemTextRefCallback}
        focusSelectedItem={focusSelectedItem}
        selectedItemText={selectedItemText}
        position={position}
        isPositioned={isPositioned}
        searchRef={searchRef}
        allowTextPortal={context.open}>
        <RemoveScroll as={Slot} allowPinchZoom>
          <FocusScope
            asChild
            // we make sure we're not trapping once it's been closed
            // (closed !== unmounted when animating out)
            trapped={context.open}
            onMountAutoFocus={(event) => {
              // we prevent open autofocus because we manually focus the selected item
              event.preventDefault()
            }}
            onUnmountAutoFocus={composeEventHandlers(onCloseAutoFocus, (event) => {
              context.trigger?.focus({ preventScroll: true })
              event.preventDefault()
            })}>
            <DismissableLayer
              asChild
              disableOutsidePointerEvents={context.open}
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={onPointerDownOutside}
              // When focus is trapped, a focusout event may still happen.
              // We make sure we don't trigger our `onDismiss` in such case.
              onFocusOutside={(event) => event.preventDefault()}
              onDismiss={() => context.onOpenChange(false)}>
              <SelectPosition
                data-slot="select-content"
                role="listbox"
                id={context.contentId}
                data-state={context.open ? 'open' : 'closed'}
                dir={context.dir}
                onContextMenu={(event) => event.preventDefault()}
                {...contentProps}
                {...popperContentProps}
                onPlaced={() => setIsPositioned(true)}
                ref={composedRefs}
                style={{
                  // flex layout so we can place the scroll buttons properly
                  display: 'flex',
                  flexDirection: 'column',
                  // reset the outline by default as the content MAY get focused
                  outline: 'none',
                  ...contentProps.style,
                }}
                onKeyDown={composeEventHandlers(contentProps.onKeyDown, (event) => {
                  const isModifierKey = event.ctrlKey || event.altKey || event.metaKey

                  // select should not be navigated using tab key so we prevent it
                  if (event.key === 'Tab') event.preventDefault()

                  // Vim keybindings (gg -> top, G -> bottom)
                  const enabledItems = getItems().filter((item) => !item.disabled)
                  // biome-ignore lint/style/noNonNullAssertion: collection items always have mounted refs when the content is open
                  const nodes = enabledItems.map((item) => item.ref.current!)
                  if (handleVimKey(event, nodes)) return

                  if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key)

                  if ((NAVIGATION_KEYS as readonly string[]).includes(event.key)) {
                    const candidateNodes = getNavigationCandidates(nodes, event.key, event.target as HTMLElement)

                    setTimeout(() => focusFirstItem(candidateNodes))
                    event.preventDefault()
                  }
                })}
              />
            </DismissableLayer>
          </FocusScope>
        </RemoveScroll>
      </SelectContentProvider>
    )
  },
)

SelectContentImpl.displayName = CONTENT_IMPL_NAME
const ITEM_ALIGNED_POSITION_NAME = 'SelectItemAlignedPosition'

type SelectItemAlignedPositionElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

interface SelectItemAlignedPositionProps extends PrimitiveDivProps {
  onPlaced?: () => void
}

const SelectItemAlignedPosition = React.forwardRef<SelectItemAlignedPositionElement, SelectItemAlignedPositionProps>(
  (props: ScopedProps<SelectItemAlignedPositionProps>, forwardedRef) => {
    const { __scopeSelect, onPlaced, ...popperProps } = props
    const context = useSelectContext(CONTENT_NAME, __scopeSelect)
    const contentContext = useSelectContentContext(CONTENT_NAME, __scopeSelect)
    const [contentWrapper, setContentWrapper] = React.useState<HTMLDivElement | null>(null)
    const [content, setContent] = React.useState<SelectItemAlignedPositionElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, (node: HTMLDivElement | null) => setContent(node))
    const getItems = useCollection(__scopeSelect)
    const shouldExpandOnScrollRef = React.useRef(false)
    const shouldRepositionRef = React.useRef(true)

    const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext
    const position = React.useCallback(() => {
      if (
        context.trigger &&
        context.valueNode &&
        contentWrapper &&
        content &&
        viewport &&
        selectedItem &&
        selectedItemText
      ) {
        const triggerRect = context.trigger.getBoundingClientRect()

        // -----------------------------------------------------------------------------------------
        //  Horizontal positioning
        // -----------------------------------------------------------------------------------------
        const contentRect = content.getBoundingClientRect()
        const valueNodeRect = context.valueNode.getBoundingClientRect()
        const itemTextRect = selectedItemText.getBoundingClientRect()

        if (context.dir !== 'rtl') {
          const itemTextOffset = itemTextRect.left - contentRect.left
          const left = valueNodeRect.left - itemTextOffset
          const leftDelta = triggerRect.left - left
          const minContentWidth = triggerRect.width + leftDelta
          const contentWidth = Math.max(minContentWidth, contentRect.width)
          const rightEdge = window.innerWidth - CONTENT_MARGIN
          const clampedLeft = clamp(left, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, rightEdge - contentWidth)])

          contentWrapper.style.minWidth = `${minContentWidth}px`
          contentWrapper.style.left = `${clampedLeft}px`
        } else {
          const itemTextOffset = contentRect.right - itemTextRect.right
          const right = window.innerWidth - valueNodeRect.right - itemTextOffset
          const rightDelta = window.innerWidth - triggerRect.right - right
          const minContentWidth = triggerRect.width + rightDelta
          const contentWidth = Math.max(minContentWidth, contentRect.width)
          const leftEdge = window.innerWidth - CONTENT_MARGIN
          const clampedRight = clamp(right, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, leftEdge - contentWidth)])

          contentWrapper.style.minWidth = `${minContentWidth}px`
          contentWrapper.style.right = `${clampedRight}px`
        }

        // -----------------------------------------------------------------------------------------
        // Vertical positioning
        // -----------------------------------------------------------------------------------------
        const items = getItems()
        const availableHeight = window.innerHeight - CONTENT_MARGIN * 2
        const itemsHeight = viewport.scrollHeight

        const contentStyles = window.getComputedStyle(content)
        const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10)
        const contentPaddingTop = parseInt(contentStyles.paddingTop, 10)
        const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10)
        const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10)
        const fullContentHeight =
          contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth // prettier-ignore
        const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight)

        const viewportStyles = window.getComputedStyle(viewport)
        const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10)
        const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10)

        const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN
        const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle

        const selectedItemHalfHeight = selectedItem.offsetHeight / 2
        const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight
        const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle
        const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle

        const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle

        if (willAlignWithoutTopOverflow) {
          const isLastItem = items.length > 0 && selectedItem === items[items.length - 1]?.ref.current
          contentWrapper.style.bottom = `${0}px`
          const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight
          const clampedTriggerMiddleToBottomEdge = Math.max(
            triggerMiddleToBottomEdge,
            selectedItemHalfHeight +
              // viewport might have padding bottom, include it to avoid a scrollable viewport
              (isLastItem ? viewportPaddingBottom : 0) +
              viewportOffsetBottom +
              contentBorderBottomWidth,
          )
          const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge
          contentWrapper.style.height = `${height}px`
        } else {
          const isFirstItem = items.length > 0 && selectedItem === items[0]?.ref.current
          contentWrapper.style.top = `${0}px`
          const clampedTopEdgeToTriggerMiddle = Math.max(
            topEdgeToTriggerMiddle,
            contentBorderTopWidth +
              viewport.offsetTop +
              // viewport might have padding top, include it to avoid a scrollable viewport
              (isFirstItem ? viewportPaddingTop : 0) +
              selectedItemHalfHeight,
          )
          const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom
          contentWrapper.style.height = `${height}px`
          viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop
        }

        contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`
        contentWrapper.style.minHeight = `${minContentHeight}px`
        contentWrapper.style.maxHeight = `${availableHeight}px`
        // -----------------------------------------------------------------------------------------

        onPlaced?.()

        // we don't want the initial scroll position adjustment to trigger "expand on scroll"
        // so we explicitly turn it on only after they've registered.
        requestAnimationFrame(() => (shouldExpandOnScrollRef.current = true))
      }
    }, [
      getItems,
      context.trigger,
      context.valueNode,
      contentWrapper,
      content,
      viewport,
      selectedItem,
      selectedItemText,
      context.dir,
      onPlaced,
    ])

    useLayoutEffect(() => position(), [position])

    // copy z-index from content to wrapper
    const [contentZIndex, setContentZIndex] = React.useState<string>()
    useLayoutEffect(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex)
    }, [content])

    // When the viewport becomes scrollable at the top, the scroll up button will mount.
    // Because it is part of the normal flow, it will push down the viewport, thus throwing our
    // trigger => selectedItem alignment off by the amount the viewport was pushed down.
    // We wait for this to happen and then re-run the positioning logic one more time to account for it.
    const handleScrollButtonChange = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (node && shouldRepositionRef.current === true) {
          position()
          focusSelectedItem?.()
          shouldRepositionRef.current = false
        }
      },
      [position, focusSelectedItem],
    )

    return (
      <SelectViewportProvider
        scope={__scopeSelect}
        contentWrapper={contentWrapper}
        shouldExpandOnScrollRef={shouldExpandOnScrollRef}
        onScrollButtonChange={handleScrollButtonChange}>
        <div
          ref={setContentWrapper}
          dir={context.dir}
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            zIndex: contentZIndex,
          }}>
          <Primitive.div
            data-slot="select-item-aligned-position"
            {...popperProps}
            ref={composedRefs}
            style={{
              // When we get the height of the content, it includes borders. If we were to set
              // the height without having `boxSizing: 'border-box'` it would be too big.
              boxSizing: 'border-box',
              // We need to ensure the content doesn't get taller than the wrapper
              maxHeight: '100%',
              ...popperProps.style,
            }}
          />
        </div>
      </SelectViewportProvider>
    )
  },
)

SelectItemAlignedPosition.displayName = ITEM_ALIGNED_POSITION_NAME
const POPPER_POSITION_NAME = 'SelectPopperPosition'

type SelectPopperPositionElement = React.ComponentRef<typeof PopperPrimitive.Content>
type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>

interface SelectPopperPositionProps extends PopperContentProps {
  onPlaced?: () => void
}

const SelectPopperPosition = React.forwardRef<SelectPopperPositionElement, SelectPopperPositionProps>(
  (props: ScopedProps<SelectPopperPositionProps>, forwardedRef) => {
    const { __scopeSelect, align = 'start', collisionPadding = CONTENT_MARGIN, ...popperProps } = props
    const popperScope = usePopperScope(__scopeSelect)

    return (
      <PopperPrimitive.Content
        data-slot="select-popper-position"
        {...popperScope}
        {...popperProps}
        ref={forwardedRef}
        align={align}
        collisionPadding={collisionPadding}
        style={{
          // Ensure border-box for floating-ui calculations
          boxSizing: 'border-box',
          ...popperProps.style,
          // re-namespace exposed content custom properties
          ...({
            '--gentleduck-select-content-transform-origin': 'var(--gentleduck-popper-transform-origin)',
            '--gentleduck-select-content-available-width': 'var(--gentleduck-popper-available-width)',
            '--gentleduck-select-content-available-height': 'var(--gentleduck-popper-available-height)',
            '--gentleduck-select-trigger-width': 'var(--gentleduck-popper-anchor-width)',
            '--gentleduck-select-trigger-height': 'var(--gentleduck-popper-anchor-height)',
          } as React.CSSProperties),
        }}
      />
    )
  },
)

SelectPopperPosition.displayName = POPPER_POSITION_NAME

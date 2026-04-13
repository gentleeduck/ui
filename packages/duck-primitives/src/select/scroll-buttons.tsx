import * as React from 'react'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import {
  type ScopedProps,
  useCollection,
  useSelectContentContext,
  useSelectContext,
  useSelectViewportContext,
} from './select'

const SCROLL_UP_BUTTON_NAME = 'SelectScrollUpButton'

type SelectScrollButtonImplElement = React.ComponentRef<typeof Primitive.div>

export interface ISelectScrollUpButtonProps
  extends Omit<React.ComponentPropsWithRef<typeof Primitive.div>, 'onAutoScroll'> {}

export const SelectScrollUpButton = React.forwardRef<SelectScrollButtonImplElement, ISelectScrollUpButtonProps>(
  (props: ScopedProps<ISelectScrollUpButtonProps>, forwardedRef) => {
    const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect)
    const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect)
    const [canScrollUp, setCanScrollUp] = React.useState(false)
    const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange)

    useLayoutEffect(() => {
      if (contentContext.viewport && contentContext.isPositioned) {
        const viewport = contentContext.viewport
        const handleScroll = () => {
          const canScroll = viewport.scrollTop > 0
          setCanScrollUp(canScroll)
        }
        handleScroll()
        viewport.addEventListener('scroll', handleScroll)
        return () => viewport.removeEventListener('scroll', handleScroll)
      }
    }, [contentContext.viewport, contentContext.isPositioned])

    return canScrollUp ? (
      <SelectScrollButtonImpl
        {...props}
        data-slot="select-scroll-up-button"
        ref={composedRefs}
        onAutoScroll={() => {
          const { viewport, selectedItem } = contentContext
          if (viewport && selectedItem) {
            viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight
          }
        }}
      />
    ) : null
  },
)

SelectScrollUpButton.displayName = SCROLL_UP_BUTTON_NAME
const SCROLL_DOWN_BUTTON_NAME = 'SelectScrollDownButton'

export interface ISelectScrollDownButtonProps
  extends Omit<React.ComponentPropsWithRef<typeof Primitive.div>, 'onAutoScroll'> {}

export const SelectScrollDownButton = React.forwardRef<SelectScrollButtonImplElement, ISelectScrollDownButtonProps>(
  (props: ScopedProps<ISelectScrollDownButtonProps>, forwardedRef) => {
    const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect)
    const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect)
    const [canScrollDown, setCanScrollDown] = React.useState(false)
    const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange)

    useLayoutEffect(() => {
      if (contentContext.viewport && contentContext.isPositioned) {
        const viewport = contentContext.viewport
        const handleScroll = () => {
          const maxScroll = viewport.scrollHeight - viewport.clientHeight
          // we use Math.ceil here because if the UI is zoomed-in
          // `scrollTop` is not always reported as an integer
          const canScroll = Math.ceil(viewport.scrollTop) < maxScroll
          setCanScrollDown(canScroll)
        }
        handleScroll()
        viewport.addEventListener('scroll', handleScroll)
        return () => viewport.removeEventListener('scroll', handleScroll)
      }
    }, [contentContext.viewport, contentContext.isPositioned])

    return canScrollDown ? (
      <SelectScrollButtonImpl
        {...props}
        data-slot="select-scroll-down-button"
        ref={composedRefs}
        onAutoScroll={() => {
          const { viewport, selectedItem } = contentContext
          if (viewport && selectedItem) {
            viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight
          }
        }}
      />
    ) : null
  },
)

SelectScrollDownButton.displayName = SCROLL_DOWN_BUTTON_NAME
interface ISelectScrollButtonImplProps extends React.ComponentPropsWithRef<typeof Primitive.div> {
  onAutoScroll(): void
}

const SelectScrollButtonImpl = React.forwardRef<HTMLDivElement, ScopedProps<ISelectScrollButtonImplProps>>(
  (props, forwardedRef) => {
    const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props
    const context = useSelectContext('SelectScrollButton', __scopeSelect)
    const contentContext = useSelectContentContext('SelectScrollButton', __scopeSelect)
    const autoScrollTimerRef = React.useRef<number | null>(null)
    const getItems = useCollection(__scopeSelect)

    const clearAutoScrollTimer = React.useCallback(() => {
      if (autoScrollTimerRef.current !== null) {
        window.clearInterval(autoScrollTimerRef.current)
        autoScrollTimerRef.current = null
      }
    }, [])

    React.useEffect(() => {
      return () => clearAutoScrollTimer()
    }, [clearAutoScrollTimer])

    // When the viewport becomes scrollable on either side, the relevant scroll button will mount.
    // Because it is part of the normal flow, it will push down (top button) or shrink (bottom button)
    // the viewport, potentially causing the active item to now be partially out of view.
    // We re-run the `scrollIntoView` logic to make sure it stays within the viewport.
    useLayoutEffect(() => {
      const activeItem = getItems().find((item) => item.ref.current === document.activeElement)
      activeItem?.ref.current?.scrollIntoView({ block: 'nearest' })
    }, [getItems])

    return (
      <Primitive.div
        data-slot="select-scroll-button"
        aria-hidden
        dir={context.dir}
        {...scrollIndicatorProps}
        ref={forwardedRef}
        style={{ flexShrink: 0, ...scrollIndicatorProps.style }}
        onPointerDown={composeEventHandlers(scrollIndicatorProps.onPointerDown, () => {
          if (autoScrollTimerRef.current === null) {
            autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50)
          }
        })}
        onPointerMove={composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
          contentContext.onItemLeave?.()
          if (autoScrollTimerRef.current === null) {
            autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50)
          }
        })}
        onPointerLeave={composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
          clearAutoScrollTimer()
        })}
      />
    )
  },
)

SelectScrollButtonImpl.displayName = 'SelectScrollButtonImpl'

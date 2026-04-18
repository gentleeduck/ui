import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import {
  CONTENT_MARGIN,
  Collection,
  useSelectContentContext,
  useSelectContext,
  useSelectViewportContext,
} from './select'
import type { ISelect } from './select.types'

const VIEWPORT_NAME = 'SelectViewport'

type SelectViewportElement = React.ComponentRef<typeof Primitive.div>

export const SelectViewport = React.forwardRef<SelectViewportElement, ISelect.IViewportProps>(
  (props: ISelect.IScoped<ISelect.IViewportProps>, forwardedRef) => {
    const { __scopeSelect, nonce, ...viewportProps } = props
    const context = useSelectContext(VIEWPORT_NAME, __scopeSelect)
    const contentContext = useSelectContentContext(VIEWPORT_NAME, __scopeSelect)
    const viewportContext = useSelectViewportContext(VIEWPORT_NAME, __scopeSelect)
    const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange)
    const prevScrollTopRef = React.useRef(0)
    return (
      <>
        {/* Hide scrollbars cross-browser and enable momentum scroll for touch devices */}
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled static CSS string for cross-browser scrollbar hiding  -  no user input involved
          dangerouslySetInnerHTML={{
            __html: `[data-slot="select-viewport"]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-slot="select-viewport"]::-webkit-scrollbar{display:none}`,
          }}
          nonce={nonce}
        />
        <Collection.Slot scope={__scopeSelect}>
          <Primitive.div
            data-slot="select-viewport"
            role="presentation"
            dir={context.dir}
            {...viewportProps}
            ref={composedRefs}
            style={{
              // we use position: 'relative' here on the `viewport` so that when we call
              // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
              // (independent of the scrollUpButton).
              position: 'relative',
              flex: 1,
              // Viewport should only be scrollable in the vertical direction.
              overflow: 'hidden auto',
              ...viewportProps.style,
            }}
            onScroll={composeEventHandlers(viewportProps.onScroll, (event) => {
              const viewport = event.currentTarget
              const { contentWrapper, shouldExpandOnScrollRef } = viewportContext
              if (shouldExpandOnScrollRef?.current && contentWrapper) {
                const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop)
                if (scrolledBy > 0) {
                  const availableHeight = window.innerHeight - CONTENT_MARGIN * 2
                  const cssMinHeight = parseFloat(contentWrapper.style.minHeight)
                  const cssHeight = parseFloat(contentWrapper.style.height)
                  const prevHeight = Math.max(cssMinHeight, cssHeight)

                  if (prevHeight < availableHeight) {
                    const nextHeight = prevHeight + scrolledBy
                    const clampedNextHeight = Math.min(availableHeight, nextHeight)
                    const heightDiff = nextHeight - clampedNextHeight

                    contentWrapper.style.height = `${clampedNextHeight}px`
                    if (contentWrapper.style.bottom === '0px') {
                      viewport.scrollTop = heightDiff > 0 ? heightDiff : 0
                      // ensure the content stays pinned to the bottom
                      contentWrapper.style.justifyContent = 'flex-end'
                    }
                  }
                }
              }
              prevScrollTopRef.current = viewport.scrollTop
            })}
          />
        </Collection.Slot>
      </>
    )
  },
)

SelectViewport.displayName = VIEWPORT_NAME

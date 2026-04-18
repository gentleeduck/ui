import * as React from 'react'
import { DismissableLayer } from '../dismissable-layer'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import * as PopperPrimitive from '../popper'
import { Presence } from '../presence'
import { useHoverCardContext, usePopperScope } from './hover-card'
import type { IHoverCard } from './hover-card.types'
import { usePortalContext } from './portal'
import { excludeTouch } from './trigger'

let originalBodyUserSelect: string

const CONTENT_NAME = 'HoverCardContent'

type HoverCardContentImplElement = React.ComponentRef<typeof PopperPrimitive.Content>
type HoverCardContentElement = HoverCardContentImplElement

/** Content area of the hover card with dismissable layer and popper positioning. */
export const HoverCardContent = React.forwardRef<HoverCardContentElement, IHoverCard.IContentProps>(
  (props: IHoverCard.IScoped<IHoverCard.IContentProps>, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeHoverCard)
    const { forceMount = portalContext.forceMount, ...contentProps } = props
    const context = useHoverCardContext(CONTENT_NAME, props.__scopeHoverCard)
    return (
      <Presence present={forceMount || context.open}>
        <HoverCardContentImpl
          data-state={context.open ? 'open' : 'closed'}
          {...contentProps}
          onPointerEnter={composeEventHandlers(props.onPointerEnter, excludeTouch(context.onOpen))}
          onPointerLeave={composeEventHandlers(props.onPointerLeave, excludeTouch(context.onClose))}
          ref={forwardedRef}
        />
      </Presence>
    )
  },
)

HoverCardContent.displayName = CONTENT_NAME

const HoverCardContentImpl = React.forwardRef<HoverCardContentImplElement, IHoverCard.IContentImplProps>(
  (props: IHoverCard.IScoped<IHoverCard.IContentImplProps>, forwardedRef) => {
    const {
      __scopeHoverCard,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      ...contentProps
    } = props
    const context = useHoverCardContext(CONTENT_NAME, __scopeHoverCard)
    const popperScope = usePopperScope(__scopeHoverCard)
    const ref = React.useRef<HoverCardContentImplElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const [containSelection, setContainSelection] = React.useState(false)

    React.useEffect(() => {
      if (containSelection) {
        const body = document.body

        // Safari requires prefix
        originalBodyUserSelect = body.style.userSelect || body.style.webkitUserSelect

        body.style.userSelect = 'none'
        body.style.webkitUserSelect = 'none'
        return () => {
          body.style.userSelect = originalBodyUserSelect
          body.style.webkitUserSelect = originalBodyUserSelect
        }
      }
    }, [containSelection])

    React.useEffect(() => {
      if (ref.current) {
        const handlePointerUp = () => {
          setContainSelection(false)
          context.isPointerDownOnContentRef.current = false

          // Delay a frame to ensure we always access the latest selection
          setTimeout(() => {
            const hasSelection = document.getSelection()?.toString() !== ''
            if (hasSelection) context.hasSelectionRef.current = true
          })
        }

        document.addEventListener('pointerup', handlePointerUp)
        return () => {
          document.removeEventListener('pointerup', handlePointerUp)
          context.hasSelectionRef.current = false
          context.isPointerDownOnContentRef.current = false
        }
      }
    }, [context.isPointerDownOnContentRef, context.hasSelectionRef])

    React.useEffect(() => {
      if (ref.current) {
        const tabbables = getTabbableNodes(ref.current)
        for (const tabbable of tabbables) {
          tabbable.setAttribute('tabindex', '-1')
        }
      }
    })

    return (
      <DismissableLayer
        asChild
        disableOutsidePointerEvents={false}
        onInteractOutside={onInteractOutside}
        onEscapeKeyDown={onEscapeKeyDown}
        onPointerDownOutside={onPointerDownOutside}
        onFocusOutside={composeEventHandlers(onFocusOutside, (event) => {
          event.preventDefault()
        })}
        onDismiss={context.onDismiss}>
        <PopperPrimitive.Content
          data-slot="hover-card-content"
          {...popperScope}
          {...contentProps}
          dir={context.dir}
          onPointerDown={composeEventHandlers(contentProps.onPointerDown, (event) => {
            // Contain selection to current layer
            if (event.currentTarget.contains(event.target as HTMLElement)) {
              setContainSelection(true)
            }
            context.hasSelectionRef.current = false
            context.isPointerDownOnContentRef.current = true
          })}
          ref={composedRefs}
          style={{
            ...contentProps.style,
            userSelect: containSelection ? 'text' : undefined,
            // Safari requires prefix
            WebkitUserSelect: containSelection ? 'text' : undefined,
            // re-namespace exposed content custom properties
            ...{
              '--gentleduck-hover-card-content-transform-origin': 'var(--gentleduck-popper-transform-origin)',
              '--gentleduck-hover-card-content-available-width': 'var(--gentleduck-popper-available-width)',
              '--gentleduck-hover-card-content-available-height': 'var(--gentleduck-popper-available-height)',
              '--gentleduck-hover-card-trigger-width': 'var(--gentleduck-popper-anchor-width)',
              '--gentleduck-hover-card-trigger-height': 'var(--gentleduck-popper-anchor-height)',
            },
          }}
        />
      </DismissableLayer>
    )
  },
)

HoverCardContentImpl.displayName = 'HoverCardContentImpl'

/**
 * Returns a list of nodes that can be in the tab sequence.
 * @see: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 */
function getTabbableNodes(container: HTMLElement) {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: Node) => {
      if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP
      // `.tabIndex` is not the same as the `tabindex` attribute. It works on the
      // runtime's understanding of tabbability, so this automatically accounts
      // for any kind of element that could be tabbed to.
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  return nodes
}

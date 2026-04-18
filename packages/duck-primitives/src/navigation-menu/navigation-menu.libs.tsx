import * as React from 'react'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import { FocusGroupCollection, useFocusGroupCollection, useNavigationMenuContext } from './navigation-menu'
import type { INavigationMenu } from './navigation-menu.types'

type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

/* ----- Constants ----- */

const ROOT_CONTENT_DISMISS = 'navigationMenu.rootContentDismiss'
const LINK_SELECT = 'navigationMenu.linkSelect'
const ARROW_KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']

/* ----- Utility functions ----- */

function getOpenState(open: boolean) {
  return open ? 'open' : 'closed'
}

function makeTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`
}

function makeContentId(baseId: string, value: string) {
  return `${baseId}-content-${value}`
}

function whenMouse<E>(handler: React.PointerEventHandler<E>): React.PointerEventHandler<E> {
  return (event) => (event.pointerType === 'mouse' ? handler(event) : undefined)
}

/**
 * Returns a list of potential tabbable candidates.
 *
 * NOTE: This is only a close approximation. For example it doesn't take into account cases like when
 * elements are not visible. This cannot be worked out easily by just reading a property, but rather
 * necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
 */
function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: Node) => {
      const el = node as HTMLElement
      const isHiddenInput = el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'hidden'
      if (el.hidden || (el as HTMLInputElement).disabled || isHiddenInput) return NodeFilter.FILTER_SKIP
      // `.tabIndex` is not the same as the `tabindex` attribute. It works on the
      // runtime's understanding of tabbability, so this automatically accounts
      // for any kind of element that could be tabbed to.
      return el.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  // we do not take into account the order of nodes with positive `tabIndex` as it
  // hinders accessibility to have tab order different from visual order.
  return nodes
}

function focusFirst(candidates: HTMLElement[]) {
  const previouslyFocusedElement = document.activeElement
  return candidates.some((candidate) => {
    // if focus is already where we want to go, we don't want to keep going through the candidates
    if (candidate === previouslyFocusedElement) return true
    candidate.focus()
    return document.activeElement !== previouslyFocusedElement
  })
}

function removeFromTabOrder(candidates: HTMLElement[]) {
  candidates.forEach((candidate) => {
    candidate.dataset.tabindex = candidate.getAttribute('tabindex') || ''
    candidate.setAttribute('tabindex', '-1')
  })
  return () => {
    candidates.forEach((candidate) => {
      const prevTabIndex = candidate.dataset.tabindex as string
      candidate.setAttribute('tabindex', prevTabIndex)
    })
  }
}

function useResizeObserver(element: HTMLElement | null, onResize: () => void) {
  const handleResize = useCallbackRef(onResize)
  useLayoutEffect(() => {
    let rAF = 0
    if (element) {
      /**
       * Resize Observer will throw an often benign error that says `ResizeObserver loop
       * completed with undelivered notifications`. This means that ResizeObserver was not
       * able to deliver all observations within a single animation frame, so we use
       * `requestAnimationFrame` to ensure we don't deliver unnecessary observations.
       * Further reading: https://github.com/WICG/resize-observer/issues/38
       */
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF)
        rAF = window.requestAnimationFrame(handleResize)
      })
      resizeObserver.observe(element)
      return () => {
        window.cancelAnimationFrame(rAF)
        resizeObserver.unobserve(element)
      }
    }
  }, [element, handleResize])
}

/* ----- FocusGroup (internal component) ----- */

const FOCUS_GROUP_NAME = 'FocusGroup'

type FocusGroupElement = React.ComponentRef<typeof Primitive.div>
interface IFocusGroupProps extends PrimitiveDivProps {}

const FocusGroup = React.forwardRef<FocusGroupElement, IFocusGroupProps>(
  (props: INavigationMenu.IScoped<IFocusGroupProps>, forwardedRef) => {
    const { __scopeNavigationMenu, ...groupProps } = props
    const context = useNavigationMenuContext(FOCUS_GROUP_NAME, __scopeNavigationMenu)

    return (
      <FocusGroupCollection.Provider scope={__scopeNavigationMenu}>
        <FocusGroupCollection.Slot scope={__scopeNavigationMenu}>
          <Primitive.div data-slot="navigation-menu-group" dir={context.dir} {...groupProps} ref={forwardedRef} />
        </FocusGroupCollection.Slot>
      </FocusGroupCollection.Provider>
    )
  },
)

FocusGroup.displayName = FOCUS_GROUP_NAME

/* ----- FocusGroupItem (internal component) ----- */

const FOCUS_GROUP_ITEM_NAME = 'FocusGroupItem'

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
interface IFocusGroupItemProps extends PrimitiveButtonProps {}

const FocusGroupItem = React.forwardRef<INavigationMenu.FocusGroupItemElement, IFocusGroupItemProps>(
  (props: INavigationMenu.IScoped<IFocusGroupItemProps>, forwardedRef) => {
    const { __scopeNavigationMenu, ...groupProps } = props
    const getItems = useFocusGroupCollection(__scopeNavigationMenu)
    const context = useNavigationMenuContext(FOCUS_GROUP_ITEM_NAME, __scopeNavigationMenu)

    return (
      <FocusGroupCollection.ItemSlot scope={__scopeNavigationMenu}>
        <Primitive.button
          {...groupProps}
          ref={forwardedRef}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            const isFocusNavigationKey = ['Home', 'End', ...ARROW_KEYS].includes(event.key)
            if (isFocusNavigationKey) {
              let candidateNodes: HTMLElement[] = []
              for (const item of getItems()) {
                const node = item.ref.current
                if (node) candidateNodes.push(node)
              }
              const prevItemKey = context.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
              const prevKeys = [prevItemKey, 'ArrowUp', 'End']
              if (prevKeys.includes(event.key)) candidateNodes.reverse()
              if (ARROW_KEYS.includes(event.key)) {
                const currentIndex = candidateNodes.indexOf(event.currentTarget)
                candidateNodes = candidateNodes.slice(currentIndex + 1)
              }
              /**
               * Imperative focus during keydown is risky so we prevent React's batching updates
               * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
               */
              setTimeout(() => focusFirst(candidateNodes))

              // Prevent page scroll while navigating
              event.preventDefault()
            }
          })}
        />
      </FocusGroupCollection.ItemSlot>
    )
  },
)
FocusGroupItem.displayName = FOCUS_GROUP_ITEM_NAME

export {
  FocusGroup,
  FocusGroupItem,
  focusFirst,
  getOpenState,
  getTabbableCandidates,
  LINK_SELECT,
  makeContentId,
  makeTriggerId,
  ROOT_CONTENT_DISMISS,
  removeFromTabOrder,
  useResizeObserver,
  whenMouse,
}

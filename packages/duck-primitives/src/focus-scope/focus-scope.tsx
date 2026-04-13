import * as React from 'react'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import {
  focus,
  focusFirst,
  focusScopesStack,
  getTabbableCandidates,
  getTabbableEdges,
  removeLinks,
} from './focus-scope.libs'

const AUTOFOCUS_ON_MOUNT = 'focusScope.autoFocusOnMount'
const AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount'
const EVENT_OPTIONS = { bubbles: false, cancelable: true }

const FOCUS_SCOPE_NAME = 'FocusScope'

type FocusScopeElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

export interface IFocusScopeProps extends PrimitiveDivProps {
  /** When true, Tab from last item wraps to first and Shift+Tab from first wraps to last. */
  loop?: boolean
  /** When true, focus cannot leave the scope via keyboard, pointer, or programmatic focus. */
  trapped?: boolean
  /** Called when auto-focusing on mount. Can be prevented. */
  onMountAutoFocus?: (event: Event) => void
  /** Called when auto-focusing on unmount. Can be prevented. */
  onUnmountAutoFocus?: (event: Event) => void
}

const FocusScope = React.forwardRef<FocusScopeElement, IFocusScopeProps>((props, forwardedRef) => {
  const {
    loop = false,
    trapped = false,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
    ...scopeProps
  } = props
  const [container, setContainer] = React.useState<HTMLElement | null>(null)
  const onMountAutoFocus = useCallbackRef(onMountAutoFocusProp)
  const onUnmountAutoFocus = useCallbackRef(onUnmountAutoFocusProp)
  const lastFocusedComponentRef = React.useRef<HTMLElement | null>(null)
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContainer(node))

  const focusScope = React.useRef({
    paused: false,
    pause() {
      this.paused = true
    },
    resume() {
      this.paused = false
    },
  }).current

  // Trap focus when it moves outside the container programmatically.
  React.useEffect(() => {
    if (trapped) {
      const handleFocusIn = (event: FocusEvent) => {
        if (focusScope.paused || !container) return
        const target = event.target as HTMLElement | null
        if (container.contains(target)) {
          lastFocusedComponentRef.current = target
        } else {
          focus(lastFocusedComponentRef.current, { select: true })
        }
      }

      const handleFocusOut = (event: FocusEvent) => {
        if (focusScope.paused || !container) return
        const relatedTarget = event.relatedTarget as HTMLElement | null

        // When relatedTarget is null the browser or tab lost focus (case 1),
        // or Chrome removed the focused element from the DOM (case 2).
        // In both cases, let the browser handle focus restoration.
        if (relatedTarget === null) return

        if (!container.contains(relatedTarget)) {
          focus(lastFocusedComponentRef.current, { select: true })
        }
      }

      // When a focused element is removed from the DOM, browsers move focus to
      // document.body. Detect this via MutationObserver and refocus the container.
      const handleMutations = (mutations: MutationRecord[]) => {
        const focusedElement = document.activeElement as HTMLElement | null
        if (focusedElement !== document.body) return
        for (const mutation of mutations) {
          if (mutation.removedNodes.length > 0) focus(container)
        }
      }

      document.addEventListener('focusin', handleFocusIn)
      document.addEventListener('focusout', handleFocusOut)
      const mutationObserver = new MutationObserver(handleMutations)
      if (container) mutationObserver.observe(container, { childList: true, subtree: true })

      return () => {
        document.removeEventListener('focusin', handleFocusIn)
        document.removeEventListener('focusout', handleFocusOut)
        mutationObserver.disconnect()
      }
    }
  }, [trapped, container, focusScope.paused])

  // Auto-focus on mount and restore focus on unmount.
  React.useEffect(() => {
    if (container) {
      focusScopesStack.add(focusScope)
      const previouslyFocusedElement = document.activeElement as HTMLElement | null
      const hasFocusedCandidate = container.contains(previouslyFocusedElement)

      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS)
        container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus)
        container.dispatchEvent(mountEvent)
        if (!mountEvent.defaultPrevented) {
          focusFirst(removeLinks(getTabbableCandidates(container)), { select: true })
          if (document.activeElement === previouslyFocusedElement) {
            focus(container)
          }
        }
      }

      return () => {
        container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus)

        // Delay unmount focus to work around a React bug with focusing during unmount.
        // See: https://github.com/facebook/react/issues/17894
        setTimeout(() => {
          const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS)
          container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus)
          container.dispatchEvent(unmountEvent)
          if (!unmountEvent.defaultPrevented) {
            focus(previouslyFocusedElement ?? document.body, { select: true })
          }
          container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus)

          focusScopesStack.remove(focusScope)
        }, 0)
      }
    }
  }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope])

  // Handle Tab key looping at container edges.
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!loop && !trapped) return
      if (focusScope.paused) return

      const isTabKey = event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey
      const focusedElement = document.activeElement as HTMLElement | null

      if (isTabKey && focusedElement) {
        const container = event.currentTarget as HTMLElement
        const [first, last] = getTabbableEdges(container)
        const hasTabbableElementsInside = first && last

        if (!hasTabbableElementsInside) {
          if (focusedElement === container) event.preventDefault()
        } else {
          if (!event.shiftKey && focusedElement === last) {
            event.preventDefault()
            if (loop) focus(first, { select: true })
          } else if (event.shiftKey && focusedElement === first) {
            event.preventDefault()
            if (loop) focus(last, { select: true })
          }
        }
      }
    },
    [loop, trapped, focusScope.paused],
  )

  return (
    <Primitive.div data-slot="focus-scope" tabIndex={-1} {...scopeProps} ref={composedRefs} onKeyDown={handleKeyDown} />
  )
})

FocusScope.displayName = FOCUS_SCOPE_NAME

export { FocusScope }

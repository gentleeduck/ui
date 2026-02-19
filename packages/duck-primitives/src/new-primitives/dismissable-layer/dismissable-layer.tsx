import * as React from 'react'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { useEscapeKeydown } from '../hooks/use-escape-keydown'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { dispatchDiscreteCustomEvent, Primitive } from '../primitive-elements'

/* -------------------------------------------------------------------------------------------------
 * DismissableLayer
 *
 * A layer that can be dismissed by pressing Escape, clicking outside, or focusing outside.
 * Manages a stack of layers so only the topmost layer handles dismiss events.
 * Optionally disables pointer events on elements behind the layer.
 * -----------------------------------------------------------------------------------------------*/

const DISMISSABLE_LAYER_NAME = 'DismissableLayer'
const CONTEXT_UPDATE = 'dismissableLayer.update'
const POINTER_DOWN_OUTSIDE = 'dismissableLayer.pointerDownOutside'
const FOCUS_OUTSIDE = 'dismissableLayer.focusOutside'

let originalBodyPointerEvents: string

type DismissableLayerElement = React.ElementRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

export const DismissableLayerContext = React.createContext({
  layers: new Set<DismissableLayerElement>(),
  layersWithOutsidePointerEventsDisabled: new Set<DismissableLayerElement>(),
  branches: new Set<React.ElementRef<typeof Primitive.div>>(),
})

export interface DismissableLayerProps extends PrimitiveDivProps {
  /** When true, disables pointer interactions on elements outside this layer. */
  disableOutsidePointerEvents?: boolean
  /** Called when the Escape key is pressed. Can be prevented. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /** Called when a pointerdown event occurs outside the layer. Can be prevented. */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  /** Called when focus moves outside the layer. Can be prevented. */
  onFocusOutside?: (event: FocusOutsideEvent) => void
  /** Called on any interaction (pointer or focus) outside the layer. Can be prevented. */
  onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
  /** Called when the layer should be dismissed. */
  onDismiss?: () => void
}

const DismissableLayer = React.forwardRef<DismissableLayerElement, DismissableLayerProps>((props, forwardedRef) => {
  const {
    disableOutsidePointerEvents = false,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    onDismiss,
    ...layerProps
  } = props
  const context = React.useContext(DismissableLayerContext)
  const [node, setNode] = React.useState<DismissableLayerElement | null>(null)
  const ownerDocument = node?.ownerDocument ?? globalThis?.document
  const [, force] = React.useState({})
  const composedRefs = useComposedRefs(forwardedRef, (node) => setNode(node))
  const layers = Array.from(context.layers)
  const [highestLayerWithOutsidePointerEventsDisabled] = Array.from(
    context.layersWithOutsidePointerEventsDisabled,
  ).slice(-1) // prettier-ignore
  const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(
    highestLayerWithOutsidePointerEventsDisabled!,
  ) // prettier-ignore
  const index = node ? layers.indexOf(node) : -1
  const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0
  const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex

  const pointerDownOutside = usePointerDownOutside((event) => {
    const target = event.target as HTMLElement
    const isPointerDownOnBranch = Array.from(context.branches).some((branch) => branch.contains(target))
    if (!isPointerEventsEnabled || isPointerDownOnBranch) return
    onPointerDownOutside?.(event)
    onInteractOutside?.(event)
    if (!event.defaultPrevented) onDismiss?.()
  }, ownerDocument)

  const focusOutside = useFocusOutside((event) => {
    const target = event.target as HTMLElement
    const isFocusInBranch = Array.from(context.branches).some((branch) => branch.contains(target))
    if (isFocusInBranch) return
    onFocusOutside?.(event)
    onInteractOutside?.(event)
    if (!event.defaultPrevented) onDismiss?.()
  }, ownerDocument)

  useEscapeKeydown((event) => {
    const isHighestLayer = index === context.layers.size - 1
    if (!isHighestLayer) return
    onEscapeKeyDown?.(event)
    if (!event.defaultPrevented && onDismiss) {
      event.preventDefault()
      onDismiss()
    }
  }, ownerDocument)

  React.useEffect(() => {
    if (!node) return
    if (disableOutsidePointerEvents) {
      if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
        originalBodyPointerEvents = ownerDocument.body.style.pointerEvents
        ownerDocument.body.style.pointerEvents = 'none'
      }
      context.layersWithOutsidePointerEventsDisabled.add(node)
    }
    context.layers.add(node)
    dispatchUpdate()
    return () => {
      if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
        ownerDocument.body.style.pointerEvents = originalBodyPointerEvents
      }
    }
  }, [node, ownerDocument, disableOutsidePointerEvents, context])

  // Separate cleanup effect to preserve layer ordering.
  // Combining with the above would re-add the layer at the end on prop changes,
  // breaking creation-order stacking.
  React.useEffect(() => {
    return () => {
      if (!node) return
      context.layers.delete(node)
      context.layersWithOutsidePointerEventsDisabled.delete(node)
      dispatchUpdate()
    }
  }, [node, context])

  React.useEffect(() => {
    const handleUpdate = () => force({})
    document.addEventListener(CONTEXT_UPDATE, handleUpdate)
    return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate)
  }, [])

  return (
    <Primitive.div
      {...layerProps}
      ref={composedRefs}
      style={{
        pointerEvents: isBodyPointerEventsDisabled ? (isPointerEventsEnabled ? 'auto' : 'none') : undefined,
        ...props.style,
      }}
      onFocusCapture={composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture)}
      onBlurCapture={composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture)}
      onPointerDownCapture={composeEventHandlers(props.onPointerDownCapture, pointerDownOutside.onPointerDownCapture)}
    />
  )
})

DismissableLayer.displayName = DISMISSABLE_LAYER_NAME

/* -------------------------------------------------------------------------------------------------
 * usePointerDownOutside
 *
 * Detects pointerdown events outside the React subtree.
 * Uses pointerdown (not pointerup) to match OS-level layer dismiss behavior.
 * Handles touch devices by deferring to the next click event.
 * -----------------------------------------------------------------------------------------------*/

export type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

function usePointerDownOutside(
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void,
  ownerDocument: Document = globalThis?.document,
) {
  const handlePointerDownOutside = useCallbackRef(onPointerDownOutside) as EventListener
  const isPointerInsideReactTreeRef = React.useRef(false)
  const handleClickRef = React.useRef(() => {})

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target && !isPointerInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event }

        const handleAndDispatchPointerDownOutsideEvent = () => {
          handleAndDispatchCustomEvent(POINTER_DOWN_OUTSIDE, handlePointerDownOutside, eventDetail, { discrete: true })
        }

        // On touch devices, browsers have a ~350ms delay between touch end and click.
        // We defer to the click event to avoid reactivating pointer-events too early.
        // Also handles cancellations (scroll, long-press) where click never fires.
        if (event.pointerType === 'touch') {
          ownerDocument.removeEventListener('click', handleClickRef.current)
          handleClickRef.current = handleAndDispatchPointerDownOutsideEvent
          ownerDocument.addEventListener('click', handleClickRef.current, { once: true })
        } else {
          handleAndDispatchPointerDownOutsideEvent()
        }
      } else {
        ownerDocument.removeEventListener('click', handleClickRef.current)
      }
      isPointerInsideReactTreeRef.current = false
    }

    // Delay listener registration to avoid catching the pointerdown that mounted this component.
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener('pointerdown', handlePointerDown)
    }, 0)
    return () => {
      window.clearTimeout(timerId)
      ownerDocument.removeEventListener('pointerdown', handlePointerDown)
      ownerDocument.removeEventListener('click', handleClickRef.current)
    }
  }, [ownerDocument, handlePointerDownOutside])

  return {
    onPointerDownCapture: () => (isPointerInsideReactTreeRef.current = true),
  }
}

/* -------------------------------------------------------------------------------------------------
 * useFocusOutside
 *
 * Detects when focus moves outside the React subtree.
 * Tracks focus via capture-phase handlers to distinguish React tree vs DOM tree focus.
 * -----------------------------------------------------------------------------------------------*/

function useFocusOutside(
  onFocusOutside?: (event: FocusOutsideEvent) => void,
  ownerDocument: Document = globalThis?.document,
) {
  const handleFocusOutside = useCallbackRef(onFocusOutside) as EventListener
  const isFocusInsideReactTreeRef = React.useRef(false)

  React.useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      if (event.target && !isFocusInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event }
        handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
          discrete: false,
        })
      }
    }
    ownerDocument.addEventListener('focusin', handleFocus)
    return () => ownerDocument.removeEventListener('focusin', handleFocus)
  }, [ownerDocument, handleFocusOutside])

  return {
    onFocusCapture: () => (isFocusInsideReactTreeRef.current = true),
    onBlurCapture: () => (isFocusInsideReactTreeRef.current = false),
  }
}

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------------------------*/

function dispatchUpdate() {
  const event = new CustomEvent(CONTEXT_UPDATE)
  document.dispatchEvent(event)
}

function handleAndDispatchCustomEvent<E extends CustomEvent, OriginalEvent extends Event>(
  name: string,
  handler: ((event: E) => void) | undefined,
  detail: { originalEvent: OriginalEvent } & (E extends CustomEvent<infer D> ? D : never),
  { discrete }: { discrete: boolean },
) {
  const target = detail.originalEvent.target
  const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail })
  if (handler) target.addEventListener(name, handler as EventListener, { once: true })

  if (discrete) {
    dispatchDiscreteCustomEvent(target, event)
  } else {
    target.dispatchEvent(event)
  }
}

export { DismissableLayer }

import * as React from 'react'
import { useEscapeKeydown } from '../hooks/use-escape-keydown'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import {
  CONTEXT_UPDATE,
  dispatchUpdate,
  type FocusOutsideEvent,
  type PointerDownOutsideEvent,
  useFocusOutside,
  usePointerDownOutside,
} from './dismissable-layer.libs'

export type { FocusOutsideEvent, PointerDownOutsideEvent } from './dismissable-layer.libs'

const DISMISSABLE_LAYER_NAME = 'DismissableLayer'

let originalBodyPointerEvents: string

type DismissableLayerElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

export const DismissableLayerContext = React.createContext({
  layers: new Set<DismissableLayerElement>(),
  layersWithOutsidePointerEventsDisabled: new Set<DismissableLayerElement>(),
  branches: new Set<React.ComponentRef<typeof Primitive.div>>(),
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
  ).slice(-1)
  const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(
    // biome-ignore lint/style/noNonNullAssertion: indexOf returns -1 for undefined which is the correct fallback behavior here
    highestLayerWithOutsidePointerEventsDisabled!,
  )
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
      if (disableOutsidePointerEvents) {
        context.layersWithOutsidePointerEventsDisabled.delete(node)
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          ownerDocument.body.style.pointerEvents = originalBodyPointerEvents
        }
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
      data-slot="dismissable-layer"
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

export { DismissableLayer }

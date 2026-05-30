import * as React from 'react'
import { useEscapeKeydown } from '../hooks/use-escape-keydown'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import { CONTEXT_UPDATE, dispatchUpdate, useFocusOutside, usePointerDownOutside } from './dismissable-layer.libs'
import type { IDismissableLayer } from './dismissable-layer.types'

const DISMISSABLE_LAYER_NAME = 'DismissableLayer'

// Per-document so two React roots opening dismissable layers don't clobber each other's saved value.
const originalBodyPointerEvents = new WeakMap<Document, string>()

type DismissableLayerElement = React.ComponentRef<typeof Primitive.div>

export const DismissableLayerContext = React.createContext({
  layers: new Set<DismissableLayerElement>(),
  layersWithOutsidePointerEventsDisabled: new Set<DismissableLayerElement>(),
  branches: new Set<React.ComponentRef<typeof Primitive.div>>(),
})

const DismissableLayer = React.forwardRef<DismissableLayerElement, IDismissableLayer.IProps>((props, forwardedRef) => {
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
  // undefined → indexOf returns -1 (correct fallback); no non-null assert needed.
  const highestLayerWithOutsidePointerEventsDisabledIndex = highestLayerWithOutsidePointerEventsDisabled
    ? layers.indexOf(highestLayerWithOutsidePointerEventsDisabled)
    : -1
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
        originalBodyPointerEvents.set(ownerDocument, ownerDocument.body.style.pointerEvents)
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
          ownerDocument.body.style.pointerEvents = originalBodyPointerEvents.get(ownerDocument) ?? ''
          originalBodyPointerEvents.delete(ownerDocument)
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

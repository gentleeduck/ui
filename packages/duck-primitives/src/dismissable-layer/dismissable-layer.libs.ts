import * as React from 'react'
import { flushSync } from 'react-dom'
import { useCallbackRef } from '../hooks/use-callback-ref'
import type { IDismissableLayer } from './dismissable-layer.types'

export const CONTEXT_UPDATE = 'dismissableLayer.update'
export const POINTER_DOWN_OUTSIDE = 'dismissableLayer.pointerDownOutside'
export const FOCUS_OUTSIDE = 'dismissableLayer.focusOutside'

export function usePointerDownOutside(
  onPointerDownOutside?: (event: IDismissableLayer.PointerDownOutsideEvent) => void,
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

export function useFocusOutside(
  onFocusOutside?: (event: IDismissableLayer.FocusOutsideEvent) => void,
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

export function dispatchUpdate() {
  const event = new CustomEvent(CONTEXT_UPDATE)
  document.dispatchEvent(event)
}

export function handleAndDispatchCustomEvent<E extends CustomEvent, OriginalEvent extends Event>(
  name: string,
  handler: ((event: E) => void) | undefined,
  detail: { originalEvent: OriginalEvent } & (E extends CustomEvent<infer D> ? D : never),
  { discrete }: { discrete: boolean },
) {
  const target = detail.originalEvent.target
  const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail })
  if (handler) target.addEventListener(name, handler as EventListener, { once: true })

  if (discrete) {
    if (target) flushSync(() => target.dispatchEvent(event))
  } else {
    target.dispatchEvent(event)
  }
}

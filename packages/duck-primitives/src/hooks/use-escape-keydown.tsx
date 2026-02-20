import * as React from 'react'
import { useCallbackRef } from './use-callback-ref'

/**
 * Listens for the Escape key in the capture phase and calls the handler.
 * Accepts an optional ownerDocument for cross-frame support.
 */
function useEscapeKeydown(
  onEscapeKeyDownProp?: (event: KeyboardEvent) => void,
  ownerDocument: Document = globalThis?.document,
) {
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp)

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown(event)
      }
    }
    ownerDocument.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => ownerDocument.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [onEscapeKeyDown, ownerDocument])
}

export { useEscapeKeydown }

/**
 * Compose two handlers. Original runs first; ours runs after unless original called
 * preventDefault (opt out via `checkForDefaultPrevented: false`).
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event)

    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event)
    }
  }
}

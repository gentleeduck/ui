import { parseKeyBind } from '../parser/parser'
import type { Parser } from '../parser/parser.types'
import type { Matcher } from './matcher.types'

/** Tag names that are considered input elements for ignoreInputs */
const _INPUT_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

/** Input types that are considered button-like (not text entry) */
const BUTTON_INPUT_TYPES = new Set(['button', 'submit', 'reset'])

/**
 * Returns true if the given element is an input element where key bindings
 * should typically be ignored (text inputs, textareas, selects, contenteditable).
 *
 * Button-type inputs (button, submit, reset) are NOT considered input elements
 * for this purpose, so key bindings still fire when those are focused.
 */
export function isInputElement(el: Element | null): boolean {
  if (!el) return false

  const tag = el.tagName

  if (tag === 'INPUT') {
    const inputType = (el as HTMLInputElement).type?.toLowerCase()
    // Button-type inputs are not text entry
    if (BUTTON_INPUT_TYPES.has(inputType)) return false
    return true
  }

  if (tag === 'TEXTAREA' || tag === 'SELECT') return true

  const htmlEl = el as HTMLElement
  if (htmlEl.isContentEditable || htmlEl.contentEditable === 'true') return true

  return false
}

/**
 * Checks whether a KeyboardEvent matches a parsed key binding.
 *
 * @param parsed - The parsed key binding to match against
 * @param event - The keyboard event to check
 * @param options - Match options
 * @returns true if the event matches the key binding
 */
export function matchesKeyboardEvent(
  parsed: Parser.IParsedKeyBind,
  event: KeyboardEvent,
  options?: Matcher.IMatchOptions,
): boolean {
  const ignoreCase = options?.ignoreCase ?? true

  // Check modifier flags
  if (parsed.ctrl !== event.ctrlKey) return false
  if (parsed.alt !== event.altKey) return false
  if (parsed.meta !== event.metaKey) return false
  if (parsed.shift !== event.shiftKey) return false

  // Check the non-modifier key
  const eventKey = ignoreCase ? event.key.toLowerCase() : event.key
  const parsedKey = ignoreCase ? parsed.key.toLowerCase() : parsed.key

  // Handle alias matching (space, esc, etc.)
  const normalizedEventKey = eventKey === ' ' ? 'space' : eventKey === 'escape' ? 'esc' : eventKey

  return normalizedEventKey === parsedKey
}

/**
 * Creates a standalone event handler for a single key binding.
 *
 * @param config - The key binding handler configuration
 * @returns An event handler function
 *
 * @example
 * const handler = createKeyBindHandler({
 *   binding: 'Mod+S',
 *   handler: (e) => save(),
 *   options: { preventDefault: true }
 * })
 * document.addEventListener('keydown', handler)
 */
export function createKeyBindHandler(config: Matcher.IKeyBindHandlerConfig): (event: KeyboardEvent) => void {
  const parsed = parseKeyBind(config.binding)

  return (event: KeyboardEvent) => {
    const opts = config.options

    if (opts?.enabled === false) return

    if (opts?.ignoreInputs && isInputElement(event.target as Element)) return

    if (!matchesKeyboardEvent(parsed, event)) return

    if (opts?.preventDefault) event.preventDefault()
    if (opts?.stopPropagation) event.stopPropagation()

    config.handler(event)
  }
}

/**
 * Creates a standalone event handler that checks multiple key bindings.
 * First match wins.
 *
 * @param configs - Array of key binding handler configurations
 * @returns An event handler function
 */
export function createMultiKeyBindHandler(configs: Matcher.IKeyBindHandlerConfig[]): (event: KeyboardEvent) => void {
  const entries = configs.map((config) => ({
    parsed: parseKeyBind(config.binding),
    config,
  }))

  return (event: KeyboardEvent) => {
    for (const { parsed, config } of entries) {
      const opts = config.options

      if (opts?.enabled === false) continue

      if (opts?.ignoreInputs && isInputElement(event.target as Element)) continue

      if (!matchesKeyboardEvent(parsed, event)) continue

      if (opts?.preventDefault) event.preventDefault()
      if (opts?.stopPropagation) event.stopPropagation()

      config.handler(event)
      return // First match wins
    }
  }
}

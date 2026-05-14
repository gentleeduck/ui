import { parseKeyBind } from '../parser/parser'
import type { Parser } from '../parser/parser.types'
import type { Matcher } from './matcher.types'

const _INPUT_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

// button/submit/reset are <input> but not text-entry — bindings should still fire.
const BUTTON_INPUT_TYPES = new Set(['button', 'submit', 'reset'])

/**
 * True for text-entry elements (text inputs, textareas, selects, contenteditable)
 * where key bindings should be suppressed by `ignoreInputs`.
 */
export function isInputElement(el: Element | null): boolean {
  if (!el) return false

  const tag = el.tagName

  if (tag === 'INPUT') {
    const inputType = (el as HTMLInputElement).type?.toLowerCase()
    if (BUTTON_INPUT_TYPES.has(inputType)) return false
    return true
  }

  if (tag === 'TEXTAREA' || tag === 'SELECT') return true

  const htmlEl = el as HTMLElement
  if (htmlEl.isContentEditable || htmlEl.contentEditable === 'true') return true

  return false
}

/** Returns true if `event` matches `parsed`. Modifier flags must match exactly. */
export function matchesKeyboardEvent(
  parsed: Parser.IParsedKeyBind,
  event: KeyboardEvent,
  options?: Matcher.IMatchOptions,
): boolean {
  const ignoreCase = options?.ignoreCase ?? true

  if (parsed.ctrl !== event.ctrlKey) return false
  if (parsed.alt !== event.altKey) return false
  if (parsed.meta !== event.metaKey) return false
  if (parsed.shift !== event.shiftKey) return false

  const eventKey = ignoreCase ? event.key.toLowerCase() : event.key
  const parsedKey = ignoreCase ? parsed.key.toLowerCase() : parsed.key

  // Aliases: parser stores `space`/`esc` but events use ` `/`escape`.
  const normalizedEventKey = eventKey === ' ' ? 'space' : eventKey === 'escape' ? 'esc' : eventKey

  return normalizedEventKey === parsedKey
}

/** Creates an event handler that fires `config.handler` when `config.binding` matches. */
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

/** Event handler that checks multiple bindings; first match wins. */
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
      return
    }
  }
}

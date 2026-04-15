import { resolveMod } from '../platform/platform'
import type { Platform } from '../platform/platform.types'
import type { Parser } from './parser.types'

type IParsedKeyBind = Parser.IParsedKeyBind
type IValidationResult = Parser.IValidationResult

/**
 * Map of raw key aliases to their canonical names.
 * @internal
 */
export const KEY_ALIASES: Record<string, string> = {
  ' ': 'space',
  escape: 'esc',
  control: 'ctrl',
  cmd: 'meta',
  command: 'meta',
  opt: 'alt',
  option: 'alt',
}

/**
 * The set of recognized modifier key names (canonical form).
 */
export const MODIFIER_KEYS: ReadonlySet<string> = new Set(['ctrl', 'alt', 'meta', 'shift'])

/**
 * The canonical ordering for modifier keys when serializing.
 */
const MODIFIER_ORDER: ReadonlyArray<'alt' | 'ctrl' | 'meta' | 'shift'> = ['alt', 'ctrl', 'meta', 'shift']

/**
 * Normalizes a single key part to its canonical lowercase form.
 */
function normalizeKeyPart(part: string): string {
  // Check alias before lowering/trimming, since ' ' (space) would be trimmed away
  if (KEY_ALIASES[part]) return KEY_ALIASES[part]
  const lower = part.toLowerCase().trim()
  return KEY_ALIASES[lower] ?? lower
}

/**
 * Parses a key binding string into its structured components.
 *
 * Resolves the cross-platform 'mod' key to 'meta' (Mac) or 'ctrl' (Windows/Linux).
 *
 * @param binding - A key binding string like 'Mod+Shift+S' or 'ctrl+k'
 * @param platform - Optional platform override for Mod resolution
 * @returns The parsed key binding object
 *
 * @example
 * parseKeyBind('Mod+S', 'mac')
 * // { key: 's', ctrl: false, shift: false, alt: false, meta: true, modifiers: ['meta'] }
 */
export function parseKeyBind(binding: string, platform?: Platform): IParsedKeyBind {
  if (!binding?.trim()) {
    throw new Error('Key binding string cannot be empty')
  }

  const parts = binding.split('+').map((p) => p.trim().toLowerCase())
  const modifiers: Set<'ctrl' | 'alt' | 'meta' | 'shift'> = new Set()
  let key: string | null = null

  for (const raw of parts) {
    if (!raw) continue

    let normalized = normalizeKeyPart(raw)

    // Resolve 'mod' to platform-specific modifier
    if (normalized === 'mod') {
      normalized = resolveMod(platform)
    }

    if (MODIFIER_KEYS.has(normalized)) {
      modifiers.add(normalized as 'ctrl' | 'alt' | 'meta' | 'shift')
    } else {
      if (key !== null) {
        throw new Error(`Multiple non-modifier keys found: '${key}' and '${normalized}'`)
      }
      key = normalized
    }
  }

  if (key === null) {
    throw new Error(`No non-modifier key found in binding: '${binding}'`)
  }

  const sortedModifiers = MODIFIER_ORDER.filter((m) => modifiers.has(m))

  return {
    key,
    ctrl: modifiers.has('ctrl'),
    shift: modifiers.has('shift'),
    alt: modifiers.has('alt'),
    meta: modifiers.has('meta'),
    modifiers: sortedModifiers,
  }
}

/**
 * Normalizes a key binding string to its canonical form.
 *
 * Canonical form: modifiers in alphabetical order, all lowercase, joined by '+'.
 * Example: 'Shift+Mod+s' on Mac becomes 'meta+shift+s'
 *
 * @param binding - A key binding string
 * @param platform - Optional platform override
 * @returns The canonical key binding string
 */
export function normalizeKeyBind(binding: string, platform?: Platform): string {
  const parsed = parseKeyBind(binding, platform)
  const parts: string[] = [...parsed.modifiers, parsed.key]
  return parts.join('+')
}

/**
 * Validates a key binding string without throwing.
 *
 * Returns a result object with `valid`, `warnings`, and `errors` arrays.
 *
 * @param binding - A key binding string to validate
 * @returns The validation result
 */
export function validateKeyBind(binding: string): IValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!binding?.trim()) {
    errors.push('Key binding string cannot be empty')
    return { valid: false, warnings, errors }
  }

  const parts = binding.split('+').map((p) => p.trim().toLowerCase())
  const seenModifiers = new Set<string>()
  let nonModifierCount = 0

  for (const raw of parts) {
    if (!raw) {
      errors.push('Empty part found in key binding string')
      continue
    }

    let normalized = normalizeKeyPart(raw)

    // 'mod' resolves to a modifier, so treat it as one for validation
    if (normalized === 'mod') {
      normalized = 'ctrl' // use ctrl as placeholder for validation purposes
    }

    if (MODIFIER_KEYS.has(normalized)) {
      if (seenModifiers.has(normalized)) {
        errors.push(`Duplicate modifier: '${normalized}'`)
      }
      seenModifiers.add(normalized)
    } else {
      nonModifierCount++
    }
  }

  if (nonModifierCount === 0) {
    errors.push('No non-modifier key found')
  }

  if (nonModifierCount > 1) {
    errors.push('Multiple non-modifier keys found')
  }

  // Warnings
  if (seenModifiers.has('alt') && nonModifierCount === 1) {
    warnings.push('Alt+letter combinations may not work on macOS due to special characters')
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  }
}

/**
 * Builds a key descriptor from a KeyboardEvent (same format as canonical key binding).
 * Returns null for pure modifier key presses.
 *
 * @param e - The keyboard event
 * @returns The descriptor string or null
 */
export function keyboardEventToDescriptor(e: KeyboardEvent): string | null {
  if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return null

  const parts: string[] = []
  if (e.altKey) parts.push('alt')
  if (e.ctrlKey) parts.push('ctrl')
  if (e.metaKey) parts.push('meta')
  if (e.shiftKey) parts.push('shift')

  const key = normalizeKeyPart(e.key)
  parts.push(key)
  return parts.join('+')
}

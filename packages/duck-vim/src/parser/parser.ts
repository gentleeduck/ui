import { resolveMod } from '../platform/platform'
import type { Platform } from '../platform/platform.types'
import type { Parser } from './parser.types'

/** @internal Raw key aliases to canonical names. */
export const KEY_ALIASES: Record<string, string> = {
  ' ': 'space',
  escape: 'esc',
  control: 'ctrl',
  cmd: 'meta',
  command: 'meta',
  opt: 'alt',
  option: 'alt',
}

export const MODIFIER_KEYS: ReadonlySet<string> = new Set(['ctrl', 'alt', 'meta', 'shift'])

// Canonical serialization order — keep stable so normalized strings compare equally.
const MODIFIER_ORDER: ReadonlyArray<'alt' | 'ctrl' | 'meta' | 'shift'> = ['alt', 'ctrl', 'meta', 'shift']

function normalizeKeyPart(part: string): string {
  // Alias lookup before trim/lower because ' ' (space) would otherwise be lost.
  if (KEY_ALIASES[part]) return KEY_ALIASES[part]
  const lower = part.toLowerCase().trim()
  return KEY_ALIASES[lower] ?? lower
}

/**
 * Parses a binding like `Mod+Shift+S` into structured components.
 * `mod` resolves to `meta` on Mac and `ctrl` elsewhere via {@link resolveMod}.
 * @throws if empty, missing a non-modifier key, or containing multiple non-modifiers.
 */
export function parseKeyBind(binding: string, platform?: Platform.Kind): Parser.IParsedKeyBind {
  if (!binding?.trim()) {
    throw new Error('Key binding string cannot be empty')
  }

  const parts = binding.split('+').map((p) => p.trim().toLowerCase())
  const modifiers: Set<'ctrl' | 'alt' | 'meta' | 'shift'> = new Set()
  let key: string | null = null

  for (const raw of parts) {
    if (!raw) continue

    let normalized = normalizeKeyPart(raw)

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
 * Returns a canonical form: modifiers in {@link MODIFIER_ORDER}, lowercase, joined by `+`.
 * Example: `Shift+Mod+s` on Mac becomes `meta+shift+s`.
 */
export function normalizeKeyBind(binding: string, platform?: Platform.Kind): string {
  const parsed = parseKeyBind(binding, platform)
  const parts: string[] = [...parsed.modifiers, parsed.key]
  return parts.join('+')
}

/** Validates a binding without throwing; returns `valid`, `warnings`, `errors`. */
export function validateKeyBind(binding: string): Parser.IValidationResult {
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

    // Treat 'mod' as a modifier here; actual ctrl/meta resolution is platform-dependent.
    if (normalized === 'mod') {
      normalized = 'ctrl'
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

  // macOS Alt+letter emits special characters, so the keydown `key` won't match the letter.
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
 * Builds a canonical descriptor from a KeyboardEvent.
 * Returns `null` for pure modifier key presses (Shift/Ctrl/Alt/Meta alone).
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

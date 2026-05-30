import { resolveMod } from '../platform/platform'
import type { Platform } from '../platform/platform.types'
import type { Parser } from './parser.types'

/** Raw key aliases to canonical names. */
export const KEY_ALIASES = {
  ' ': 'space',
  escape: 'esc',
  control: 'ctrl',
  cmd: 'meta',
  command: 'meta',
  opt: 'alt',
  option: 'alt',
} as const satisfies Record<string, string>

/** Canonical (lowercase) modifier names recognised by the parser. */
export const MODIFIER_KEYS: ReadonlySet<string> = new Set(['ctrl', 'alt', 'meta', 'shift'])

/** `KeyboardEvent.key` values for pure modifier presses. */
export const MODIFIER_KEY_EVENT_NAMES: ReadonlySet<string> = new Set(['Shift', 'Control', 'Alt', 'Meta'])

/** Lowercased {@link MODIFIER_KEY_EVENT_NAMES} — `event.key.toLowerCase()` yields `'control'` not `'ctrl'`. */
export const MODIFIER_KEY_EVENT_NAMES_LOWER: ReadonlySet<string> = new Set(['shift', 'control', 'alt', 'meta'])

// Canonical serialization order — keep stable so normalized strings compare equally.
export const MODIFIER_ORDER: ReadonlyArray<'alt' | 'ctrl' | 'meta' | 'shift'> = ['alt', 'ctrl', 'meta', 'shift']

function tokenize(binding: string): string[] {
  return binding.split('+').map((p) => p.trim().toLowerCase())
}

function normalizeKeyPart(part: string): string {
  // Alias lookup before trim/lower because ' ' (space) would otherwise be lost.
  if (part in KEY_ALIASES) return KEY_ALIASES[part as keyof typeof KEY_ALIASES]
  const lower = part.toLowerCase().trim()
  return (KEY_ALIASES as Record<string, string>)[lower] ?? lower
}

/** Parse `Mod+Shift+S`. `mod` → `meta` on Mac, `ctrl` elsewhere. Throws on empty/missing-key/multi-key. */
export function parseKeyBind(binding: string, platform?: Platform.Kind): Parser.IParsedKeyBind {
  if (!binding?.trim()) {
    throw new Error('Key binding string cannot be empty')
  }

  const parts = tokenize(binding)
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

  const parts = tokenize(binding)
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
 *
 * Modifier order follows {@link MODIFIER_ORDER} so the output compares byte-equal
 * with anything produced by {@link parseKeyBind} → {@link normalizeKeyBind}.
 */
export function keyboardEventToDescriptor(e: KeyboardEvent): string | null {
  if (MODIFIER_KEY_EVENT_NAMES.has(e.key)) return null

  const parts: string[] = []
  if (e.altKey) parts.push('alt')
  if (e.ctrlKey) parts.push('ctrl')
  if (e.metaKey) parts.push('meta')
  if (e.shiftKey) parts.push('shift')

  const key = normalizeKeyPart(e.key)
  parts.push(key)
  return parts.join('+')
}

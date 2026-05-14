import { parseKeyBind } from '../parser/parser'
import { detectPlatform } from '../platform/platform'
import type { Platform } from '../platform/platform.types'
import type { Format } from './format.types'

/** Platform-specific modifier display names (ASCII only — no unicode glyphs). */
export const SYMBOL_MAP: Record<Platform.Kind, Record<string, string>> = {
  mac: {
    meta: 'Cmd',
    ctrl: 'Ctrl',
    alt: 'Opt',
    shift: 'Shift',
  },
  windows: {
    meta: 'Win',
    ctrl: 'Ctrl',
    alt: 'Alt',
    shift: 'Shift',
  },
  linux: {
    meta: 'Super',
    ctrl: 'Ctrl',
    alt: 'Alt',
    shift: 'Shift',
  },
}

export const LABEL_MAP: Record<string, string> = {
  space: 'Space',
  esc: 'Escape',
  enter: 'Enter',
  tab: 'Tab',
  backspace: 'Backspace',
  delete: 'Delete',
  arrowup: 'Up',
  arrowdown: 'Down',
  arrowleft: 'Left',
  arrowright: 'Right',
  pageup: 'PageUp',
  pagedown: 'PageDown',
  home: 'Home',
  end: 'End',
  insert: 'Insert',
}

/**
 * Formats a binding (e.g. `Mod+S`) using platform-aware modifier symbols.
 * `Mod` resolves to `Cmd` on mac and `Ctrl` elsewhere.
 */
export function formatForDisplay(binding: string, options?: Format.IFormatOptions): string {
  const platform = options?.platform ?? detectPlatform()
  const separator = options?.separator ?? '+'
  const parsed = parseKeyBind(binding, platform)
  const symbols = SYMBOL_MAP[platform]

  const parts: string[] = []

  for (const mod of parsed.modifiers) {
    parts.push(symbols[mod] ?? mod)
  }

  const displayKey = parsed.key.length === 1 ? parsed.key.toUpperCase() : capitalizeKey(parsed.key)
  parts.push(displayKey)

  return parts.join(separator)
}

/** Like {@link formatForDisplay} but uses verbose labels (e.g. `Escape` not `Esc`). */
export function formatWithLabels(binding: string, options?: Format.IFormatOptions): string {
  const platform = options?.platform ?? detectPlatform()
  const separator = options?.separator ?? ' + '
  const parsed = parseKeyBind(binding, platform)
  const symbols = SYMBOL_MAP[platform]

  const parts: string[] = []

  for (const mod of parsed.modifiers) {
    parts.push(symbols[mod] ?? mod)
  }

  const displayKey =
    LABEL_MAP[parsed.key] ?? (parsed.key.length === 1 ? parsed.key.toUpperCase() : capitalizeKey(parsed.key))
  parts.push(displayKey)

  return parts.join(separator)
}

function capitalizeKey(key: string): string {
  if (!key) return key
  return key.charAt(0).toUpperCase() + key.slice(1)
}

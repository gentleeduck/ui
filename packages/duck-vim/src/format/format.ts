import { parseKeyBind } from '../parser/parser'
import { detectPlatform } from '../platform/platform'
import type { Platform } from '../platform/platform.types'
import type { Format } from './format.types'

type IFormatOptions = Format.IFormatOptions

/**
 * Platform-specific modifier display names (ASCII only).
 */
export const SYMBOL_MAP: Record<Platform, Record<string, string>> = {
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

/**
 * Human-readable labels for special keys.
 */
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
 * Formats a key binding string for display using platform-aware modifier symbols.
 *
 * Uses ASCII text labels (no unicode symbols) per project convention.
 *
 * @param binding - A key binding string like 'Mod+S' or 'ctrl+shift+k'
 * @param options - Format options
 * @returns Formatted display string
 *
 * @example
 * formatForDisplay('Mod+S', { platform: 'mac' })
 * // 'Cmd+S'
 *
 * formatForDisplay('Mod+S', { platform: 'linux' })
 * // 'Ctrl+S'
 */
export function formatForDisplay(binding: string, options?: IFormatOptions): string {
  const platform = options?.platform ?? detectPlatform()
  const separator = options?.separator ?? '+'
  const parsed = parseKeyBind(binding, platform)
  const symbols = SYMBOL_MAP[platform]

  const parts: string[] = []

  for (const mod of parsed.modifiers) {
    parts.push(symbols[mod] ?? mod)
  }

  // Capitalize the key for display
  const displayKey = parsed.key.length === 1 ? parsed.key.toUpperCase() : capitalizeKey(parsed.key)
  parts.push(displayKey)

  return parts.join(separator)
}

/**
 * Formats a key binding string using verbose human-readable labels.
 *
 * @param binding - A key binding string
 * @param options - Format options
 * @returns Formatted label string
 *
 * @example
 * formatWithLabels('Mod+Shift+S', { platform: 'linux' })
 * // 'Ctrl + Shift + S'
 */
export function formatWithLabels(binding: string, options?: IFormatOptions): string {
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

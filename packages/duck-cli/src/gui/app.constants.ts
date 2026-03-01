import figlet from 'figlet'

/**
 * Generates the ASCII art banner synchronously to avoid render flicker.
 */
export function generateBanner(width: number): string {
  try {
    return figlet.textSync('gduck', { font: 'ANSI Shadow', whitespaceBreak: true, width })
  } catch {
    return 'gduck'
  }
}

export const SUBTITLE = 'by gentleduck.org'

/**
 * Color theme constants for the TUI.
 * Uses standard terminal color names so they inherit from
 * the user's terminal theme (light/dark mode compatible).
 */
export const THEME = {
  foreground: 'white',
  mutedForeground: 'gray',
  destructive: 'red',
  warning: 'yellow',
  success: 'green',
  border: 'gray',
  ring: 'cyan',
  surfaceForeground: 'gray',
} as const

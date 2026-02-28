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

export const MENU_ITEMS = [
  { label: 'Initialize Project', value: 'init' as const },
  { label: 'Add Components', value: 'add' as const },
  { label: 'List Components', value: 'list' as const },
  { label: 'Exit', value: 'exit' as const },
]

// Standard terminal colors -- inherits from the user's terminal theme
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

import figlet from 'figlet'

/** Synchronous to avoid render flicker on TUI startup. */
export function generateBanner(width: number): string {
  try {
    return figlet.textSync('gduck', { font: 'ANSI Shadow', whitespaceBreak: true, width })
  } catch {
    return 'gduck'
  }
}

export const SUBTITLE = 'by gentleduck.org'

/** Uses named ANSI colors so the user's terminal theme controls actual hues (light/dark agnostic). */
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

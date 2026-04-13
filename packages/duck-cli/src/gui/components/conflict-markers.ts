import { THEME } from '../app.constants'

/**
 * Return the display color for git-style conflict marker lines.
 * Returns null if the text is not a recognized conflict marker.
 *
 * Recognized markers:
 *   "<<<<<<< LOCAL"    -> THEME.destructive (red)
 *   "======="          -> THEME.warning (yellow)
 *   ">>>>>>> REGISTRY" -> THEME.success (green)
 */
export function getConflictMarkerColor(rawText: string): string | null {
  if (rawText === '<<<<<<< LOCAL') return THEME.destructive
  if (rawText === '=======') return THEME.warning
  if (rawText === '>>>>>>> REGISTRY') return THEME.success
  return null
}

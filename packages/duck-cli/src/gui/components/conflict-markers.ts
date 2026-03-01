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
export function get_conflict_marker_color(raw_text: string): string | null {
  if (raw_text === '<<<<<<< LOCAL') return THEME.destructive
  if (raw_text === '=======') return THEME.warning
  if (raw_text === '>>>>>>> REGISTRY') return THEME.success
  return null
}

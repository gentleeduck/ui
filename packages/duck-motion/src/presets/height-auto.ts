import { BLUR_CLEAR, BLUR_LIGHT } from './_utils'

/**
 * Height expand/collapse for accordion/collapsible. Use with `animate`
 * (not `AnimatePresence`) — element stays mounted and toggles visually.
 */
export const heightAuto = {
  open: { height: 'auto' as const, opacity: 1, filter: BLUR_CLEAR },
  closed: { height: 0, opacity: 0, filter: BLUR_LIGHT },
}

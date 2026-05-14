import { blurLight } from '../transitions/blur'

/**
 * Height expand/collapse for accordion/collapsible. Use with `animate`
 * (not `AnimatePresence`) — element stays mounted and toggles visually.
 */
export const heightAuto = {
  open: { height: 'auto' as const, opacity: 1, filter: 'blur(0px)' },
  closed: { height: 0, opacity: 0, filter: `blur(${blurLight}px)` },
}

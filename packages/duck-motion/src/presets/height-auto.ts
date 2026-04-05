import { blurLight } from '../transitions/blur'

/**
 * Height expand/collapse preset for accordion and collapsible content.
 *
 * Open state: height auto, full opacity, no blur.
 * Closed state: height 0, transparent, light blur.
 *
 * Use with motion's `animate` prop (not AnimatePresence) since the element
 * stays mounted and toggles between open/closed visually.
 */
export const heightAuto = {
  open: { height: 'auto' as const, opacity: 1, filter: 'blur(0px)' },
  closed: { height: 0, opacity: 0, filter: `blur(${blurLight}px)` },
}

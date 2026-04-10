import type { MotionTransitionConfig } from '../presets/types'

/** Default spring with subtle bounce. General-purpose spring for most animations. visualDuration 0.25s, bounce 0.2. */
export const springDefault: MotionTransitionConfig = { type: 'spring', visualDuration: 0.25, bounce: 0.2 }

/** Snappy spring with less bounce. Use for menus, dropdowns, popovers where responsiveness matters. visualDuration 0.2s, bounce 0.15. */
export const springSnappy: MotionTransitionConfig = { type: 'spring', visualDuration: 0.2, bounce: 0.15 }

/** Gentle spring with more bounce and longer duration. Use for dialogs, sheets, drawers. visualDuration 0.35s, bounce 0.25. */
export const springGentle: MotionTransitionConfig = { type: 'spring', visualDuration: 0.35, bounce: 0.25 }

/** Stiff spring for urgent interactions. Use for alert dialogs and destructive confirmations. stiffness 400, damping 30. */
export const springStiff: MotionTransitionConfig = { type: 'spring', stiffness: 400, damping: 30 }

/** Near-instant spring for reduced motion fallback. Resolves immediately while keeping AnimatePresence lifecycle. stiffness 1000, damping 100. */
export const springInstant: MotionTransitionConfig = { type: 'spring', stiffness: 1000, damping: 100 }

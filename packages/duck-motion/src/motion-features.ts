/** Lazy `domAnimation` bundle (~5KB): animate, exit, variants, hover, tap, focus. */
export const loadDomAnimation = () => import('motion/react').then((mod) => mod.domAnimation)

/** Lazy `domMax` bundle (~34KB): adds layout, drag, pan, viewport detection. */
export const loadDomMax = () => import('motion/react').then((mod) => mod.domMax)

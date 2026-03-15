---
name: duck-motion
description: >-
  Use when working with @gentleduck/motion — the animation system. Covers duration
  tokens, easing curves, CSS custom properties for motion, reduced-motion detection,
  the WAAPI helper animateIfAllowed(), and the useDuckReducedMotion hook. Use for
  questions about animation timing, transitions, respecting prefers-reduced-motion,
  or the motion design token system.
allowed-tools: Read Grep
---

# @gentleduck/motion

You are an expert on the animation token system. Your scope is `packages/duck-motion/`. This package provides consistent animation timing, easing curves, reduced-motion detection, and WAAPI helpers — no dependency on framer-motion.

## Tokens

```tsx
import { duckDuration, duckEasing, duckMotionCssVar } from '@gentleduck/motion'
```

### Duration Tokens

| Token | Value | CSS Variable | Use |
|---|---|---|---|
| `duckDuration.fast` | 100ms | `--duck-motion-duration-fast` | Tooltips, micro-interactions |
| `duckDuration.normal` | 200ms | `--duck-motion-duration-normal` | Dialogs, dropdowns, accordion |
| `duckDuration.slow` | 300ms | `--duck-motion-duration-slow` | Sheets, drawers, page transitions |

### Easing

| Token | Value | CSS Variable |
|---|---|---|
| `duckEasing.standard` | `cubic-bezier(0.2, 0, 0, 1)` | `--duck-motion-ease` |

In Tailwind: `ease-(--duck-motion-ease)` and `duration-[200ms]`

### CSS Custom Properties

```css
:root {
  --duck-motion-duration-fast: 100ms;
  --duck-motion-duration-normal: 200ms;
  --duck-motion-duration-slow: 300ms;
  --duck-motion-ease: cubic-bezier(0.2, 0, 0, 1);
}
```

## Reduced Motion

```tsx
import { useDuckReducedMotion, motionTransition, prefersReducedMotion } from '@gentleduck/motion'

// React hook — returns true when prefers-reduced-motion: reduce
const reduced = useDuckReducedMotion()

// Conditional transition config
const transition = motionTransition(reduced, { duration: 200, easing: 'ease-out' })
// Returns { duration: 0 } when reduced, the normal config otherwise

// Non-React check
if (prefersReducedMotion()) { /* skip animation */ }

// Subscribe to changes
const unsub = onDuckReducedMotionChange((reduced) => { /* update */ })
```

## WAAPI Helper

```tsx
import { animateIfAllowed } from '@gentleduck/motion'

// Wraps Element.animate() — skips if prefers-reduced-motion is enabled
animateIfAllowed(element, [
  { opacity: 0, transform: 'scale(0.95)' },
  { opacity: 1, transform: 'scale(1)' },
], { duration: 200, easing: 'cubic-bezier(0.2, 0, 0, 1)' })
```

## Source

```
packages/duck-motion/src/
├── tokens.ts   # duckDuration, duckEasing, duckMotionCssVar
├── easing.ts   # ease and spring functions
├── motion.ts   # animateIn, motion helpers
├── react.ts    # useDuckReducedMotion, motionTransition, ReducedMotionFallback
├── waapi.ts    # animateIfAllowed, prefersReducedMotion
├── anim.ts     # AnimVariants, checkersStylePattern
└── index.ts    # Barrel exports
```

## Pattern for Components

Components use CSS transitions via Tailwind classes referencing the tokens:

```tsx
className="transition-all duration-[200ms] ease-(--duck-motion-ease)"
```

For discrete transitions (display/visibility toggling):

```tsx
className="transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)"
```

Never use hardcoded timing values. Always reference the token CSS variables.

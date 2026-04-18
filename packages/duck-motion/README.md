<p align="center">
  <img src="../../public/logo-dark.svg" alt="gentleduck/ui" width="80"/>
</p>

# @gentleduck/motion

Animation tokens, presets, and reduced motion support for the gentleduck ecosystem. Optionally integrates with the motion library for rich enter/exit animations.

## Quick Start

```bash
bun add @gentleduck/motion
```

```tsx
import { useDuckReducedMotion, motionTransition } from '@gentleduck/motion'

function Fade() {
  const reduced = useDuckReducedMotion()
  const transition = motionTransition(reduced, { duration: 200, easing: 'ease-out' })
  // ...
}
```

## Features

- **Easing presets** -- `duckEasing.standard`, `duckEasing.spring`
- **Duration tokens** -- `duckDuration.fast` (150ms), `.normal` (200ms), `.slow` (300ms)
- **Spring transitions** -- `duckSpringDefault`, `duckSpringSnappy`, `duckSpringGentle`
- **CSS custom properties** -- `--gentleduck-motion-dur`, `--gentlegentleduck-motion-ease` via `@gentleduck/motion/css`
- **Reduced motion** -- `useDuckReducedMotion()`, `motionTransition()`, `onDuckReducedMotionChange()`
- **Animation presets** -- tree-shakeable presets like `fadeIn`, `scaleIn`, `slideUp` with blur and asymmetric exits
- **Directional presets** -- `createDirectionalPreset('bottom')` for menu/popover animations
- **Motion library integration** -- `MotionProvider`, `LazyMotion` feature loaders, `useMotionPreset` hook

## Exports

| Entry point | What it provides |
| --- | --- |
| `@gentleduck/motion` | Tokens, easing, reduced motion hooks, CVA animation variants |
| `@gentleduck/motion/css` | CSS file with motion custom properties and reduced motion fallback |
| `@gentleduck/motion/motion-tokens` | Duration/easing mapped to motion Transition objects, spring presets |
| `@gentleduck/motion/motion-presets` | `useMotionPreset`, `useDirectionalPreset`, `loadPreset` hooks |
| `@gentleduck/motion/motion-features` | `loadDomAnimation`, `loadDomMax` LazyMotion feature loaders |
| `@gentleduck/motion/motion-provider` | `MotionProvider` wrapping LazyMotion + MotionConfig |
| `@gentleduck/motion/presets` | Individual tree-shakeable preset exports (`fadeIn`, `scaleIn`, etc.) |
| `@gentleduck/motion/presets/fade-in` | Single preset import for best tree-shaking |

## License

MIT

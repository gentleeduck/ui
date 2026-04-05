<p align="center">
  <img src="../../public/logo-dark.svg" alt="gentleduck/ui" width="80"/>
</p>

# @gentleduck/motion

Animation tokens and reduced motion support.

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
- **CSS custom properties** -- `--duck-motion-dur`, `--duck-motion-ease` via `@gentleduck/motion/css`
- **Reduced motion** -- `useDuckReducedMotion()`, `motionTransition()`, `onDuckReducedMotionChange()`
- **WAAPI helpers** -- `animateIfAllowed()`, `prefersReducedMotion()`
- **Animate in** -- `animateIn()` for entrance animations

## Exports

| Entry point | What it provides |
| --- | --- |
| `@gentleduck/motion` | All JS exports (tokens, react, waapi, motion) |
| `@gentleduck/motion/css` | CSS file with motion custom properties and reduced motion fallback |

## License

MIT

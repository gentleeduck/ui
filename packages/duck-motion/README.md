# @gentleduck/motion

A lightweight motion toolkit for gentleduck/ui packages.

> It's for gentleduck internal use only

## Installation

```bash
bun add @gentleduck/motion
```

## API

- `@gentleduck/motion/css`
  - Motion tokens (`--duck-motion-ease`, `--duck-motion-dur`)
  - Global `prefers-reduced-motion` fallback policy
- `tokens`
  - `duckEasing`
  - `duckDuration`
  - `duckMotionCssVar`
- `react`
  - `useDuckReducedMotion()`
  - `motionTransition(reduced, normal)`
  - `onDuckReducedMotionChange(callback)`
- `waapi`
  - `prefersReducedMotion()`
  - `animateIfAllowed(element, keyframes, options, reducedMotion?)`
- `motion`
  - `animateIn(element, keyframes?, options?)`
  - `motion` (named alias for backward compatibility)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/gentleeduck/duck-ui).

## License

[MIT © gentleduck](./LICENSE)

}
  title="Experimental: Not Production Ready"
  tone="warning">
`@gentleduck/motion` is currently in active development and is **not ready for production use**. Expect API changes and breaking updates between releases.

## Philosophy

`@gentleduck/motion` is a small motion layer. It ships shared easing and duration tokens plus reduced-motion handling so transitions stay consistent across packages.

## Installation

```bash
npm install @gentleduck/motion
```

## Usage

```tsx

```

```tsx
function App() {
  return (

  )
}
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Content to render inside the provider |
| `transition` | `Transition` | `{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }` | Global default transition |
| `enterTransition` | `Transition` | — | Override transition for enter animations only |
| `exitTransition` | `Transition` | — | Override transition for exit animations only |
| `reducedMotion` | `'user' \| 'always' \| 'never'` | `'user'` | Reduced-motion strategy passed to `MotionConfig` |
| `features` | `() => Promise
```

| Variant | Values | Description |
| --- | --- | --- |
| `type` | `'checkbox' \| 'radio' \| 'switch'` | Control type — drives shape, padding, and animation direction |
| `indicatorState` | `'default' \| 'both' \| 'indicatorReady' \| 'checkedIndicatorReady'` | Mask image strategy for the indicator SVG |

---

## Reduced-motion API

### `useDuckReducedMotion`

Returns `true` if the user prefers reduced motion. Uses `useSyncExternalStore` for efficient media query subscription.

```tsx

function MyComponent() {
  const reduced = useDuckReducedMotion()
  return 
}
```

### `motionTransition`

Returns the `normal` transition, or `{ duration: 0 }` when `reduced` is `true`.

```tsx

const reduced = useDuckReducedMotion()
const transition = motionTransition(reduced, tweenNormal)
```

### `onDuckReducedMotionChange`

Subscribe to changes in the reduced-motion preference. Returns an unsubscribe function.

```tsx

const unsubscribe = onDuckReducedMotionChange(() => {
  console.log('reduced motion preference changed')
})
```

### `getDuckReducedMotionServerSnapshot`

SSR-safe snapshot — always returns `false` on the server.

```tsx

const reduced = getDuckReducedMotionServerSnapshot() // false
```

### `IReducedMotionFallback`

Type for the reduced-motion fallback object `{ duration: 0 }`.

```tsx

```

---

## Backward-compat tokens

These tokens are still exported but prefer the newer names.

```tsx

```

| Export | Maps to | Description |
| --- | --- | --- |
| `duckDuration` | `duckMotionDurationMs` | Duration values in milliseconds |
| `duckEasing` | `duckMotionEasingCss` | Easing as CSS `cubic-bezier()` strings |
| `duckMotionCssVar` | — | CSS variable references with fallbacks |

---

## CSS entrypoint

```tsx

```

Provides motion tokens and `prefers-reduced-motion` defaults:

- `--gentleduck-motion-ease` — cubic-bezier easing curve
- `--gentleduck-motion-spring` — spring-like easing via `linear()` keyframe stops
- `--gentleduck-motion-dur` — default duration (150ms)
## Philosophy

Responsive media needs dimensional constraints. AspectRatio solves the CSS aspect-ratio problem with a clean component API, preventing layout shifts when images and videos load. The `ratio` prop is the only knob you need  -  everything else is handled by the container's CSS.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add aspect-ratio
```

Install the following dependencies:

```bash
npm install @gentleduck/primitives @gentleduck/libs
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx

```

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionAspectRatio` for a smooth scale + blur entrance animation powered by [motion](https://motion.dev). The content scales from 0.95 and unblurs on mount.

}>
Requires the `motion` package. Use `MotionAspectRatio` instead of `AspectRatio`. Same props. Note: `MotionAspectRatio` renders a `div` instead of using `Slot`/`asChild`.

## API Reference

### AspectRatio

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `ratio` | `number` | (required) | Aspect ratio of the container, e.g. `16/9`, `4/3` |
| `className` | `string` | `--` | Additional class names to apply to the container |
| `style` | `React.CSSProperties` | `--` | Inline styles applied to the container (aspect-ratio is merged automatically) |
| `children` | `React.ReactNode` | `--` | Child element to render inside the aspect-ratio container |
| `...props` | `React.ComponentPropsWithoutRef<typeof Slot>` | - | Additional props inherited from `Slot`. |

*Uses a `Slot` wrapper, so the child element receives the aspect-ratio styles.*

### MotionAspectRatio

Renders a `div` (not `Slot`) that scales from 0.95 with 8px blur fade on mount using `contentTransition` (250ms expo-out). Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `AspectRatioProps` | - | All props from `AspectRatio` are supported |
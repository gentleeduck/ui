## Philosophy

Loading states deserve the same design attention as loaded states. Skeleton placeholders reduce perceived wait time by hinting at the shape of incoming content. We keep this component prop-less intentionally  -  you control the shape through `className` and layout, mirroring the actual content it replaces.

For icon-only UIs, keep a compact icon-sized skeleton instead of removing the skeleton entirely, so layout stability is preserved while loading.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add skeleton
```

Install the following dependencies:

```bash
npm install @gentleduck/libs 
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx

```

```tsx

```

## Examples

### Card

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionSkeleton` for staggered entrance animations powered by [motion](https://motion.dev). Each skeleton block fades in with scale and blur, staggered by 50ms via the `index` prop.

}>
Requires the `motion` package. Use `MotionSkeleton` instead of `Skeleton`. Same props plus `index` for stagger delay. The regular `Skeleton` is perfectly fine - this is an optional enhancement.

## API Reference

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS class names to control shape and size |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionSkeleton

Staggered `scaleIn` entrance with `springBouncy` transition. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay index (50ms per index) for entrance animation |
| `...props` | `SkeletonProps` | - | All props from `Skeleton` are supported |
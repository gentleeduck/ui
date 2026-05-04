## Philosophy

Visual hierarchy needs breathing room. The Separator creates semantic and visual boundaries between content sections. We expose `orientation` as the only meaningful prop because a divider's job is to divide  -  its value comes from where you place it, not how you configure it.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add separator
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

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionSeparator` for a smooth expand-from-center animation powered by [motion](https://motion.dev). Horizontal separators scale along the X axis, vertical ones along Y.

}>
Requires the `motion` package. Use `MotionSeparator` instead of `Separator`. Same props. The regular `Separator` is perfectly fine - this is an optional enhancement.

## API Reference

### Separator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Controls the orientation of the separator line |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS class names |
| `...props` | `React.HTMLProps<HTMLHRElement>` | - | Additional props to spread to the hr element |

### MotionSeparator

Expands from center with `springBouncy` transition — scales along X for horizontal, Y for vertical. Renders a `div` with `role="separator"` instead of `hr`. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Controls the orientation and animation axis |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override |
| `className` | `string` | - | Additional CSS class names |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Additional props to spread to the div element |
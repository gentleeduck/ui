## Philosophy

When a single line isn't enough, Textarea steps in. It's the same design philosophy as Input  -  a thin wrapper around the native element with consistent styling. We don't add auto-resize or character counting because those are features you compose on top, not defaults everyone pays for.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add textarea
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

### Default

### Disabled

### With Label

### With Text

### With Button

### Form

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionTextarea` for a smooth entrance animation powered by [motion](https://motion.dev). The textarea fades in with scale and blur on mount using `springBouncy`.

}>
Requires the `motion` package. Use `MotionTextarea` instead of `Textarea`. Same props. The regular `Textarea` is perfectly fine - this is an optional enhancement.

## API Reference

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | - | Additional CSS class names |
| `...props` | `React.HTMLProps<HTMLTextAreaElement>` | - | Additional props to spread to the textarea element |

### MotionTextarea

`scaleIn` entrance with `springBouncy` transition on mount. Requires the `motion` package.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `TextareaProps` | - | All props from `Textarea` are supported |

## See also

- [Input](/duck-ui/components/input)  -  Single-line text input
- [Label](/duck-ui/components/label)  -  Accessible label for form controls
## Philosophy

The input is the most fundamental form primitive  -  a single line of text entry. We keep it deliberately thin: one component, no sub-parts, just a styled `
```

## Examples

### Default

### File

### Disabled

### With Label

### With Button

### Form

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/duck-ui/issues).

Use `MotionInput` for a fade+blur entrance animation powered by [motion](https://motion.dev). Pass `index` for stagger delay when used in forms.

}>
Requires the `motion` package. Use `MotionInput` instead of `Input`. All props stay the same.

## API Reference

### Input

A styled `<input>` element that accepts all standard HTML input attributes.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `React.HTMLInputTypeAttribute` | `--` | The HTML input type (e.g., `'text'`, `'password'`, `'email'`, `'file'`). Browsers default to `'text'`. |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction override. Resolved via `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `className` | `string` | `--` | Additional CSS classes to apply |
| `ref` | `React.Ref<HTMLInputElement>` | `--` | Ref forwarded to the underlying `<input>` element |
| `...props` | `React.HTMLProps<HTMLInputElement>` | - | Additional props to spread to the input element |

### MotionInput

Same props as `Input` plus an optional `index` prop for stagger delay (50ms per index). Adds fade+blur entrance animation. Requires the `motion` package.

## See also

- [Textarea](/duck-ui/components/textarea)  -  Multi-line text input
- [Label](/duck-ui/components/label)  -  Accessible label for form controls
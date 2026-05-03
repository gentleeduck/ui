```tsx

```

## Anatomy

```tsx

```

---

## Example

```tsx

function BoldToggle() {
  return (

  )
}
```

---

## API

### `Toggle.Root`

A button that toggles between on and off states. Renders a `<button>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pressed` | `boolean` | - | Controlled pressed state |
| `defaultPressed` | `boolean` | `false` | Initial pressed state |
| `onPressedChange` | `(pressed: boolean) => void` | - | Called when pressed state changes |
| `disabled` | `boolean` | `false` | Disables the toggle |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction |
| `asChild` | `boolean` | - | Render as child element |

Exposes `aria-pressed`, `data-state` (`on` | `off`), and `data-disabled` attributes.
```tsx

```

## Anatomy

```tsx

```

---

## Example

```tsx

function PopoverArrow() {
  return 
}
```

### Custom shape with `asChild`

```tsx

```

---

## API

### `Arrow.Arrow`

Renders an SVG arrow. By default, it renders a downward triangle polygon.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number` | `10` | SVG width |
| `height` | `number` | `5` | SVG height |
| `asChild` | `boolean` | - | Render as child element |
| `children` | `React.ReactNode` | - | Custom SVG contents when using `asChild` |
| `...props` | `React.ComponentPropsWithoutRef<typeof Primitive.svg>` | - | Native SVG props |

---

## Notes

- `Arrow` is commonly used by `popover`, `tooltip`, and menu-like floating content.
- If the arrow is decorative only, set `aria-hidden="true"` on the rendered element.
- Because it renders an SVG element, it can be styled via `fill`, `stroke`, and CSS variables.
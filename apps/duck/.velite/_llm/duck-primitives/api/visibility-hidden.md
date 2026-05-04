```tsx

```

## Anatomy

```tsx

      
  <VisuallyHidden.Root>Open notifications</VisuallyHidden.Root>

```

---

## API

### `VisuallyHidden` / `Root`

Renders a visually hidden `<span>` using an accessibility-safe clipping pattern.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | - | Render as child element |
| `style` | `React.CSSProperties` | - | Additional inline styles merged after hidden defaults |
| `...props` | `React.ComponentPropsWithoutRef<typeof Primitive.span>` | - | Native span props |

---

## Accessibility guidance

- Use this primitive when text must be available to assistive tech but not visible.
- Prefer it for icon-only controls, additional context labels, and hidden headings.
- Do not use it to hide interactive controls from visual users; use proper conditional rendering for that case.
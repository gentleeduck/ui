}>

gentleduck/primitives ship with **zero CSS**. Every component renders semantic HTML with data attributes that describe its state. You provide all visual styles.

## The approach

gentleduck/primitives ship with zero CSS. Every component renders semantic HTML with data attributes that describe its state. You provide all visual styles using whatever method you prefer.

---

## Styling options

  Tailwind CSS
  CSS
  CSS Modules
  CSS-in-JS

The simplest approach. Apply utility classes directly:

```tsx

```

Target `data-state` and other data attributes in plain CSS:

```css
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.dialog-overlay[data-state="open"] {
  animation: fadeIn 200ms ease;
}

.dialog-overlay[data-state="closed"] {
  animation: fadeOut 200ms ease;
}

.menu-item[data-highlighted] {
  background: #f3f4f6;
}

.menu-item[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}
```

```tsx

```

Works with any CSS-in-JS library. Use `asChild` to apply styled components:

```tsx
const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
`

```

---

## Data attributes reference

}>

Primitives expose their state via `data-*` attributes on rendered elements. Use these for CSS-only styling based on state  -  no JavaScript needed.

| Attribute | Values | Used by |
| --- | --- | --- |
| `data-state` | `open`, `closed` | Dialog, Popover, Tooltip, HoverCard |
| `data-state` | `checked`, `unchecked`, `indeterminate` | Menu CheckboxItem, RadioItem |
| `data-state` | `complete`, `loading`, `indeterminate` | Progress |
| `data-state` | `delayed-open`, `instant-open`, `closed` | Tooltip |
| `data-disabled` | (present/absent) | Items, triggers |
| `data-highlighted` | (present/absent) | Menu items |
| `data-side` | `top`, `right`, `bottom`, `left` | Popper content |
| `data-align` | `start`, `center`, `end` | Popper content |
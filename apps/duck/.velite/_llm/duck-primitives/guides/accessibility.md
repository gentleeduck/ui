}>

Every primitive implements the correct **WAI-ARIA** pattern for its component type. This guide explains what you get for free and what you still need to provide.

## What primitives handle automatically

### Dialog / Alert Dialog
- `role="dialog"` (or `role="alertdialog"`)
- `aria-labelledby` connected to Title
- `aria-describedby` connected to Description
- `aria-modal="true"` for modal dialogs
- Focus trap: 

```

### Respect reduced motion

}>

Wrap animations in `prefers-reduced-motion` queries so users who are sensitive to motion have a comfortable experience.

```css
@media (prefers-reduced-motion: reduce) {
  .overlay, .content {
    animation: none !important;
  }
}
```

---

## Keyboard navigation summary

| Component | Keys |
| --- | --- |
| Dialog | <Kbd>Escape</Kbd> close, <Kbd>Tab</Kbd> / <Kbd>Shift+Tab</Kbd> cycle focus |
| Popover | <Kbd>Escape</Kbd> close, <Kbd>Tab</Kbd> move focus |
| Tooltip | <Kbd>Escape</Kbd> close, focus-triggered |
| Menu | Arrow keys navigate, <Kbd>Enter</Kbd> / <Kbd>Space</Kbd> activate, <Kbd>Escape</Kbd> close |
| Menubar | <Kbd>ArrowLeft</Kbd> / <Kbd>ArrowRight</Kbd> switch menus, <Kbd>ArrowUp</Kbd> / <Kbd>ArrowDown</Kbd> navigate items |
| Progress | None (display-only) |
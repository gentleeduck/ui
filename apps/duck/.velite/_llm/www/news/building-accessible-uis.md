## Accessibility Is Not Optional

Keyboard navigation, screen reader support, focus management, and ARIA are requirements, not extras. Implementing them by hand is tedious and easy to get wrong.

`@gentleduck/primitives` handles the hard parts. You handle design and business logic.

---

## What Primitives Handle For You

### Focus Management

When a dialog opens, focus must move into it. When it closes, focus must return to
the trigger. Tab must cycle within the dialog and not escape to the page behind it.

Primitives handle all of this:

- **Focus trapping** — Tab and Shift+Tab cycle inside modal surfaces.
- **Focus restoration** — focus returns to the trigger on close.
- **Initial focus** — configurable initial target.
- **Focus scope** — nested focus contexts for complex UIs.

### Keyboard Navigation

Every primitive supports full keyboard interaction:

| Primitive | Keyboard Support |
| --- | --- |
| **Dialog** | Escape to close, Tab to cycle focus |
| **Dropdown Menu** | Arrow keys to navigate, Enter to select, Escape to close |
| **Select** | Arrow keys to browse, Enter to select, type-ahead search |
| **Slider** | Arrow keys for value, Home/End for range |
| **Tabs** | Arrow keys to switch, focus follows selection |
| **Navigation Menu** | Arrow keys between items, Enter to activate |

### ARIA Attributes

Primitives set the correct ARIA roles, states, and properties automatically:

```tsx
// You write this:

          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          {children}

  )
}
```

Focus trapping, Escape handling, ARIA attributes, and click-outside dismissal are all handled.

---

## Getting Started

```bash
bun add @gentleduck/primitives
```
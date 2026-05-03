```tsx

```

## Anatomy

```tsx

        {/* Optional custom anchor point */}
      {/* Optional */}
          {/* Optional */}

```

---

## Example

```tsx

function UserMenu() {
  return (

  )
}
```

---

## API

### `Popover.Root`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(open: boolean) => void` | - | Called on state change |
| `modal` | `boolean` | `false` | Enable modal behavior (focus trap, scroll lock) |
| `dir` | `'ltr' \| 'rtl'` | - | Reading direction for keyboard navigation |

### `Popover.Trigger`

Toggles the popover. Sets `aria-expanded` and `aria-controls` automatically.

### `Popover.Anchor`

}>

Optional custom anchor point. By default, content is positioned relative to the Trigger. Use Anchor to position relative to a different element.

### `Popover.Portal`

Portals content to `document.body`.

### `Popover.Content`

The floating content. Positioned by the Popper engine relative to the trigger.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side |
| `sideOffset` | `number` | `0` | Distance from anchor in pixels |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along the side |
| `alignOffset` | `number` | `0` | Alignment offset in pixels |
| `forceMount` | `true` | - | Keep mounted always |
| `onOpenAutoFocus` | `(event) => void` | - | Intercept auto-focus |
| `onCloseAutoFocus` | `(event) => void` | - | Intercept focus restoration |
| `onPointerDownOutside` | `(event) => void` | - | Called on outside click |
| `onFocusOutside` | `(event) => void` | - | Called when focus moves outside |
| `onInteractOutside` | `(event) => void` | - | Called for any outside interaction |
| `onEscapeKeyDown` | `(event) => void` | - | Called on <Kbd>Escape</Kbd> press |
| `trapFocus` | `boolean` | `context.open` | Override whether focus is trapped inside the content |
| `disableOutsidePointerEvents` | `boolean` | `context.open` | Override whether pointer events outside are blocked |
| `lockScroll` | `boolean` | `context.open` | Override whether body scroll is locked while open |

The `trapFocus`, `disableOutsidePointerEvents`, and `lockScroll` props default to the popover's open state. Override them when integrating with animation libraries like [motion](https://motion.dev) that need custom lifecycle control during exit animations.

### `Popover.Arrow`

Optional visual arrow pointing toward the anchor.

### `Popover.Close`

Button that closes the popover.

---

## Keyboard interactions

| Key | Action |
| --- | --- |
| <Kbd>Space</Kbd> / <Kbd>Enter</Kbd> | Toggle popover (on Trigger) |
| <Kbd>Escape</Kbd> | Close popover |
| <Kbd>Tab</Kbd> | Move focus within content, then out (non-modal) or wrap (modal) |
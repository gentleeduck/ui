```tsx

```

## Anatomy

```tsx

```

---

## Example

```tsx

function DeleteConfirmation() {
  return (

            Delete your account?

            This will permanently delete your account and all associated data.

              Cancel

              Delete

  )
}
```

---

## API

### `Dialog.Root`

The root component that manages open/closed state and provides context to all children.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Called when the open state should change |
| `modal` | `boolean` | `true` | When `true`, enables focus trapping, scroll lock, and hides other content from screen readers |
| `dir` | `'ltr' \| 'rtl'` | - | Reading direction for keyboard navigation |

### `Dialog.Trigger`

Button that toggles the dialog. Renders a `<button>` by default.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | - | Render as the child element instead of a `<button>` |

Sets `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`, and `data-state` automatically.

### `Dialog.Portal`

Renders children into `document.body` (or a custom container) via React portal.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `Element \| null` | `document.body` | Portal target |
| `forceMount` | `true` | - | Force mount content (bypasses Presence) |

### `Dialog.Overlay`

Renders an overlay behind the content. Only renders when `modal` is `true`. Automatically locks body scroll.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `true` | - | Keep mounted regardless of open state |
| `asChild` | `boolean` | - | Render as child element |
| `lockScroll` | `boolean` | `context.open` | Override whether body scroll is locked |

Exposes `data-state="open"` / `data-state="closed"` for CSS animation.

### `Dialog.Content`

The content area. Handles focus trapping (modal), dismiss-on-click-outside, and escape-to-close.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `true` | - | Keep mounted regardless of open state |
| `onOpenAutoFocus` | `(event: Event) => void` | - | Called when focus moves into content on open. Call `event.preventDefault()` to prevent auto-focus. |
| `onCloseAutoFocus` | `(event: Event) => void` | - | Called when focus moves back to trigger on close |
| `onPointerDownOutside` | `(event) => void` | - | Called when clicking outside. Prevent default to block close. |
| `onFocusOutside` | `(event) => void` | - | Called when focus moves outside |
| `onInteractOutside` | `(event) => void` | - | Called for any outside interaction |
| `onEscapeKeyDown` | `(event) => void` | - | Called when <Kbd>Escape</Kbd> is pressed. Prevent default to block close. |
| `trapFocus` | `boolean` | `context.open` | Override whether focus is trapped inside the content |
| `disableOutsidePointerEvents` | `boolean` | `context.open` | Override whether pointer events outside are blocked |

The `trapFocus` and `disableOutsidePointerEvents` props default to the dialog's open state. Override them when integrating with animation libraries like [motion](https://motion.dev) that need custom lifecycle control during exit animations.

Sets `role="dialog"`, `aria-labelledby` (linked to Title), and `aria-describedby` (linked to Description).

### `Dialog.Title`

Accessible title. Renders an `<h2>` by default. Connected to Content via `aria-labelledby`.

}>

Always include a Title for accessibility. In development, a console warning appears if no Title is found.

### `Dialog.Description`

Accessible description. Renders a `<p>` by default. Connected to Content via `aria-describedby`.

### `Dialog.Close`

Button that closes the dialog. Renders a `<button>` by default.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | - | Render as child element |

---

## Modal vs non-modal

  Modal (default)
  Non-modal

When `modal={true}` (default):

- Focus is trapped inside the content.
- Body scroll is locked.
- Other content is hidden from screen readers via `aria-hidden`.
- Clicking outside dismisses the dialog.

Set `modal={false}` for non-modal dialogs (sidebars, panels) that don't block interaction with the rest of the page.

```tsx

  ...

```

---

## Animation

Use `data-state` for CSS animations:

```css
.dialog-overlay[data-state="open"] {
  animation: fadeIn 200ms ease;
}
.dialog-overlay[data-state="closed"] {
  animation: fadeOut 200ms ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

}>

The `Presence` system detects these animations and delays unmounting until they complete.

---

## Keyboard interactions

| Key | Action |
| --- | --- |
| <Kbd>Space</Kbd> / <Kbd>Enter</Kbd> | Opens the dialog (on Trigger) |
| <Kbd>Tab</Kbd> | Cycles through focusable elements inside content |
| <Kbd>Shift+Tab</Kbd> | Cycles backward through focusable elements |
| <Kbd>Escape</Kbd> | Closes the dialog |
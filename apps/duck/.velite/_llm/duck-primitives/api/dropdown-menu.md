```tsx

```

## Anatomy

```tsx

```

---

## Example

```tsx

function ActionsMenu() {
  return (

            Delete

  )
}
```

---

## API

### `DropdownMenu.Root`

The root component that manages open/closed state and provides context. Wraps the base Menu primitive internally.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Called when the open state should change |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction. Resolved with `useDirection` (`dir` prop -> `DirectionProvider` -> `'ltr'`). |
| `modal` | `boolean` | `true` | When true, interaction with outside elements is disabled and only menu content is visible to screen readers |

### `DropdownMenu.Trigger`

Button that toggles the dropdown menu. Renders a `<button>` with `aria-haspopup="menu"`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | - | Render as the child element instead of a `<button>` |
| `disabled` | `boolean` | `false` | Disables the trigger |

Sets `aria-expanded`, `aria-controls`, and `data-state` automatically.

### `DropdownMenu.Portal`

Renders the dropdown content into a portal.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `Element \| null` | `document.body` | Portal target |

### `DropdownMenu.Content`

The dropdown content. Handles focus management, keyboard navigation, and dismiss behavior.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side relative to the trigger |
| `sideOffset` | `number` | - | Main-axis offset from trigger |
| `align` | `'start' \| 'center' \| 'end'` | - | Cross-axis alignment |
| `alignOffset` | `number` | - | Cross-axis offset |
| `avoidCollisions` | `boolean` | `true` | Flip to avoid viewport overflow |
| `collisionPadding` | `number` | - | Padding from viewport edges |
| `onCloseAutoFocus` | `(event: Event) => void` | - | Called when focus returns to trigger on close |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | - | Called when Escape is pressed |
| `onPointerDownOutside` | `(event) => void` | - | Called when clicking outside |
| `onInteractOutside` | `(event) => void` | - | Called on any interaction outside |
| `trapFocus` | `boolean` | `context.open` | Override whether focus is trapped inside the content |
| `disableOutsidePointerEvents` | `boolean` | `context.open` | Override whether pointer events outside are blocked |
| `disableOutsideScroll` | `boolean` | `true` | Override whether body scroll is locked while open |

The `trapFocus`, `disableOutsidePointerEvents`, and `disableOutsideScroll` props default to sensible values. Override them when integrating with animation libraries like [motion](https://motion.dev) that need custom lifecycle control during exit animations.

Exposes `data-state="open"` / `data-state="closed"` and `data-side` for CSS animation.

CSS custom properties available:

- `--gentleduck-dropdown-menu-content-transform-origin`
- `--gentleduck-dropdown-menu-content-available-width`
- `--gentleduck-dropdown-menu-content-available-height`
- `--gentleduck-dropdown-menu-trigger-width`
- `--gentleduck-dropdown-menu-trigger-height`

### `DropdownMenu.Group`

Groups related items. Renders a `<div>` with `role="group"`.

### `DropdownMenu.Label`

Non-interactive label for a group.

### `DropdownMenu.Item`

An interactive menu item. Fires `onSelect` when activated.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Disable the item |
| `onSelect` | `(event: Event) => void` | - | Called when item is selected |
| `textValue` | `string` | - | Text override for typeahead search |

Exposes `data-highlighted` when focused and `data-disabled` when disabled.

### `DropdownMenu.CheckboxItem`

A toggleable menu item with checked state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean \| 'indeterminate'` | - | Checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Called on toggle |
| `disabled` | `boolean` | `false` | Disable the item |

### `DropdownMenu.RadioGroup` / `DropdownMenu.RadioItem`

Mutually exclusive menu items.

| Prop (RadioGroup) | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Currently selected value |
| `onValueChange` | `(value: string) => void` | - | Called when selection changes |

| Prop (RadioItem) | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Value for this item |
| `disabled` | `boolean` | `false` | Disable the item |

### `DropdownMenu.ItemIndicator`

Renders only when the parent item is checked. Use for check marks or radio dots.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | - | Keep mounted for animation control |

### `DropdownMenu.Sub` / `DropdownMenu.SubTrigger` / `DropdownMenu.SubContent`

Nested submenus.

| Prop (Sub) | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(open: boolean) => void` | - | Called when open state changes |

`SubContent` exposes the same `--gentleduck-dropdown-menu-*` CSS custom properties as `Content`.

### `DropdownMenu.Separator`

Visual separator between groups. Renders a `<div>` with `aria-hidden`.

### `DropdownMenu.Arrow`

Arrow pointing to the trigger.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number` | `10` | Arrow width in pixels |
| `height` | `number` | `5` | Arrow height in pixels |

---

## Keyboard interactions

| Key | Action |
| --- | --- |
| <Kbd>Space</Kbd> / <Kbd>Enter</Kbd> | Opens menu (on trigger) or activates highlighted item |
| <Kbd>ArrowDown</Kbd> | Opens menu or highlights next item |
| <Kbd>ArrowUp</Kbd> | Highlights previous item |
| <Kbd>ArrowRight</Kbd> | Opens submenu (on SubTrigger) |
| <Kbd>ArrowLeft</Kbd> | Closes submenu |
| <Kbd>Escape</Kbd> | Closes menu |
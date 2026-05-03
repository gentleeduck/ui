```tsx

```

## Anatomy

```tsx

```

## Example

```tsx

```

## API

### `HoverCard.Root`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | - | Controlled state |
| `defaultOpen` | `boolean` | `false` | Initial state |
| `onOpenChange` | `(open: boolean) => void` | - | State change callback |
| `openDelay` | `number` | `700` | Delay before opening (ms) |
| `closeDelay` | `number` | `300` | Delay before closing (ms) |

### `HoverCard.Trigger`

The element that activates the card on hover. Renders an `<a>` by default.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | - | Render as child element |

### `HoverCard.Portal`

Portals content to `document.body`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `Element \| null` | `document.body` | Portal target |
| `forceMount` | `true` | - | Force mount content |

### `HoverCard.Content`

Positioned floating content. Positioned by the Popper engine.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side |
| `sideOffset` | `number` | `0` | Distance from anchor in pixels |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along the side |
| `alignOffset` | `number` | `0` | Alignment offset in pixels |
| `forceMount` | `true` | - | Keep mounted always |
| `onEscapeKeyDown` | `(event) => void` | - | Called on <Kbd>Escape</Kbd> press |
| `onPointerDownOutside` | `(event) => void` | - | Called on outside click |
| `onFocusOutside` | `(event) => void` | - | Called when focus moves outside |
| `onInteractOutside` | `(event) => void` | - | Called for any outside interaction |

}>

Unlike Tooltip, HoverCard content is **interactive**. Users can move their pointer into the content and click links, buttons, etc.

### `HoverCard.Arrow`

Optional visual arrow pointing toward the trigger.
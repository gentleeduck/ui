```tsx
import { DismissableLayer, DismissableLayerBranch } from '@gentleduck/primitives/dismissable-layer'
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onPointerDownOutside` | `(event) => void` | - | Fired on click outside. Call `event.preventDefault()` to prevent dismiss. |
| `onFocusOutside` | `(event) => void` | - | Fired when focus moves outside |
| `onInteractOutside` | `(event) => void` | - | Fired for any outside interaction |
| `onEscapeKeyDown` | `(event) => void` | - | Fired on <Kbd>Escape</Kbd> press |
| `onDismiss` | `() => void` | - | Called when the layer should be dismissed |
| `disableOutsidePointerEvents` | `boolean` | `false` | Block pointer events on elements outside this layer |

## DismissableLayerBranch

}>

Marks a DOM subtree as "part of" the dismissable layer. Clicks inside a branch won't trigger dismissal. Useful for toasts or notifications that relate to the overlay but render outside it.

}>

Used internally by Dialog.Content, Popover.Content, and Tooltip.Content.
```tsx

```

## Anatomy

```tsx

```

## API

### `Popper.Root`

Context provider that connects anchor and content.

### `Popper.Anchor`

The reference element that content is positioned relative to.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `virtualRef` | `React.RefObject<Measurable>` | - | Position relative to a virtual element instead of a DOM node |

### `Popper.Content`

The floating content. Positioned relative to the anchor.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side relative to anchor |
| `sideOffset` | `number` | `0` | Gap between content and anchor (px) |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along the side |
| `alignOffset` | `number` | `0` | Alignment offset (px) |
| `arrowPadding` | `number` | `0` | Minimum padding between arrow and content edges (px) |
| `avoidCollisions` | `boolean` | `true` | Flip to avoid viewport edges |
| `collisionBoundary` | `Element \| Element[]` | - | Custom collision boundary |
| `collisionPadding` | `number \| Padding` | `0` | Padding from collision boundary |
| `sticky` | `'partial' \| 'always'` | `'partial'` | Keep content in view when anchor is partially hidden |
| `hideWhenDetached` | `boolean` | `false` | Hide content when anchor is fully occluded |
| `updatePositionStrategy` | `'optimized' \| 'always'` | `'optimized'` | Strategy for position recalculation |
| `onPlaced` | `() => void` | - | Called when content has been positioned |

### `Popper.Arrow`

Visual arrow pointing toward the anchor. Rendered as an SVG.

## How it works

}>

Popper measures the anchor element's rect, calculates the content position based on `side` and `align`, and adjusts if the content would overflow the viewport (when `avoidCollisions` is true).

}>

You rarely use Popper directly. Popover, Tooltip, Hover Card, and Menu use it internally for positioning.
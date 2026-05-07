```tsx
import { Presence } from '@gentleduck/primitives/presence'
```

## Usage

```tsx
<Presence present={isOpen}>
  <div className="my-animated-element">Content</div>
</Presence>
```

}>

When `present` changes from `true` to `false`, Presence detects CSS animations on the child and waits for them to finish before unmounting. No JavaScript animation library needed.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `present` | `boolean` | - | Whether the child should be mounted |
| `children` | `ReactElement \| ((props: { present: boolean }) => ReactElement)` | - | Child element or render function |

## Render function form

For more control, use a render function:

```tsx
<Presence present={isOpen}>
  {({ present }) => (
    <div className={present ? 'fade-in' : 'fade-out'}>
      Content
    </div>
  )}
</Presence>
```

## State machine

}>

Presence uses three states: `mounted` (visible), `unmountSuspended` (animating out), and `unmounted` (removed from DOM).
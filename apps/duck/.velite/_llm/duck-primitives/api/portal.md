```tsx
import { Portal } from '@gentleduck/primitives/portal'
```

## Usage

```tsx
<Portal>
  <div className="modal">I'm rendered in document.body</div>
</Portal>

// Custom container
<Portal container={document.getElementById('my-container')}>
  <div>I'm rendered in #my-container</div>
</Portal>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `Element \| DocumentFragment \| null` | `document.body` | Target container |

}>

Portal waits until after the first layout effect before mounting, ensuring SSR compatibility.
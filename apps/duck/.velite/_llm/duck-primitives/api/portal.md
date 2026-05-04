```tsx

```

## Usage

```tsx

  <div className="modal">I'm rendered in document.body</div>

// Custom container

  <div>I'm rendered in #my-container</div>

```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `Element \| DocumentFragment \| null` | `document.body` | Target container |

}>

Portal waits until after the first layout effect before mounting, ensuring SSR compatibility.
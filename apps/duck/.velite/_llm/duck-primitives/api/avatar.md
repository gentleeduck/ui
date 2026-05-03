```tsx

```

## Anatomy

```tsx

```

---

## Example

```tsx

function UserAvatar() {
  return (

        WD

  )
}
```

---

## API

### `Avatar.Root`

The root container that manages image loading state. Renders a `<span>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction for RTL support |
| `asChild` | `boolean` | - | Render as child element |

### `Avatar.Image`

The `<img>` element. Only renders when the image has successfully loaded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | - | Image source URL |
| `onLoadingStatusChange` | `(status: ImageLoadingStatus) => void` | - | Called when loading status changes |
| `asChild` | `boolean` | - | Render as child element |

**`ImageLoadingStatus`**: `'idle' | 'loading' | 'loaded' | 'error'`

### `Avatar.Fallback`

Renders when the image is not available. Renders a `<span>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `delayMs` | `number` | - | Delay in milliseconds before showing the fallback |
| `asChild` | `boolean` | - | Render as child element |
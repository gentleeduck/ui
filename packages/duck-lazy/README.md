<p align="center">
  <img src="../../public/logo-dark.svg" alt="gentleduck/ui" width="80"/>
</p>

# @gentleduck/lazy

Lazy loading components for React.

Uses `IntersectionObserver` to defer rendering until elements enter the viewport. Supports components, images, and Next.js `next/image`.

## Quick Start

```bash
bun add @gentleduck/lazy
```

```tsx
import { DuckLazyComponent } from '@gentleduck/lazy/lazy-component'

function Page() {
  return (
    <DuckLazyComponent options={{ rootMargin: '100px' }}>
      <HeavyWidget />
    </DuckLazyComponent>
  )
}
```

```tsx
import { DuckLazyImage } from '@gentleduck/lazy/lazy-image'

<DuckLazyImage
  src="/photo.jpg"
  placeholder="/placeholder.jpg"
  alt="Description"
  width={800}
  height={600}
/>
```

## API

| Export | Import | Description |
| --- | --- | --- |
| `DuckLazyComponent` | `@gentleduck/lazy/lazy-component` | Lazy-render any children on viewport entry |
| `DuckLazyImage` | `@gentleduck/lazy/lazy-image` | Lazy-load images with placeholder and a11y |
| `useLazyLoad` | `@gentleduck/lazy/lazy-component` | Hook returning `{ isVisible, ComponentRef }` |
| `useLazyImage` | `@gentleduck/lazy/lazy-image` | Hook returning `{ isLoaded, imageRef }` |

Set `nextImage` prop on `DuckLazyImage` to use `next/image` optimization in Next.js apps.

## License

MIT

<p align="center">
  <img src="../../public/logo-dark.svg" alt="@gentleduck/lazy" width="120"/>
</p>

<h1 align="center">@gentleduck/lazy</h1>

<p align="center">
  Lazy loading components and images with virtualized rendering for client-side performance.
</p>

<p align="center">
  <a href="../../LICENSE">MIT</a> -
  <a href="../../CHANGELOG.md">Changelog</a> -
  <a href="../../CONTRIBUTING.md">Contributing</a> -
  <a href="https://gentleduck.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gentleduck/lazy"><img src="https://img.shields.io/npm/v/@gentleduck/lazy.svg" alt="npm"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/lazy"><img src="https://img.shields.io/npm/dm/@gentleduck/lazy.svg" alt="downloads"/></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/npm/l/@gentleduck/lazy.svg" alt="MIT"/></a>
</p>

---

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

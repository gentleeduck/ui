## Philosophy

gentleduck/lazy wraps React's `lazy()` and `Suspense` with loading skeletons, error boundaries, and IntersectionObserver support. Components and images load when they enter the viewport.

---

## Features

- Lazy loading for components and images.
- Configurable IntersectionObserver options.
- ARIA roles, live regions, focus management.
- Placeholder support while content loads.
- Hooks for custom behavior.

---

## Installation

```bash
npm install @gentleduck/lazy
```

---

## Usage

### 1) Lazy Component

The `DuckLazyComponent` defers rendering until its children enter the viewport.

```tsx

function MyComponent() {
  return (
    
  )
}
```

#### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | (required) | URL of the image |
| `placeholder` | `string` | - | Placeholder URL while loading |
| `alt` | `string` | (required) | Accessible description |
| `width` | `number` | `200` | Image width |
| `height` | `number` | `200` | Image height |
| `options` | `IntersectionObserverInit` | `{ rootMargin: '200px', threshold: 0.1 }` | IntersectionObserver options |
| `nextImage` | `boolean` | - | Enables Next.js `next/image` optimization |

---

### 3) `useLazyLoad` Hook

Attach lazy-loading behavior to any element.

```tsx

function MyComponent() {
  const { isVisible, ComponentRef } = useLazyLoad({
    rootMargin: '100px',
    threshold: 0.25,
  })

  return (
    }
      {isLoaded && }

  )
}
```

#### Returns

| Name | Type | Description |
| --- | --- | --- |
| `isLoaded` | `boolean` | Whether the image has finished loading |
| `imageRef` | `React.RefObject
  )
}
```

---

## Integration with Next.js

Enable Next.js image optimization with `nextImage`.

```tsx

```

Benefits:

* Built-in Next.js optimization
* Lazy loading via `next/image`

---

## Integration with React

Works as a drop-in replacement for `
```

---

## Accessibility Features

* `aria-live="polite"` - announces loading state changes via an `<output>` element.
* `aria-hidden` - hides placeholders from assistive technology.
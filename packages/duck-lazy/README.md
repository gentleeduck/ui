# `@gentleduck/lazy`

`@gentleduck/lazy` is a lightweight and accessible React library for lazy-loading images and components. It uses the `IntersectionObserver` API to trigger the loading of content when it enters the viewport, providing smooth, efficient, and accessible lazy loading.

## Features

- **Lazy loading for components and images**: Load elements only when they are about to enter the viewport.
- **Customizable**: Configure root margin, threshold, and more using the `IntersectionObserver` options.
- **Accessibility**: Full support for accessibility with ARIA roles, live regions, and proper focus management.
- **Placeholder support**: Display placeholders while content or images are loading.
- **Support for custom options**: Use the provided hooks and components with custom intersection observer options.

## Installation

To install the package, run:

```bash
npm install @gentleduck/lazy
# or
yarn add @gentleduck/lazy
# or
pnpm add @gentleduck/lazy
```

## Usage

### Lazy Component

The `DuckLazyComponent` is used for lazy loading any component or content. It will only render its children when they are about to enter the viewport.

```tsx
import { DuckLazyComponent } from '@gentleduck/lazy'

function MyComponent() {
  return (
    <DuckLazyComponent options={{ rootMargin: '100px', threshold: 0.25 }}>
      <div>Content that will be lazily loaded</div>
    </DuckLazyComponent>
  )
}
```

#### Props

- `options` (optional): IntersectionObserver options (e.g., `rootMargin`, `threshold`).
- `children`: The content to be rendered lazily.

### Lazy Image

The `DuckLazyImage` component allows for lazy-loading of images with a placeholder. It also provides accessibility features such as `aria-live`, `aria-hidden`, and a custom `alt` text.

```tsx
import { DuckLazyImage } from '@gentleduck/lazy'

function MyImageComponent() {
  return (
    <DuckLazyImage
      src="https://example.com/image.jpg"
      placeholder="https://example.com/placeholder.jpg"
      alt="A description of the image"
      width={400}
      height={300}
      options={{ rootMargin: '100px', threshold: 0.25 }}
    />
  )
}
```

#### Props

- `src`: The URL of the image to load.
- `placeholder`: The URL of the placeholder image to display while the image is loading.
- `alt`: A descriptive alt text for the image.
- `options`: IntersectionObserver options (e.g., `rootMargin`, `threshold`).
- `width`: The width of the image (required).
- `height`: The height of the image (required).
- `nextImage` (optional): Set to `true` if using the `next/image` component for Next.js optimization.

### `useLazyLoad` Hook

If you'd like to build your own lazy loading functionality, you can use the `useLazyLoad` hook. It gives you the visibility status and a reference to the element that you can attach to any component.

```tsx
import { useLazyLoad } from '@gentleduck/lazy'

function MyComponent() {
  const { isVisible, elementRef } = useLazyLoad({
    rootMargin: '100px',
    threshold: 0.25,
  })

  return (
    <div ref={elementRef}>
      {isVisible ? <div>Content that will be displayed lazily</div> : <div>Loading...</div>}
    </div>
  )
}
```

#### `useLazyLoad` Hook Props

- `options` (optional): IntersectionObserver options (e.g., `rootMargin`, `threshold`).

#### `useLazyLoad` Hook Returns

- `isVisible`: Boolean indicating whether the element is in the viewport.
- `elementRef`: A `React.Ref` to be attached to the element you want to observe.

### `useLazyImage` Hook

For lazy-loading images specifically, the `useLazyImage` hook provides visibility and loading status. It will trigger an image load when the image enters the viewport.

```tsx
import { useLazyImage } from '@gentleduck/lazy'

function LazyImage({ src, placeholder }) {
  const { isLoaded, imageRef } = useLazyImage(src, {
    rootMargin: '100px',
    threshold: 0.25,
  })

  return (
    <div ref={imageRef}>
      {!isLoaded && <img src={placeholder} alt="Placeholder" />}
      {isLoaded && <img src={src} alt="Main Image" />}
    </div>
  )
}
```

#### `useLazyImage` Hook Props

- `src`: The URL of the image to load.
- `options` (optional): IntersectionObserver options (e.g., `rootMargin`, `threshold`).

#### `useLazyImage` Hook Returns

- `isLoaded`: Boolean indicating whether the image has finished loading.
- `imageRef`: A `React.Ref` to be attached to the `img` element.

---

## `DuckLazyImage` Component

The `DuckLazyImage` component lazily loads an image when it comes into view. It supports lazy loading of images to improve performance, shows a placeholder image while the main image loads, and includes several accessibility features to ensure compatibility with assistive technologies like screen readers.

### Usage Example

```tsx
import { DuckLazyImage } from '@gentleduck/lazy'

function MyImageComponent() {
  return (
    <DuckLazyImage
      src="https://example.com/image.jpg"
      placeholder="https://example.com/placeholder.jpg"
      alt="A description of the image"
      width={400}
      height={300}
      options={{ rootMargin: '100px', threshold: 0.25 }}
    />
  )
}
```

### Props

- `src`: The URL of the image to load (required).
- `placeholder`: The URL of the placeholder image to display while the image is loading.
- `alt`: A descriptive alt text for the image (required for accessibility).
- `options` (optional): IntersectionObserver options (e.g., `rootMargin`, `threshold`).
- `width`: The width of the image in pixels (required).
- `height`: The height of the image in pixels (required).
- `nextImage` (optional): If using Next.js, set to `true` to optimize the image with `next/image`.

---

## Integration with **Next.js**

In Next.js applications, you can easily integrate `DuckLazyImage` with the `next/image` component for better performance and automatic image optimization. 

### Usage in Next.js

When using Next.js, set the `nextImage` prop to `true` to ensure compatibility with Next.js's image optimization:

```tsx
import { DuckLazyImage } from '@gentleduck/lazy'

function MyNextImageComponent() {
  return (
    <DuckLazyImage
      nextImage // Ensure Next.js optimization is applied
      src="https://example.com/image.jpg"
      placeholder="https://example.com/placeholder.jpg"
      alt="A description of the image"
      width={400}
      height={300}
      options={{ rootMargin: '100px', threshold: 0.25 }}
    />
  )
}
```

### Benefits for Next.js Users:
- **Optimized Image Loading**: Lazy load images and improve the performance of your Next.js application.
- **Automatic Image Optimization**: Leverage Next.js’s built-in image optimization by using `next/image` when `nextImage` is set to `true`.

---

## Integration with **React**

In standard React applications (without Next.js), `DuckLazyImage` works as a regular `img` tag with lazy loading, ensuring your images load only when they enter the viewport.

### Usage in React

```tsx
import { DuckLazyImage } from '@gentleduck/lazy'

function MyReactImageComponent() {
  return (
    <DuckLazyImage
      src="https://example.com/image.jpg"
      placeholder="https://example.com/placeholder.jpg"
      alt="A description of the image"
      width={400}
      height={300}
      options={{ rootMargin: '100px', threshold: 0.25 }}
    />
  )
}
```

---

## Accessibility Features

`@gentleduck/lazy` provides robust accessibility features to ensure that your lazy-loaded images and components are compatible with assistive technologies:

- **`aria-live="polite"`** for announcing loading and visibility changes.
- **`role="img"`** for images to indicate their purpose to screen readers.
- **`aria-hidden`** to hide elements from assistive technologies until they are fully loaded.
- **`aria-label`** for providing descriptive alt text for both images and components.
- **`aria-relevant`** and **`aria-atomic`** for managing live updates and ensuring screen readers announce changes in atomic units.
  
These accessibility features ensure that your users, regardless of their device or accessibility needs, have a smooth and accessible experience.

---

## Contributing

Feel free to open issues or submit pull requests for bug fixes or improvements. If you’d like to contribute, please fork the repo and make changes on a separate branch. We welcome improvements, suggestions, and feedback.

## License

[MIT © GentleDuck](./LICENSE)

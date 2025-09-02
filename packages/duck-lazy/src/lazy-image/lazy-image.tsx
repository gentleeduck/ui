'use client'
import type { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import { useLazyImage } from './lazy-image.hooks'
import type { LazyImageProps } from './lazy-image.types'

/**
 * `DuckLazyImage` is a React component that lazily loads an image when it comes into view.
 * It supports lazy loading of images to improve performance, shows a placeholder image while the main image loads,
 * and includes several accessibility features to ensure compatibility with assistive technologies like screen readers.
 *
 * @param {LazyImageProps} props - The props to configure the component.
 *
 * @returns {React.JSX.Element} The `DuckLazyImage` component. A div wrapping an `img` tag with lazy loading and placeholder functionality.
 *
 * ## Usage Example:
 * ```tsx
 * <DuckLazyImage
 *   src="https://example.com/image.jpg"
 *   placeholder="https://example.com/placeholder.jpg"
 *   alt="A stunning mountain landscape"
 * />
 * ```
 */
export function DuckLazyImage(props: LazyImageProps): React.JSX.Element {
  if (!props.src) {
    throw new Error('src is required')
  }

  const { isLoaded, imageRef } = useLazyImage(props.src, {
    rootMargin: '200px', // Start loading the image when it's 200px away from the viewport
    threshold: 0.1, // Trigger when 10% of the image is visible
    ...props.options,
  })

  return (
    <div ref={imageRef} className="relative overflow-hidden" style={{ transform: 'translate3d(0,0,0)' }}>
      <PlaceHolder
        src={isLoaded ? props.src : (props.placeholder ?? '')}
        className={`transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'} ${props.nextImage && 'opacity-100'}`}
        alt="Image is loading..." // Provide alt text for the placeholder image
        aria-hidden={isLoaded ? 'true' : 'false'} // Hide placeholder once image loads
        {...props}
      />

      {!props.nextImage && (
        <div
          className={`absolute inset-0 animate-pulse transition-all ${
            isLoaded ? 'bg-transparent opacity-0' : 'bg-muted opacity-100'
          }`}
          role="status" // Let screen readers know this is a loading status
          aria-live="polite" // Announce the loading state
          aria-hidden={isLoaded ? 'true' : 'false'} // Hide the loading spinner after image loads
        />
      )}
    </div>
  )
}

/**
 * `PlaceHolder` is a React component that renders a placeholder image for the `DuckLazyImage` component.
 * It can be used to display a placeholder image while the main image is being loaded.
 *
 * @param {Omit<LazyImageProps, 'placeholder'>} props - The props to configure the component.
 *
 * @returns {React.JSX.Element} The `PlaceHolder` component. An `img` tag with lazy loading and placeholder functionality.
 *
 */
function PlaceHolder({
  width = 200,
  height = 200,
  src,
  loading,
  decoding,
  alt,
  nextImage,
  ...props
}: Omit<LazyImageProps, 'placeholder'>): React.JSX.Element {
  const Component = nextImage ? Image : 'img'
  return (
    <Component
      loading={loading ?? 'lazy'}
      style={{ transform: 'translate3d(0,0,0)' }}
      decoding={decoding ?? 'async'}
      width={width}
      src={src as (string | StaticImport) & string}
      height={height}
      alt={alt as string}
      {...(props as any)}
    />
  )
}

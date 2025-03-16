import Image from 'next/image'
import { useLazyImage } from './lazy-image.hooks'
import { LazyImageProps } from './lazy-image.types'

/**
 * `DuckLazyImage` is a React component that lazily loads an image when it comes into view.
 * It supports lazy loading of images to improve performance, shows a placeholder image while the main image loads,
 * and includes several accessibility features to ensure compatibility with assistive technologies like screen readers.
 *
 * @param {Object} props - The props to configure the component.
 * @param {string} [props.className] - Optional class name to apply to the container element for custom styling.
 * @param {number|`${number}`} [props.width=200] - Width of the image in pixels. Default is 200px.
 * @param {number|`${number}`} [props.height=200] - Height of the image in pixels. Default is 200px.
 * @param {string} props.src - The URL of the image to be loaded lazily.
 * @param {string} [props.placeholder] - The URL of the placeholder image to be shown while the main image is loading.
 * @param {boolean} [props.nextImage] - The next image option enables lazy loading for Next.js applications. Set this to `true` if
 * you're using `NextJs` application.
 * @param {IntersectionObserverInit} [props.options] - Custom options for the IntersectionObserver (e.g., `rootMargin`, `threshold`).
 * @param {string} [props.alt='Image'] - Alt text for the image, providing a description for screen readers.
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
export function DuckLazyImage({
  className,
  width = 200,
  height = 200,
  src,
  placeholder,
  nextImage,
  options,
  alt = 'Image', // Make sure to add an alt text for the image
  ...props
}: LazyImageProps): React.JSX.Element {
  if (!src) {
    throw new Error('src is required')
  }

  const { isLoaded, imageRef } = useLazyImage(src, {
    rootMargin: '200px', // Start loading the image when it's 200px away from the viewport
    threshold: 0.1, // Trigger when 10% of the image is visible
    ...options,
  })
  const Component = Image || 'img'

  return (
    <div
      ref={imageRef}
      className="relative overflow-hidden"
      aria-live="polite" // Announce loading and visibility changes
      role="img" // Indicate this element is an image
      aria-label={alt} // Provide a label for the image
      aria-hidden={isLoaded ? 'false' : 'true'} // Hide image from assistive tech until it loads
      tabIndex={0} // Ensure this component can be focused (good for accessibility)
    >
      <Component
        loading="lazy"
        src={src}
        width={width}
        height={height}
        alt={alt} // Always provide an alt text to make the image accessible
        className={`transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'} ${nextImage && 'opacity-100'}`}
        aria-hidden={isLoaded ? 'false' : 'true'} // Hide the image from screen readers until it is loaded
        aria-describedby={isLoaded ? 'image-loaded' : undefined} // Link to description once image loads
        {...props}
      />

      {placeholder && !isLoaded && (
        <Component
          loading="lazy"
          src={placeholder}
          width={width}
          height={height}
          alt="Image is loading..." // Provide alt text for the placeholder image
          className={`transition-opacity ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
          aria-hidden={isLoaded ? 'true' : 'false'} // Hide placeholder once image loads
          {...props}
        />
      )}

      {!nextImage && (
        <div
          className={`animate-pulse transition-all inset-0 absolute ${!isLoaded ? 'opacity-100 bg-muted' : 'opacity-0 bg-transparent'
            }`}
          role="status" // Let screen readers know this is a loading status
          aria-live="polite" // Announce the loading state
          aria-hidden={isLoaded ? 'true' : 'false'} // Hide the loading spinner after image loads
        />
      )}
    </div>
  )
}

import { useLazyImage } from './lazy-image.hooks'
import { LazyImageProps } from './lazy-image.types'

export function DuckLazyImage({
  className,
  width = 200,
  height = 200,
  src,
  placeholder,
  options,
  alt = 'Image', // Make sure to add an alt text for the image
  ...props
}: LazyImageProps) {
  if (!src) {
    throw new Error('src is required')
  }

  const { isLoaded, imageRef } = useLazyImage(src, {
    rootMargin: '200px', // Start loading the image when it's 200px away from the viewport
    threshold: 0.1, // Trigger when 10% of the image is visible
    ...options,
  })

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
      <img
        loading="lazy"
        src={src}
        width={width}
        height={height}
        alt={alt} // Always provide an alt text to make the image accessible
        className={`transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
        aria-hidden={isLoaded ? 'false' : 'true'} // Hide the image from screen readers until it is loaded
        aria-describedby={isLoaded ? 'image-loaded' : undefined} // Link to description once image loads
      />

      {placeholder && !isLoaded && (
        <img
          loading="lazy"
          src={placeholder}
          width={width}
          height={height}
          alt="Image is loading..." // Provide alt text for the placeholder image
          className={`transition-opacity ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
          aria-hidden={isLoaded ? 'true' : 'false'} // Hide placeholder once image loads
        />
      )}

      <div
        className={`animate-pulse transition-all inset-0 absolute ${
          !isLoaded ? 'opacity-100 bg-muted' : 'opacity-0 bg-transparent'
        }`}
        role="status" // Let screen readers know this is a loading status
        aria-live="polite" // Announce the loading state
        aria-hidden={isLoaded ? 'true' : 'false'} // Hide the loading spinner after image loads
      />
    </div>
  )
}

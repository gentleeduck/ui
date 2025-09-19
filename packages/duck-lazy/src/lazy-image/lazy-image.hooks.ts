import React from 'react'
import type { UseLazyImageReturn } from './lazy-image.types'

/**
 * `useLazyImage` is a custom React hook that lazily loads an image only when it enters the viewport using the IntersectionObserver API.
 * It provides the `isLoaded` state to track if the image has finished loading and a `ref` to associate with the `img` element.
 *
 * @param {string} src - The URL of the image to be lazily loaded.
 * @param {IntersectionObserverInit} [options] - Optional configuration options for the IntersectionObserver. You can specify the margin and threshold for triggering the lazy load.
 *
 * @returns {UseLazyImageReturn} - Returns an object containing the `isLoaded` state and the `imageRef` to associate with the `img` element.
 *
 * @example
 * ```tsx
 * const { isLoaded, imageRef } = useLazyImage('https://example.com/image.jpg', {
 *   rootMargin: '200px', // Start loading when the image is 200px away from the viewport
 *   threshold: 0.1, // Trigger when 10% of the image is visible
 * });
 *
 * return (
 *   <div>
 *     <img
 *       ref={imageRef}
 *       src={isLoaded ? 'https://example.com/image.jpg' : ''}
 *       alt="Description of the image"
 *     />
 *     {!isLoaded && <div>Loading...</div>}
 *   </div>
 * );
 * ```
 */
export const useLazyImage = (src: string, options?: IntersectionObserverInit): UseLazyImageReturn => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isInView, setIsInView] = React.useState(false)
  const imageRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsInView(true)
        observer.disconnect() // Stop observing once the image is in view
      }
    }, options)

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current)
      }
    }
  }, [options])

  React.useEffect(() => {
    if (!isInView) return

    const img = new Image()
    img.src = src
    img.onload = () => {
      setIsLoaded(true)
    }
  }, [isInView, src])

  return { imageRef, isLoaded }
}

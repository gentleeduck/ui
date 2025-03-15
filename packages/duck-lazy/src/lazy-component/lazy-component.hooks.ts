/**
 * @module duck/lazy
 * @author wildduck
 * @license MIT
 * @version 1.0.0
 * @description this is a package for lazy components
 * @category hooks
 * @description Hook to handle lazy loading of components
 * @see [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
 */

import React from 'react'
import { UseLazyLoadOptions } from './lazy-component.types'

/**
 * Hook to handle lazy loading of components
 *
 * @param options - IntersectionObserver options
 * @returns {isVisible: boolean, elementRef: React.RefObject<HTMLDivElement|null>}
 *
 * @see [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
 *
 * @example
 * ```tsx
 * const { isVisible, elementRef } = useLazyLoad({
 *   rootMargin: '0px', // Adjust this to trigger rendering earlier or later
 *   threshold: 0.1, // Trigger when 10% of the element is visible
 * })
 * ```
 */
export const useLazyLoad = (
  options?: IntersectionObserverInit,
): UseLazyLoadOptions => {
  const [isVisible, setIsVisible] = React.useState(false)
  const elementRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setTimeout(() => {
          setIsVisible(true)
        }, 300)
        observer.disconnect() // Stop observing once the element is visible
      }
    }, options)

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [options])

  return { isVisible, elementRef }
}

import React from 'react'
import type { UseLazyLoadReturn } from './lazy-component.types'

/**
 * `useLazyLoad` is a custom React hook that enables lazy loading behavior for any component.
 * It utilizes the `IntersectionObserver` API to monitor when an element enters the viewport.
 * When the element becomes visible, it triggers the loading behavior and updates the visibility state.
 * This is useful for scenarios like lazy-loading components or deferring rendering until the component is visible.
 *
 * @param {IntersectionObserverInit} [options] - Optional configuration object to customize the `IntersectionObserver`.
 * The configuration can include `root`, `rootMargin`, and `threshold` properties.
 * See the [IntersectionObserver documentation](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) for more details.
 *
 * @returns {UseLazyLoadReturn} Returns an object containing:
 *   - `isVisible` (boolean): Indicates whether the element is currently in the viewport and visible to the user.
 *   - `elementRef` (React.RefObject<HTMLDivElement | null>): A ref that should be attached to the element you want to observe for lazy loading.
 *
 * @example
 * ```tsx
 * // Example 1: Basic usage
 * const { isVisible, elementRef } = useLazyLoad({
 *   rootMargin: '0px',  // Trigger when the element is exactly in view.
 *   threshold: 0.1,     // Trigger when 10% of the element is visible.
 * });
 *
 * return (
 *   <div ref={elementRef}>
 *     {isVisible ? (
 *       <p>The component is now visible!</p>
 *     ) : (
 *       <p>Loading...</p>
 *     )}
 *   </div>
 * );
 * ```
 *
 * ```tsx
 * // Example 2: Using custom threshold and rootMargin for more control
 * const { isVisible, elementRef } = useLazyLoad({
 *   rootMargin: '100px',  // Load the component before it enters the viewport by 100px.
 *   threshold: 0.25,      // Trigger when 25% of the element is visible.
 * });
 *
 * return (
 *   <div ref={elementRef}>
 *     {isVisible ? (
 *       <div>Content loaded!</div>
 *     ) : (
 *       <div>Loading...</div>
 *     )}
 *   </div>
 * );
 * ```
 *
 * ```tsx
 * // Example 3: Using hook in a more complex component
 * function MyComponent() {
 *   const { isVisible, elementRef } = useLazyLoad({
 *     rootMargin: '200px',  // Start observing when the element is 200px from the viewport.
 *     threshold: 0.1,       // Trigger once 10% of the element is visible.
 *   });
 *
 *   return (
 *     <div ref={elementRef} style={{ height: '300px', background: 'lightgray' }}>
 *       {isVisible ? (
 *         <div>
 *           <h1>This content is now visible!</h1>
 *           <p>Lazy-loaded content here...</p>
 *         </div>
 *       ) : (
 *         <div>Loading content...</div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see [IntersectionObserver API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
 * @see [React useRef](https://reactjs.org/docs/hooks-reference.html#useref)
 */
export const useLazyLoad = (options?: IntersectionObserverInit): UseLazyLoadReturn => {
  const [isVisible, setIsVisible] = React.useState(false)
  const elementRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true)
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

  return { elementRef, isVisible }
}

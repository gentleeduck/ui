import { useLazyLoad } from './lazy-component.hooks'
import { DuckLazyProps } from './lazy-component.types'

/**
 * `DuckLazyComponent` is a React component that lazily loads its content based on visibility within the viewport.
 * It uses the `useLazyLoad` hook to determine when the component is visible, allowing for efficient rendering only when necessary.
 * This is particularly useful for improving performance by deferring the rendering of off-screen components.
 *
 * This component supports various accessibility enhancements for screen readers and users with disabilities, including:
 * - Announcing visibility changes with `aria-live` and `aria-relevant`
 * - Making the element focusable when visible with `tabIndex`
 * - Providing detailed ARIA attributes to improve accessibility of lazy-loaded content.
 *
 * @param {Object} props - The props to configure the component.
 * @param {React.ReactNode} props.children - The content to display once the component is visible.
 * @param {IntersectionObserverInit} [props.options] - Optional configuration for the `IntersectionObserver`. Allows customization of when the component becomes visible.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional props passed to the root `<div>` element.
 *
 * @returns {React.JSX.Element} A `div` element that wraps the lazy-loaded content and provides the appropriate accessibility attributes.
 *
 * @example
 * // Example 1: Basic usage without options
 * <DuckLazyComponent>
 *   <p>This content is lazily loaded when it becomes visible.</p>
 * </DuckLazyComponent>
 *
 * @example
 * // Example 2: Using custom IntersectionObserver options
 * <DuckLazyComponent options={{ rootMargin: '100px', threshold: 0.2 }}>
 *   <p>This content will load when 20% of it is visible, with a 100px margin around the viewport.</p>
 * </DuckLazyComponent>
 *
 * @example
 * // Example 3: Using the component inside a complex layout
 * const App = () => {
 *   return (
 *     <div>
 *       <DuckLazyComponent>
 *         <div>
 *           <h1>Lazy-loaded Component</h1>
 *           <p>This component only renders when visible in the viewport.</p>
 *         </div>
 *       </DuckLazyComponent>
 *     </div>
 *   );
 * };
 */
export function DuckLazyComponent({ children, options, ...props }: DuckLazyProps): React.JSX.Element {
  const { isVisible, elementRef } = useLazyLoad({
    rootMargin: '0px', // Adjust this to trigger rendering earlier or later
    threshold: 0, // Trigger when 10% of the element is visible
    ...options,
  })

  return (
    <div
      ref={elementRef}
      {...props}
      data-slot="wrapper"
      // aria-label='lazy-component'
      // aria-details='This component is lazy-loaded and will be displayed when visible'
      // aria-description='This component is lazy-loaded'
      // aria-describedby='lazy'
      // aria-busy={isVisible ? 'false' : 'true'}
      // aria-hidden={isVisible ? 'false' : 'true'}
      // role='region' // Define the region role to help screen readers understand the content context
      // tabIndex={isVisible ? 0 : -1} // Make the element focusable once visible
      // aria-live='polite' // Announce changes to content when it becomes visible
      // aria-relevant='additions' // Make screen readers announce any added content
      // aria-atomic='true' // Ensure that changes in the container are read out as atomic units
    >
      {isVisible ? (
        children
      ) : (
        <div
          data-slot="placeholder"
          className="mb-4 h-[512px] animate-pulse bg-muted"
          // role='status' // Indicate to screen readers that this is a placeholder
          // aria-live='polite' // Announce the loading state to screen readers
        />
      )}
    </div>
  )
}

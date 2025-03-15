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

import { useLazyLoad } from './lazy-component.hooks'
import { DuckLazyProps } from './lazy-component.types'

/**
 * @function DuckLazy
 * @description Hook to handle lazy loading of components
 * @param {DuckLazyProps} props
 * @param {React.ReactNode} props.children
 * @returns {React.JSX.Element}
 *
 * @example
 * ```tsx
 * <DuckLazy>
 *   <div>Content</div>
 * </DuckLazy>
 * ```
 *
 * - Add custom styles to the **placeholder** div
 * ```tsx
 * <DuckLazy className={'[&_div[data-slot="placeholder"]]:h-[512px]'} {...props}>
 *   {children}
 * </DuckLazy>
 * ```
 */
export function DuckLazy({
  children,
  ...props
}: DuckLazyProps): React.JSX.Element {
  const { isVisible, elementRef } = useLazyLoad({
    rootMargin: '0px', // Adjust this to trigger rendering earlier or later
    threshold: 0.1, // Trigger when 10% of the element is visible
  })

  return (
    <div ref={elementRef} {...props} data-slot="wrapper">
      {isVisible ? (
        children
      ) : (
        <div
          data-slot="placeholder"
          className="animate-pulse h-[512px] mb-4 bg-muted"
        />
      )}
    </div>
  )
}

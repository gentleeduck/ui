import { useLazyLoad } from './lazy-component.hooks'
import { DuckLazyProps } from './lazy-component.types'

export function DuckLazyComponent({
  children,
  options,
  ...props
}: DuckLazyProps): React.JSX.Element {
  const { isVisible, elementRef } = useLazyLoad({
    rootMargin: '0px', // Adjust this to trigger rendering earlier or later
    threshold: 0.1, // Trigger when 10% of the element is visible
    ...options,
  })

  return (
    <div
      ref={elementRef}
      {...props}
      data-slot="wrapper"
      aria-label="lazy-component"
      aria-details="This component is lazy-loaded and will be displayed when visible"
      aria-description="This component is lazy-loaded"
      aria-describedby="lazy"
      aria-busy={isVisible ? 'false' : 'true'}
      aria-hidden={isVisible ? 'false' : 'true'}
      role="region" // Define the region role to help screen readers understand the content context
      tabIndex={isVisible ? 0 : -1} // Make the element focusable once visible
      aria-live="polite" // Announce changes to content when it becomes visible
      aria-relevant="additions" // Make screen readers announce any added content
      aria-atomic="true" // Ensure that changes in the container are read out as atomic units
    >
      {isVisible ? (
        children
      ) : (
        <div
          data-slot="placeholder"
          className="animate-pulse h-[512px] mb-4 bg-muted"
          role="status" // Indicate to screen readers that this is a placeholder
          aria-live="polite" // Announce the loading state to screen readers
        />
      )}
    </div>
  )
}

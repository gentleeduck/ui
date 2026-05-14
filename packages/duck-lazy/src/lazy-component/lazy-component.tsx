import { useLazyLoad } from './lazy-component.hooks'
import type { ILazyComponent } from './lazy-component.types'

/**
 * Renders `children` only once the wrapper `<div>` enters the viewport; shows a pulse placeholder
 * until then. Forwards extra HTML props to the wrapper.
 *
 * @param props.options - Optional `IntersectionObserverInit` (merged over the default `{ rootMargin: '0px', threshold: 0 }`).
 */
export function DuckLazyComponent({ children, options, ...props }: ILazyComponent.IProps): React.JSX.Element {
  const { isVisible, ComponentRef } = useLazyLoad({
    rootMargin: '0px',
    threshold: 0,
    ...options,
  })

  return (
    <div ref={ComponentRef} {...props} data-slot="wrapper">
      {isVisible ? children : <div className="mb-4 h-[512px] animate-pulse" data-slot="placeholder" />}
    </div>
  )
}

import React from 'react'
import type { ILazyComponent } from './lazy-component.types'

/**
 * Observes a ref via `IntersectionObserver` and flips `isVisible` once it intersects the viewport.
 * Disconnects after the first intersection.
 *
 * @param options - `IntersectionObserverInit` (root / rootMargin / threshold).
 * @returns `{ isVisible, ComponentRef }` — attach `ComponentRef` to the element to observe.
 */
export const useLazyLoad = (options?: IntersectionObserverInit): ILazyComponent.IUseLazyLoadReturn => {
  const [isVisible, setIsVisible] = React.useState(false)
  const ComponentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, options)

    if (ComponentRef.current) {
      observer.observe(ComponentRef.current)
    }

    return () => {
      if (ComponentRef.current) {
        observer.unobserve(ComponentRef.current)
      }
    }
  }, [options])

  return { ComponentRef, isVisible }
}

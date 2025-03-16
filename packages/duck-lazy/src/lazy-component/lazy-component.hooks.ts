import React from 'react'
import { UseLazyLoadOptions } from './lazy-component.types'

export const useLazyLoad = (
  options?: IntersectionObserverInit,
): UseLazyLoadOptions => {
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

  return { isVisible, elementRef }
}

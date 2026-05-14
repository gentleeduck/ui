import React from 'react'
import type { ILazyImage } from './lazy-image.types'

/**
 * Lazily loads `src` once the bound `imageRef` enters the viewport.
 * Returns `{ isLoaded, imageRef }`; `isLoaded` flips true after the image's `onload`.
 */
export const useLazyImage = (src: string, options?: IntersectionObserverInit): ILazyImage.IUseLazyImageReturn => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isInView, setIsInView] = React.useState(false)
  const imageRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsInView(true)
        observer.disconnect()
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

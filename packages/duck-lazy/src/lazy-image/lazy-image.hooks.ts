import React from 'react'
import { useIntersectionOnce } from '../use-intersection-once'
import type { UseLazyImageReturn } from './lazy-image.types'

export const useLazyImage = (src: string, options?: IntersectionObserverInit): UseLazyImageReturn => {
  const { ref, intersected: isInView } = useIntersectionOnce<HTMLImageElement>(options)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!isInView || typeof Image === 'undefined') return

    const img = new Image()
    img.onload = () => setIsLoaded(true)
    img.onerror = () => setIsLoaded(true)
    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
      img.src = ''
    }
  }, [isInView, src])

  return { isLoaded, ref }
}

import type * as React from 'react'

export interface UseLazyImageReturn {
  isLoaded: boolean
  ref: React.RefObject<HTMLImageElement | null>
}

export interface LazyImageProps extends React.ComponentPropsWithoutRef<'img'> {
  src: string
  options?: IntersectionObserverInit
  placeholder?: string
}

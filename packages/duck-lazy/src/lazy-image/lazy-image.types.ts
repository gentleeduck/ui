import React from 'react'

export type UseLazyImageReturn = {
  isLoaded: boolean
  imageRef: React.RefObject<HTMLImageElement>
}

export type LazyImageProps = {
  options: IntersectionObserverInit
  placeholder: string
} & React.HTMLProps<HTMLImageElement>

import React from 'react'

export type LazyImageProps = {
  options: IntersectionObserverInit
  placeholder: string
} & React.HTMLProps<HTMLImageElement>

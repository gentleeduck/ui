import React from 'react'
import { useLazyImage } from './lazy-image.hooks'

export function LazyImage({
  className,
  width = 200,
  height = 200,
  src,
  ...props
}: React.HTMLProps<HTMLImageElement>) {
  if (!src) {
    throw new Error('src is required')
  }

  const { isLoaded, imageRef } = useLazyImage(src, {
    rootMargin: '200px', // Start loading the image when it's 200px away from the viewport
    threshold: 0.1, // Trigger when 10% of the image is visible
  })

  return (
    <div ref={imageRef} className={'relative overflow-hidden'}>
      <img
        loading="lazy"
        src={src}
        width={width}
        height={height}
        className={isLoaded ? 'opacity-100' : 'opacity-0'}
        {...props}
      />
      <div
        className={`animate-pulse transition-all inset-0 absolute ${isLoaded ? 'opacity-0 bg-transparent' : 'opacity-100 bg-muted'}`}
      />
    </div>
  )
}

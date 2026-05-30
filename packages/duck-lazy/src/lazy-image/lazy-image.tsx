'use client'
import { cn } from '@gentleduck/libs/cn'
import React from 'react'
import { useLazyImage } from './lazy-image.hooks'
import type { LazyImageProps } from './lazy-image.types'

const DEFAULT_OPTIONS: IntersectionObserverInit = {
  rootMargin: '200px',
  threshold: 0.1,
}

function DuckLazyImageImpl({
  src,
  placeholder,
  options,
  className,
  alt,
  width = 200,
  height = 200,
  loading,
  decoding,
  style,
  ...props
}: LazyImageProps): React.JSX.Element {
  const { isLoaded, ref } = useLazyImage(src, { ...DEFAULT_OPTIONS, ...options })
  const displaySrc = isLoaded ? src : (placeholder ?? src)
  const imgClassName = cn('transition-opacity', isLoaded ? 'opacity-100' : 'opacity-0', className)

  return (
    <div className="relative overflow-hidden" data-slot="wrapper">
      <img
        {...props}
        // No `alt` ⇒ decorative ⇒ aria-hidden; caller can override.
        aria-hidden={props['aria-hidden'] ?? (alt ? undefined : 'true')}
        alt={alt ?? ''}
        className={imgClassName}
        data-slot="image"
        decoding={decoding ?? 'async'}
        height={height}
        loading={loading ?? 'lazy'}
        ref={ref}
        src={displaySrc}
        style={style}
        width={width}
      />
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 animate-pulse transition-all',
          isLoaded ? 'bg-transparent opacity-0' : 'bg-muted opacity-100',
        )}
        data-slot="placeholder"
      />
    </div>
  )
}

export const DuckLazyImage = React.memo(DuckLazyImageImpl)
DuckLazyImage.displayName = 'DuckLazyImage'

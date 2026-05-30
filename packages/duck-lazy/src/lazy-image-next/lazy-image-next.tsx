'use client'
import { cn } from '@gentleduck/libs/cn'
// biome-ignore lint/correctness/noUnusedImports: types-only consumers omit `next` at install time.
import NextImage from 'next/image'
import React from 'react'
import { useLazyImage } from '../lazy-image/lazy-image.hooks'
import type { LazyImageNextProps } from './lazy-image-next.types'

const DEFAULT_OPTIONS: IntersectionObserverInit = {
  rootMargin: '200px',
  threshold: 0.1,
}

/**
 * Next.js-aware lazy image. Lives at `@gentleduck/lazy/lazy-image-next` so
 * non-Next consumers can import `@gentleduck/lazy/lazy-image` without the
 * bundler attempting to resolve `next/image`.
 */
function DuckLazyImageNextImpl({
  src,
  placeholder,
  options,
  className,
  alt,
  width = 200,
  height = 200,
  loading,
  style,
  'aria-hidden': ariaHidden,
}: LazyImageNextProps): React.JSX.Element {
  const { isLoaded, ref } = useLazyImage(src, { ...DEFAULT_OPTIONS, ...options })
  const displaySrc = isLoaded ? src : (placeholder ?? src)
  const imgClassName = cn('transition-opacity', 'opacity-100', className)

  return (
    <div className="relative overflow-hidden" data-slot="wrapper">
      <NextImage
        alt={alt ?? ''}
        aria-hidden={ariaHidden ?? (alt ? undefined : 'true')}
        className={imgClassName}
        height={height}
        loading={loading ?? 'lazy'}
        ref={ref}
        src={displaySrc}
        style={style}
        width={width}
      />
    </div>
  )
}

export const DuckLazyImageNext = React.memo(DuckLazyImageNextImpl)
DuckLazyImageNext.displayName = 'DuckLazyImageNext'

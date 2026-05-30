import type * as React from 'react'

export interface LazyImageNextProps {
  src: string
  alt?: string
  width?: number
  height?: number
  loading?: 'eager' | 'lazy'
  className?: string
  style?: React.CSSProperties
  placeholder?: string
  options?: IntersectionObserverInit
  'aria-hidden'?: boolean | 'true' | 'false'
}

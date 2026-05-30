import type * as React from 'react'

export interface UseLazyLoadReturn {
  isVisible: boolean
  ref: React.RefObject<HTMLDivElement | null>
}

export interface LazyComponentProps extends React.ComponentPropsWithoutRef<'div'> {
  options?: IntersectionObserverInit
}

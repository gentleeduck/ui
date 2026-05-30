'use client'
import { cn } from '@gentleduck/libs/cn'
import React from 'react'
import { useLazyLoad } from './lazy-component.hooks'
import type { LazyComponentProps } from './lazy-component.types'

const DEFAULT_OPTIONS: IntersectionObserverInit = {
  rootMargin: '0px',
  threshold: 0,
}

function DuckLazyComponentImpl({ children, options, className, ...props }: LazyComponentProps): React.JSX.Element {
  const { isVisible, ref } = useLazyLoad({ ...DEFAULT_OPTIONS, ...options })

  return (
    <div className={cn(className)} data-slot="wrapper" ref={ref} {...props}>
      {isVisible ? children : <div className="h-full w-full animate-pulse" data-slot="placeholder" />}
    </div>
  )
}

export const DuckLazyComponent = React.memo(DuckLazyComponentImpl)
DuckLazyComponent.displayName = 'DuckLazyComponent'

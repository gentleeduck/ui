'use client'

import * as React from 'react'
import { useComputedTimeoutTransition } from './mount.libs'
import type { IMount } from './mount.types'

function MountMinimal({
  forceMount = false,
  open = false,
  children,
  ref,
  skipWaiting = false,
  renderOnce = false,
}: IMount.IMinimalProps) {
  const [hasForceMounted, setHasForceMounted] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const [hasRenderedOnce, setHasRenderedOnce] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const shouldRender = forceMount ? hasForceMounted : open

  React.useEffect(() => {
    if (open && forceMount) {
      setHasForceMounted(true)
    }

    if (shouldRender) {
      setIsVisible(true)
      setHasRenderedOnce(true)
      return
    }

    if (renderOnce && hasRenderedOnce) return

    const element = ref
    if (element) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (skipWaiting) {
        setIsVisible(false)
        timeoutRef.current = null
      } else {
        timeoutRef.current =
          // biome-ignore lint/correctness/useHookAtTopLevel: useComputedTimeoutTransition is a utility that computes CSS transition duration, not a React hook despite the naming
          useComputedTimeoutTransition(element, () => {
            setIsVisible(false)
            timeoutRef.current = null
          }) ?? null
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [shouldRender, ref, open, forceMount, skipWaiting, renderOnce, hasRenderedOnce])

  if (!shouldRender && !isVisible && !(renderOnce && hasRenderedOnce)) return null

  return <>{children}</>
}

export { MountMinimal }

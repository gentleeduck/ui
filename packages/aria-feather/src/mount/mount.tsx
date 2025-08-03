'use client'
import React from 'react'

type ShouldRenderProps = {
  forceMount?: boolean
  open?: boolean
  children?: React.ReactNode
  ref?: HTMLDialogElement | null
  skipWaiting?: boolean
}

export function Mount({ forceMount = false, open = false, children, ref, skipWaiting = false }: ShouldRenderProps) {
  const [_shouldRender, setShouldRender] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const shouldRender = forceMount ? _shouldRender : open

  React.useEffect(() => {
    if (open && forceMount) {
      setShouldRender(true)
    }

    if (shouldRender) {
      setIsVisible(true)
      return
    }

    const element = ref
    if (element) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (skipWaiting) {
        // Skip animation delay and immediately hide
        setIsVisible(false)
        timeoutRef.current = null
      } else {
        timeoutRef.current = useComputedTimeoutTransition(element, () => {
          setIsVisible(false)
          timeoutRef.current = null
        })
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [shouldRender, ref, open, forceMount, skipWaiting])

  if (!shouldRender && !isVisible) return null

  return <>{children}</>
}

function useComputedTimeoutTransition(
  el: HTMLElement | null | undefined,
  callback: () => void,
): ReturnType<typeof setTimeout> | undefined {
  if (!el || !(el instanceof HTMLElement)) return
  const duration = getComputedStyle(el).transitionDuration
  const ms = parseFloat(duration) * 1000 || 0
  return setTimeout(callback, ms)
}

'use client'

import * as React from 'react'

interface MountProps {
  open: boolean
  renderOnce?: boolean
  children?: React.ReactNode
  animationDuration?: number
}

function Mount({ open, renderOnce = false, children, animationDuration = 400 }: MountProps) {
  const [mounted, setMounted] = React.useState(open)

  React.useEffect(() => {
    // @ts-expect-error
    let timeout: NodeJS.Timeout

    if (open) {
      // Mount immediately on open
      setMounted(true)
    } else if (!open && mounted) {
      // Wait for the closing animation to finish
      timeout = setTimeout(() => {
        setMounted(false)
      }, animationDuration)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [open, animationDuration, mounted])

  if (!mounted && renderOnce) return null
  return <>{mounted ? children : null}</>
}

type MountMinimalProps = {
  forceMount?: boolean
  open?: boolean
  children?: React.ReactNode
  ref?: HTMLDialogElement | null
  skipWaiting?: boolean
  renderOnce?: boolean
}

function MountMinimal({
  forceMount = false,
  open = false,
  children,
  ref,
  skipWaiting = false,
  renderOnce = false,
}: MountMinimalProps) {
  const [_shouldRender, setShouldRender] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const [hasRenderedOnce, setHasRenderedOnce] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const shouldRender = forceMount ? _shouldRender : open

  React.useEffect(() => {
    if (open && forceMount) {
      setShouldRender(true)
    }

    if (shouldRender) {
      setIsVisible(true)
      setHasRenderedOnce(true) // remember we rendered at least once
      return
    }

    // If renderOnce is enabled, never hide after first render
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
        // @ts-expect-error
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
  }, [shouldRender, ref, open, forceMount, skipWaiting, renderOnce, hasRenderedOnce])

  if (!shouldRender && !isVisible && !(renderOnce && hasRenderedOnce)) return null

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

export { Mount, MountMinimal }

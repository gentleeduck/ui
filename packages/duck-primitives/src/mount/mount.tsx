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
    // @ts-ignore
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
        // @ts-ignore
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

export interface MountPropss {
  open?: boolean
  forceMount?: boolean
  renderOnce?: boolean
  remountOnOpen?: boolean
  skipClosingDelay?: boolean
  waitForRender?: boolean
  waitForRenderMs?: number
  waitForRenderChecks?: number
  waitForRenderMaxMs?: number
  ref?: HTMLElement | React.RefObject<HTMLElement> | null
  onReady?: () => void
  children?: React.ReactNode
}

export function Mountt({
  open = false,
  forceMount = false,
  renderOnce = false,
  remountOnOpen = false,
  skipClosingDelay = false,
  waitForRender = false,
  waitForRenderMs = 150,
  waitForRenderChecks = 2,
  waitForRenderMaxMs = 200,
  ref,
  onReady,
  children,
}: MountPropss) {
  const [shouldRender, setShouldRender] = React.useState(forceMount || open)
  const [isVisible, setIsVisible] = React.useState(open && !waitForRender)

  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const cleanupRenderWaitRef = React.useRef<() => void>(() => {})

  const getNode = React.useCallback(() => {
    if (!ref) return null
    if (typeof (ref as any).current !== 'undefined') {
      return (ref as React.RefObject<HTMLElement>).current ?? null
    }
    return ref instanceof HTMLElement ? ref : null
  }, [ref])

  React.useEffect(() => {
    cleanupRenderWaitRef?.current?.()
    // @ts-ignore
    cleanupRenderWaitRef.current = undefined

    if (open) {
      if (remountOnOpen) {
        setShouldRender(false)
        requestAnimationFrame(() => setShouldRender(true))
      } else {
        setShouldRender(true)
      }

      if (waitForRender) {
        const node = getNode()
        cleanupRenderWaitRef.current = waitForDomStable(
          node,
          () => {
            setIsVisible(true)
            onReady?.()
          },
          waitForRenderMs,
          waitForRenderChecks,
          waitForRenderMaxMs,
        )
      } else {
        setIsVisible(true)
        onReady?.()
      }
      return
    }

    // closing
    if (skipClosingDelay) {
      setIsVisible(false)
      if (!renderOnce && !forceMount) setShouldRender(false)
      return
    }

    const node = getNode()
    closeTimeoutRef.current = computeTransitionTimeout(node, () => {
      setIsVisible(false)
      if (!renderOnce && !forceMount) setShouldRender(false)
    })
  }, [
    open,
    remountOnOpen,
    renderOnce,
    forceMount,
    skipClosingDelay,
    waitForRender,
    waitForRenderMs,
    waitForRenderChecks,
    waitForRenderMaxMs,
    getNode,
    onReady,
  ])

  if (!shouldRender && !isVisible) return null

  return <>{children}</>
}

// --- helpers ---
function parseCssTime(value: string | null) {
  if (!value) return 0
  return Math.max(
    ...value.split(',').map((v) => {
      v = v.trim()
      if (v.endsWith('ms')) return parseFloat(v)
      if (v.endsWith('s')) return parseFloat(v) * 1000
      return 0
    }),
    0,
  )
}

function computeTransitionTimeout(el: HTMLElement | null | undefined, cb: () => void) {
  if (!el || !(el instanceof HTMLElement)) {
    cb()
    return null
  }
  const styles = getComputedStyle(el)
  const ms = Math.max(
    parseCssTime(styles.transitionDuration) + parseCssTime(styles.transitionDelay),
    parseCssTime(styles.animationDuration) + parseCssTime(styles.animationDelay),
  )
  return setTimeout(cb, Math.max(ms, 16))
}

function waitForDomStable(
  el: HTMLElement | null | undefined,
  cb: () => void,
  quietMs = 150,
  stableChecks = 2,
  maxWaitMs = 2000,
) {
  if (!el || !(el instanceof HTMLElement)) {
    const raf = requestAnimationFrame(cb)
    return () => cancelAnimationFrame(raf)
  }

  let lastW = -1,
    lastH = -1,
    sameCount = 0
  let quietTimer: ReturnType<typeof setTimeout> | null = null
  let maxTimer: ReturnType<typeof setTimeout> | null = setTimeout(runCb, maxWaitMs)

  const ro = new ResizeObserver(() => {
    const { width, height } = el.getBoundingClientRect()
    if (width > 0 && height > 0) {
      if (width === lastW && height === lastH) {
        sameCount++
      } else {
        sameCount = 1
        lastW = width
        lastH = height
      }
      if (sameCount >= stableChecks) {
        clearTimeout(quietTimer!)
        quietTimer = setTimeout(runCb, quietMs)
      }
    }
  })

  ro.observe(el)

  function runCb() {
    cleanup()
    cb()
  }

  function cleanup() {
    ro.disconnect()
    if (quietTimer) clearTimeout(quietTimer)
    if (maxTimer) clearTimeout(maxTimer)
  }

  return cleanup
}

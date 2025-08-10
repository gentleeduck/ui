'use client'

import * as React from 'react'

export interface MountProps {
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

export function Mount({
  open = false,
  forceMount = false,
  renderOnce = false,
  remountOnOpen = false,
  skipClosingDelay = false,
  waitForRender = false,
  waitForRenderMs = 150,
  waitForRenderChecks = 2,
  waitForRenderMaxMs = 150,
  ref,
  onReady,
  children,
}: MountProps) {
  const [shouldRender, setShouldRender] = React.useState(forceMount || open)
  const nodeRef = React.useRef<HTMLElement | null>(null)

  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const cleanupRenderWaitRef = React.useRef<() => void>(() => {})

  const getNode = React.useCallback(() => {
    if (ref && typeof (ref as any).current !== 'undefined') {
      return (ref as React.RefObject<HTMLElement>).current ?? null
    }
    return (ref as HTMLElement) ?? nodeRef.current
  }, [ref])

  // Only re-render when "shouldRender" changes, visibility is handled imperatively
  React.useEffect(() => {
    cleanupRenderWaitRef.current?.()
    cleanupRenderWaitRef.current = undefined

    if (open) {
      if (remountOnOpen) {
        setShouldRender(false)
        requestAnimationFrame(() => setShouldRender(true))
      } else {
        if (!shouldRender) setShouldRender(true)
      }

      const node = getNode()
      if (node) {
        node.style.visibility = 'hidden'
      }

      if (waitForRender) {
        cleanupRenderWaitRef.current = waitForDomStable(
          node,
          () => {
            if (node) node.style.visibility = 'visible'
            onReady?.()
          },
          waitForRenderMs,
          waitForRenderChecks,
          waitForRenderMaxMs,
        )
      } else {
        if (node) node.style.visibility = 'visible'
        onReady?.()
      }
      return
    }

    // Closing
    const node = getNode()
    if (skipClosingDelay) {
      if (node) node.style.visibility = 'hidden'
      if (!renderOnce && !forceMount) setShouldRender(false)
      return
    }

    closeTimeoutRef.current = computeTransitionTimeout(node, () => {
      if (node) node.style.visibility = 'hidden'
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
    shouldRender,
  ])

  if (!shouldRender) return null

  return <div ref={nodeRef as any}>{children}</div>
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

function computeTransitionTimeout(el: HTMLElement | null, cb: () => void) {
  if (!el) {
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

function waitForDomStable(el: HTMLElement | null, cb: () => void, quietMs = 150, stableChecks = 2, maxWaitMs = 2000) {
  if (!el) {
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

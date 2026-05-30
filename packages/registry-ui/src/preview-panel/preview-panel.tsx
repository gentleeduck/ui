'use client'

import { cn } from '@gentleduck/libs/cn'
import { useDirection } from '@gentleduck/primitives/direction'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '../badge'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { toDirection } from '../direction/direction.libs'
import { Separator } from '../separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip'
import type { IPreviewPanelProps } from './preview-panel.types'

const ZOOM_STEP_BUTTON = 0.25
const ZOOM_STEP_WHEEL = 0.1

const CONTENT_STYLE = { transformOrigin: 'center center' } as const

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

const ZoomControls = memo(function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
  zoom,
  zoomInText = 'Zoom in',
  zoomOutText = 'Zoom out',
  resetText = 'Reset view',
}: {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  zoom: number
  zoomInText?: string
  zoomOutText?: string
  resetText?: string
}) {
  return (
    <TooltipProvider>
      <ButtonGroup data-slot="preview-panel-controls" className="rounded-md border bg-background/80 backdrop-blur-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onZoomIn}
              icon={<Plus aria-hidden="true" />}
              aria-label={zoomInText}
            />
          </TooltipTrigger>
          <TooltipContent>{zoomInText}</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" />
        <Badge variant="secondary" size="sm" className="rounded-none tabular-nums">
          {Math.round(zoom * 100)}%
        </Badge>
        <Separator orientation="vertical" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onZoomOut}
              icon={<Minus aria-hidden="true" />}
              aria-label={zoomOutText}
            />
          </TooltipTrigger>
          <TooltipContent>{zoomOutText}</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onReset}
              icon={<RotateCcw aria-hidden="true" />}
              aria-label={resetText}
            />
          </TooltipTrigger>
          <TooltipContent>{resetText}</TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </TooltipProvider>
  )
})

/**
 * Pan-zoom container. Transforms bypass React via direct DOM writes so
 * continuous interactions (drag, wheel, pinch) cause zero re-renders.
 */
const PreviewPanel = React.forwardRef<HTMLDivElement, IPreviewPanelProps>(
  (
    {
      maxHeight,
      minZoom = 0.25,
      maxZoom = 4,
      initialZoom = 1,
      showControls = true,
      unsafeHtml,
      children,
      className,
      style,
      onStateChange,
      syncState,
      dir,
      ...rest
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    // Mutable interaction state; nothing in this ref triggers re-renders
    const s = useRef({
      zoom: initialZoom,
      x: 0,
      y: 0,
      dragging: false,
      dragStartX: 0,
      dragStartY: 0,
      posStartX: 0,
      posStartY: 0,
      rafId: 0,
      emitPending: false,
      pinchDist: 0,
      pinchZoom: initialZoom,
      willChangeTimer: 0,
    })

    // The only React state — the zoom label percentage
    const [displayZoom, setDisplayZoom] = useState(initialZoom)

    // Ref-shadow so effects never re-subscribe when the callback identity changes
    const onStateChangeRef = useRef(onStateChange)
    onStateChangeRef.current = onStateChange

    const flushEmit = useCallback(() => {
      if (!s.current.emitPending) return
      s.current.emitPending = false
      onStateChangeRef.current?.({
        zoom: s.current.zoom,
        x: s.current.x,
        y: s.current.y,
      })
    }, [])

    // Defer emission to RAF so continuous events batch into one update/frame
    const markDirty = useCallback(() => {
      s.current.emitPending = true
    }, [])

    const applyTransform = useCallback((animate: boolean) => {
      const el = contentRef.current
      if (!el) return
      const { x, y, zoom } = s.current
      el.style.transform = `translate3d(${x}px,${y}px,0) scale(${zoom})`
      el.style.transition = animate ? 'transform 0.15s ease-out' : 'none'
      // GPU-composite during interaction; clear afterwards so the browser
      // re-rasterizes at the final zoom for crisp SVG text
      el.style.willChange = 'transform'
      clearTimeout(s.current.willChangeTimer)
      s.current.willChangeTimer = window.setTimeout(() => {
        if (contentRef.current && !s.current.dragging) {
          contentRef.current.style.willChange = 'auto'
        }
      }, 200)
    }, [])

    // Coalesce DOM writes (and a pending emit) into a single RAF tick
    const scheduleApply = useCallback(() => {
      if (s.current.rafId) return
      s.current.rafId = requestAnimationFrame(() => {
        s.current.rafId = 0
        applyTransform(false)
        flushEmit()
      })
    }, [applyTransform, flushEmit])

    const syncDisplay = useCallback(() => setDisplayZoom(s.current.zoom), [])

    // Receive state from a paired panel
    useEffect(() => {
      if (!syncState) return
      const { zoom, x, y } = syncState
      // Epsilon guard avoids ping-pong when our own emission echoes back
      if (Math.abs(s.current.zoom - zoom) < 0.001 && Math.abs(s.current.x - x) < 0.5 && Math.abs(s.current.y - y) < 0.5)
        return
      s.current.zoom = zoom
      s.current.x = x
      s.current.y = y
      applyTransform(true)
      syncDisplay()
    }, [syncState, applyTransform, syncDisplay])

    // Discrete button handlers emit immediately rather than via RAF
    const handleZoomIn = useCallback(() => {
      s.current.zoom = clamp(s.current.zoom + ZOOM_STEP_BUTTON, minZoom, maxZoom)
      applyTransform(true)
      syncDisplay()
      markDirty()
      flushEmit()
    }, [applyTransform, syncDisplay, markDirty, flushEmit, minZoom, maxZoom])

    const handleZoomOut = useCallback(() => {
      s.current.zoom = clamp(s.current.zoom - ZOOM_STEP_BUTTON, minZoom, maxZoom)
      applyTransform(true)
      syncDisplay()
      markDirty()
      flushEmit()
    }, [applyTransform, syncDisplay, markDirty, flushEmit, minZoom, maxZoom])

    const handleReset = useCallback(() => {
      s.current.zoom = initialZoom
      s.current.x = 0
      s.current.y = 0
      applyTransform(true)
      syncDisplay()
      markDirty()
      flushEmit()
    }, [applyTransform, syncDisplay, markDirty, flushEmit, initialZoom])

    useEffect(() => {
      const el = containerRef.current
      if (!el) return

      const onDown = (e: PointerEvent) => {
        if (e.button !== 0) return
        if ((e.target as HTMLElement).closest('[data-slot="preview-panel-controls"]')) return
        e.preventDefault()
        el.setPointerCapture(e.pointerId)
        s.current.dragging = true
        s.current.dragStartX = e.clientX
        s.current.dragStartY = e.clientY
        s.current.posStartX = s.current.x
        s.current.posStartY = s.current.y
        el.style.cursor = 'grabbing'
      }

      const onMove = (e: PointerEvent) => {
        if (!s.current.dragging) return
        s.current.x = s.current.posStartX + (e.clientX - s.current.dragStartX)
        s.current.y = s.current.posStartY + (e.clientY - s.current.dragStartY)
        markDirty()
        scheduleApply()
      }

      const onUp = (e: PointerEvent) => {
        if (!s.current.dragging) return
        s.current.dragging = false
        el.releasePointerCapture(e.pointerId)
        el.style.cursor = 'grab'
      }

      const onLeave = () => {
        if (!s.current.dragging) return
        s.current.dragging = false
        el.style.cursor = 'grab'
      }

      el.addEventListener('pointerdown', onDown)
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerup', onUp)
      el.addEventListener('pointerleave', onLeave)
      return () => {
        el.removeEventListener('pointerdown', onDown)
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerup', onUp)
        el.removeEventListener('pointerleave', onLeave)
      }
    }, [markDirty, scheduleApply])

    // Wheel zoom — needs passive:false to preventDefault the page scroll
    useEffect(() => {
      const el = containerRef.current
      if (!el) return

      const onWheel = (e: WheelEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const delta = e.deltaY > 0 ? -ZOOM_STEP_WHEEL : ZOOM_STEP_WHEEL
        s.current.zoom = clamp(s.current.zoom + delta, minZoom, maxZoom)
        markDirty()
        scheduleApply()
        syncDisplay()
      }

      el.addEventListener('wheel', onWheel, { passive: false })
      return () => el.removeEventListener('wheel', onWheel)
    }, [markDirty, scheduleApply, syncDisplay, minZoom, maxZoom])

    useEffect(() => {
      const el = containerRef.current
      if (!el) return

      const dist = (e: TouchEvent) => {
        const a = e.touches[0] ?? { clientX: 0, clientY: 0 }
        const b = e.touches[1] ?? { clientX: 0, clientY: 0 }
        return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      }

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 2) {
          e.preventDefault()
          s.current.pinchDist = dist(e)
          s.current.pinchZoom = s.current.zoom
        }
      }

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 2) {
          e.preventDefault()
          const scale = dist(e) / s.current.pinchDist
          s.current.zoom = clamp(s.current.pinchZoom * scale, minZoom, maxZoom)
          markDirty()
          scheduleApply()
          syncDisplay()
        }
      }

      el.addEventListener('touchstart', onTouchStart, { passive: false })
      el.addEventListener('touchmove', onTouchMove, { passive: false })
      return () => {
        el.removeEventListener('touchstart', onTouchStart)
        el.removeEventListener('touchmove', onTouchMove)
      }
    }, [markDirty, scheduleApply, syncDisplay, minZoom, maxZoom])

    useEffect(() => {
      return () => {
        if (s.current.rafId) cancelAnimationFrame(s.current.rafId)
        clearTimeout(s.current.willChangeTimer)
      }
    }, [])

    // Dev-only: warn (don't throw) when `unsafeHtml` contains obvious XSS
    // markers. Production builds skip the scan so prop-drilling sanitised
    // build-time HTML stays zero-cost.
    if (IS_DEV && unsafeHtml) {
      warnOnSuspiciousUnsafeHtml(unsafeHtml)
    }

    const containerStyle = useMemo(
      () => ({ maxHeight, cursor: 'grab' as const, touchAction: 'none' as const }),
      [maxHeight],
    )
    const direction = useDirection(toDirection(dir))

    return (
      <div
        ref={ref}
        data-slot="preview-panel"
        className={cn('relative flex flex-col', className)}
        dir={direction}
        style={style}
        {...rest}>
        {showControls && (
          <div className="absolute end-3 top-3 z-10">
            <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} zoom={displayZoom} />
          </div>
        )}
        <div
          ref={containerRef}
          className="flex flex-1 items-center justify-center overflow-hidden"
          style={containerStyle}>
          {/* SEC-002: `unsafeHtml` is rendered verbatim and is the caller's responsibility to sanitise. */}
          {unsafeHtml ? (
            <div
              ref={contentRef}
              className="flex w-full items-center justify-center p-6"
              style={CONTENT_STYLE}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: caller-owns-sanitisation contract documented on `unsafeHtml` prop
              dangerouslySetInnerHTML={{ __html: unsafeHtml }}
            />
          ) : (
            <div ref={contentRef} className="flex w-full items-center justify-center p-6" style={CONTENT_STYLE}>
              {children}
            </div>
          )}
        </div>
      </div>
    )
  },
)
PreviewPanel.displayName = 'PreviewPanel'

const SUSPICIOUS_HTML_PATTERN = /<script\b|on\w+\s*=/i
let didWarnUnsafeHtml = false

declare const process: { env?: { NODE_ENV?: string } } | undefined

/** Inlined `__DEV__`-style flag. Dead-code-eliminated by bundlers when `process.env.NODE_ENV === 'production'`. */
const IS_DEV: boolean = typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production'

/**
 * Dev-only sentinel that warns once per session if `unsafeHtml` looks like
 * it might contain a `<script>` tag or an inline event handler. Not a
 * sanitiser — the prop's contract is still caller-owns-sanitisation.
 */
function warnOnSuspiciousUnsafeHtml(html: string): void {
  if (didWarnUnsafeHtml) return
  if (!SUSPICIOUS_HTML_PATTERN.test(html)) return
  didWarnUnsafeHtml = true
  // eslint-disable-next-line no-console
  console.warn(
    '[PreviewPanel] `unsafeHtml` contains a <script> tag or an inline event handler. ' +
      'This prop is rendered without sanitisation; you MUST only pass markup you fully trust. ' +
      'For untrusted content, pass React children instead.',
  )
}

export { PreviewPanel, ZoomControls }

'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '../badge'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { Separator } from '../separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip'
import type { PreviewPanelProps } from './preview-panel.types'

const ZOOM_STEP_BUTTON = 0.25
const ZOOM_STEP_WHEEL = 0.1

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

// A generic pan-zoom container. Accepts children or an html string.
// All transforms bypass React via direct DOM writes for zero re-renders
// during continuous interactions (drag, wheel, pinch).

const PreviewPanel = React.forwardRef<HTMLDivElement, PreviewPanelProps>(
  (
    {
      maxHeight,
      minZoom = 0.25,
      maxZoom = 4,
      initialZoom = 1,
      showControls = true,
      html,
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

    // All mutable interaction state lives in a single ref object.
    // Nothing here triggers React re-renders.
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

    // Only React state: the zoom label percentage
    const [displayZoom, setDisplayZoom] = useState(initialZoom)

    // Stable ref for the callback so effects never re-subscribe
    const onStateChangeRef = useRef(onStateChange)
    onStateChangeRef.current = onStateChange

    // Flush a pending state emission. Called from RAF or directly by button handlers.
    const flushEmit = useCallback(() => {
      if (!s.current.emitPending) return
      s.current.emitPending = false
      onStateChangeRef.current?.({
        zoom: s.current.zoom,
        x: s.current.x,
        y: s.current.y,
      })
    }, [])

    // Mark state as dirty so the next RAF tick emits it.
    // For continuous interactions (drag, wheel, pinch) this batches
    // multiple events into one React state update per frame.
    const markDirty = useCallback(() => {
      s.current.emitPending = true
    }, [])

    // Write transform directly to the DOM element.
    const applyTransform = useCallback((animate: boolean) => {
      const el = contentRef.current
      if (!el) return
      const { x, y, zoom } = s.current
      el.style.transform = `translate3d(${x}px,${y}px,0) scale(${zoom})`
      el.style.transition = animate ? 'transform 0.15s ease-out' : 'none'
      // GPU-composite during interaction, then clear so browser
      // re-rasterizes at the new zoom for crisp SVG text
      el.style.willChange = 'transform'
      clearTimeout(s.current.willChangeTimer)
      s.current.willChangeTimer = window.setTimeout(() => {
        if (contentRef.current && !s.current.dragging) {
          contentRef.current.style.willChange = 'auto'
        }
      }, 200)
    }, [])

    // Batch DOM writes behind a single requestAnimationFrame.
    // Also flushes any pending state emission in the same frame.
    const scheduleApply = useCallback(() => {
      if (s.current.rafId) return
      s.current.rafId = requestAnimationFrame(() => {
        s.current.rafId = 0
        applyTransform(false)
        flushEmit()
      })
    }, [applyTransform, flushEmit])

    const syncDisplay = useCallback(() => setDisplayZoom(s.current.zoom), [])

    // -- Sync from external state (receives changes from a paired panel) --

    useEffect(() => {
      if (!syncState) return
      const { zoom, x, y } = syncState
      // Epsilon check prevents applying our own emitted state back
      if (Math.abs(s.current.zoom - zoom) < 0.001 && Math.abs(s.current.x - x) < 0.5 && Math.abs(s.current.y - y) < 0.5)
        return
      s.current.zoom = zoom
      s.current.x = x
      s.current.y = y
      // Apply silently without emitting back to avoid ping-pong
      applyTransform(true)
      syncDisplay()
    }, [syncState, applyTransform, syncDisplay])

    // -- Button handlers (discrete, emit immediately) --

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

    // -- Pointer drag --

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

    // -- Wheel zoom (passive: false to preventDefault page scroll) --

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

    // -- Pinch to zoom (two-finger touch) --

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

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (s.current.rafId) cancelAnimationFrame(s.current.rafId)
        clearTimeout(s.current.willChangeTimer)
      }
    }, [])

    // Stable content props - only changes when html/children identity changes
    const contentProps = useMemo(
      () => (html ? { dangerouslySetInnerHTML: { __html: html } } : { children }),
      [html, children],
    )

    // Stable inline style for the container
    const containerStyle = useMemo(
      () => ({ maxHeight, cursor: 'grab' as const, touchAction: 'none' as const }),
      [maxHeight],
    )
    const direction = useDirection(dir as Direction)

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
          <div
            ref={contentRef}
            className="flex w-full items-center justify-center p-6"
            style={CONTENT_STYLE}
            {...contentProps}
          />
        </div>
      </div>
    )
  },
)
PreviewPanel.displayName = 'PreviewPanel'

const CONTENT_STYLE = { transformOrigin: 'center center' } as const

export { PreviewPanel, ZoomControls }

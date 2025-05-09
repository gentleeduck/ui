import { useDebounce } from '@gentleduck/hooks/use-debounce'
import { UseDrawerDragProps, UseDrawerDragReturn } from '../dialog'

import React, { useEffect, useMemo, useRef } from 'react'
import { assignStyle, chain, isVertical } from './src/helpers'
import { BORDER_RADIUS, TRANSITIONS, WINDOW_TOP_OFFSET } from './src/constants'

const noop = () => () => { }

export function useScaleBackground({
  open,
  direction,
  shouldScaleBackground,
  setBackgroundColorOnScale,
  noBodyStyles,
}: {
  open: boolean
  direction: 'top' | 'bottom' | 'left' | 'right'
  shouldScaleBackground: boolean
  setBackgroundColorOnScale: boolean
  noBodyStyles: boolean
}) {
  const timeoutIdRef = useRef<number | null>(null)

  const initialBg = useMemo(() => document.body.style.backgroundColor, [])

  const scale = (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth

  useEffect(() => {
    if (!(open && shouldScaleBackground)) return

    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)

    const wrapper =
      (document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement) ??
      (document.querySelector('[vaul-drawer-wrapper]') as HTMLElement)

    if (!wrapper) return

    const isVert = isVertical(direction)
    const offset = `calc(env(safe-area-inset-top) + 14px)`

    const cleanup = chain(
      setBackgroundColorOnScale && !noBodyStyles
        ? assignStyle(document.body, { background: 'black' })
        : noop,
      assignStyle(wrapper, {
        transformOrigin: isVert ? 'top' : 'left',
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')}), border-radius ${TRANSITIONS.DURATION}s`,
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: 'hidden',
        transform: `scale(${scale}) translate3d(${isVert ? '0, ' + offset : offset + ', 0'}, 0)`,
      }),
    )

    return () => {
      cleanup()
      timeoutIdRef.current = window.setTimeout(() => {
        if (initialBg) {
          document.body.style.background = initialBg
        } else {
          document.body.style.removeProperty('background')
        }
      }, TRANSITIONS.DURATION * 1000)
    }
  }, [
    open,
    shouldScaleBackground,
    direction,
    setBackgroundColorOnScale,
    noBodyStyles,
    initialBg,
  ])
}

export function useDrawerDrag({ ref, onOpenChange, holdUpThreshold = 10 }: UseDrawerDragProps): UseDrawerDragReturn {
  let isDragging = false
  let startY = 0
  let currentY = 0
  const FRAME_TIME = 4
  const SMOOTH_FACTOR = 1

  const updateTransform = useDebounce((deltaY: number) => {
    if (!ref?.current) return
    const limitedDeltaY = Math.max(-holdUpThreshold, Math.min(deltaY, window.innerHeight))
    const currentTransform =
      Number.parseFloat(ref.current.style.transform.replace('translateY(', '').replace('px)', '')) || 0
    const smoothedDeltaY = currentTransform + (limitedDeltaY - currentTransform) * SMOOTH_FACTOR

    ref.current.style.transform = `translateY(${Math.round(smoothedDeltaY)}px)`
  }, FRAME_TIME)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return // Only handle left mouse button
    isDragging = true
    startY = e.clientY
    currentY = startY

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaY = Math.round(e.clientY - startY)
      updateTransform(deltaY)
      currentY = e.clientY
    }

    const handleMouseUp = () => {
      if (!ref?.current) return
      isDragging = false
      const deltaY = Math.round(currentY - startY)
      const shouldClose = deltaY > 150 // Close if dragged more than 150px

      if (shouldClose && onOpenChange) {
        onOpenChange(false)
      } else {
        ref.current.style.transform = ''
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging = true
    startY = e.touches[0]?.clientY ?? 0
    currentY = startY
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !e.touches[0]) return
    const deltaY = Math.round(e.touches[0].clientY - startY)
    updateTransform(deltaY)
    currentY = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    if (!ref?.current) return
    isDragging = false
    const deltaY = Math.round(currentY - startY)
    const shouldClose = deltaY > 150 // Close if dragged more than 150px

    if (shouldClose && onOpenChange) {
      onOpenChange(false)
    } else {
      ref.current.style.transform = ''
    }
  }

  return {
    isDragging,
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
